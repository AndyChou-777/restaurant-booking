package com.dineReserve.service.impl;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dineReserve.exception.ResourceNotFoundException;
import com.dineReserve.model.dto.ReservationDTO;
import com.dineReserve.model.dto.RestaurantAvailabilityDTO;
import com.dineReserve.model.dto.RestaurantDTO;
import com.dineReserve.model.dto.RestaurantSearchDTO;
import com.dineReserve.model.entity.Reservation;
import com.dineReserve.model.entity.Restaurant;
import com.dineReserve.model.entity.RestaurantAvailability;
import com.dineReserve.repository.ReservationRepository;
import com.dineReserve.repository.RestaurantAvailabilityRepository;
import com.dineReserve.repository.RestaurantRepository;
import com.dineReserve.repository.UserRepository;
import com.dineReserve.service.RestaurantService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class RestaurantServiceImpl implements RestaurantService {
	
	@Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantAvailabilityRepository availabilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RestaurantDTO createRestaurant(RestaurantDTO dto) {
        Restaurant restaurant = modelMapper.map(dto, Restaurant.class);
        restaurant = restaurantRepository.save(restaurant);
        return modelMapper.map(restaurant, RestaurantDTO.class);
    }

    @Override
    public RestaurantDTO updateRestaurant(Long id, RestaurantDTO dto) {
        Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException());
        modelMapper.map(dto, restaurant);
        restaurant = restaurantRepository.save(restaurant);
        return modelMapper.map(restaurant, RestaurantDTO.class);
    }

    @Override
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        restaurantRepository.delete(restaurant);
    }

    @Override
    public List<RestaurantDTO> searchRestaurants(RestaurantSearchDTO searchDTO) {
        List<Restaurant> restaurants;
        if (searchDTO.getKeyword() != null) {
            restaurants = restaurantRepository.searchByKeyword(searchDTO.getKeyword());
        } else if (!searchDTO.getTags().isEmpty()) {
            restaurants = restaurantRepository.findByTags(searchDTO.getTags());
        } else {
            restaurants = restaurantRepository.findAll();
        }

        // 價格過濾
        if (searchDTO.getMinPrice() != null || searchDTO.getMaxPrice() != null) {
            restaurants = restaurants.stream()
                .filter(r -> (searchDTO.getMinPrice() == null || r.getAverageSpending() >= searchDTO.getMinPrice()) &&
                           (searchDTO.getMaxPrice() == null || r.getAverageSpending() <= searchDTO.getMaxPrice()))
                .collect(Collectors.toList());
        }

        return restaurants.stream()
                .map(restaurant -> modelMapper.map(restaurant, RestaurantDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantDTO> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(restaurant -> modelMapper.map(restaurant, RestaurantDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ReservationDTO createReservation(ReservationDTO dto) {
        validateAvailability(dto.getRestaurantId(), dto.getReservationTime());
        Reservation reservation = modelMapper.map(dto, Reservation.class);
        reservation.setStatus("CONFIRMED");
        reservation = reservationRepository.save(reservation);
        return modelMapper.map(reservation, ReservationDTO.class);
    }

    @Override
    public ReservationDTO updateReservation(Long id, ReservationDTO dto) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.getReservationTime().equals(dto.getReservationTime())) {
            validateAvailability(dto.getRestaurantId(), dto.getReservationTime());
        }

        modelMapper.map(dto, reservation);
        reservation = reservationRepository.save(reservation);
        return modelMapper.map(reservation, ReservationDTO.class);
    }

    @Override
    public void cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
    }

    @Override
    public List<ReservationDTO> getUserReservations(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(reservation -> modelMapper.map(reservation, ReservationDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void addAvailability(RestaurantAvailability dto) {
        RestaurantAvailability availability = modelMapper.map(dto, RestaurantAvailability.class);
        availability.setRestaurant(restaurantRepository.getReferenceById(dto.getRestaurantId()));
        availabilityRepository.save(availability);
    }

    @Override
    public List<RestaurantAvailabilityDTO> getAvailability(Long restaurantId, Date date) {
        return availabilityRepository.findByRestaurantIdAndDate(restaurantId, date).stream()
                .map(availability -> modelMapper.map(availability, RestaurantAvailabilityDTO.class))
                .collect(Collectors.toList());
    }

    private void validateAvailability(Long restaurantId, LocalDateTime reservationTime) {
        List<RestaurantAvailability> availabilities = 
            availabilityRepository.findByRestaurantIdAndDate(
                restaurantId, 
                Date.from(reservationTime.toInstant())
            );

        boolean isAvailable = availabilities.stream()
            .anyMatch(a -> isTimeInRange(reservationTime.toLocalTime(), a.getStartTime(), a.getEndTime()));

        if (!isAvailable) {
            throw new IllegalStateException("Selected time is not available");
        }
    }

    private boolean isTimeInRange(LocalTime time, LocalTime start, LocalTime end) {
        return !time.isBefore(start) && !time.isAfter(end);
    }
}
