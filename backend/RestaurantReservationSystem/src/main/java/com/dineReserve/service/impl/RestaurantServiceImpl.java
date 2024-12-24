package com.dineReserve.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dineReserve.exception.ResourceNotFoundException;
import com.dineReserve.model.dto.ReservationDTO;
import com.dineReserve.model.dto.AvailabilityDTO;
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
        // 創建餐廳
        Restaurant restaurant = modelMapper.map(dto, Restaurant.class);
        restaurant = restaurantRepository.save(restaurant);
        
        // 創建可用時間
        RestaurantAvailability availability = new RestaurantAvailability();
        availability.setRestaurant(restaurant);
        availability.setStartDate(dto.getStartDate());
        availability.setEndDate(dto.getEndDate());
        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());
        
        availabilityRepository.save(availability);
        
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
            .orElseThrow(() -> new ResourceNotFoundException());

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
            .orElseThrow(() -> new ResourceNotFoundException());
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
    public void addAvailability(AvailabilityDTO dto) {
        // 驗證日期範圍
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("結束日期不能早於開始日期");
        }

        // 檢查時間範圍是否有重疊
        boolean hasOverlap = availabilityRepository.hasOverlappingAvailability(
            dto.getRestaurantId(), 
            dto.getStartDate(), 
            dto.getEndDate()
        );

        if (hasOverlap) {
            throw new IllegalStateException("指定的日期範圍與現有的可用時間重疊");
        }

        // 使用 ModelMapper 轉換 DTO 至實體類別
        RestaurantAvailability availability = modelMapper.map(dto, RestaurantAvailability.class);
        availability.setRestaurant(restaurantRepository.getReferenceById(dto.getRestaurantId()));

        availabilityRepository.save(availability);
    }
    
    @Override
    public void updateAvailability(Long availabilityId, AvailabilityDTO dto) {
        RestaurantAvailability availability = availabilityRepository.findById(availabilityId)
            .orElseThrow(() -> new ResourceNotFoundException());

        // 驗證日期範圍
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("結束日期不能早於開始日期");
        }

        // 檢查時間範圍是否與其他記錄重疊（排除當前記錄）
        boolean hasOverlap = availabilityRepository.hasOverlappingAvailabilityExcluding(
            dto.getRestaurantId(),
            dto.getStartDate(),
            dto.getEndDate(),
            availabilityId
        );

        if (hasOverlap) {
            throw new IllegalStateException("指定的日期範圍與其他時段重疊");
        }

        // 檢查是否有在此時段的預約
        List<Reservation> existingReservations = reservationRepository.findByRestaurantId(dto.getRestaurantId())
            .stream()
            .filter(r -> {
                LocalDate reservationDate = r.getReservationTime().toLocalDate();
                return !reservationDate.isBefore(dto.getStartDate()) && 
                       !reservationDate.isAfter(dto.getEndDate()) &&
                       "CONFIRMED".equals(r.getStatus());
            })
            .collect(Collectors.toList());

        if (!existingReservations.isEmpty()) {
            throw new IllegalStateException("無法修改該時段，已有確認的預約存在");
        }

        // 更新可用時段
        availability.setStartDate(dto.getStartDate());
        availability.setEndDate(dto.getEndDate());
        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());

        availabilityRepository.save(availability);
    }
    
    @Override
    public void deleteAvailability(Long availabilityId) {
        RestaurantAvailability availability = availabilityRepository.findById(availabilityId)
            .orElseThrow(() -> new ResourceNotFoundException());

        // 檢查是否有在此時段的預約
        List<Reservation> existingReservations = reservationRepository.findByRestaurantId(availability.getRestaurant().getId())
            .stream()
            .filter(r -> {
                LocalDate reservationDate = r.getReservationTime().toLocalDate();
                return !reservationDate.isBefore(availability.getStartDate()) && 
                       !reservationDate.isAfter(availability.getEndDate()) &&
                       "CONFIRMED".equals(r.getStatus());
            })
            .collect(Collectors.toList());

        if (!existingReservations.isEmpty()) {
            throw new IllegalStateException("無法刪除該時段，已有確認的預約存在");
        }

        availabilityRepository.delete(availability);
    }
    
    @Override
    public List<AvailabilityDTO> getRestaurantAllAvailabilities(Long restaurantId) {
        // 檢查餐廳是否存在
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException();
        }

        // 直接使用 ModelMapper 進行對象映射
        return availabilityRepository.findByRestaurantIdOrderByStartDateAsc(restaurantId)
            .stream()
            .map(availability -> modelMapper.map(availability, AvailabilityDTO.class))  // 直接映射
            .collect(Collectors.toList());
    }

    @Override
    public List<AvailabilityDTO> getAvailability(Long restaurantId, LocalDate date) {
        return availabilityRepository.findByRestaurantIdAndDate(restaurantId, date)
            .stream()
            .map(entity -> modelMapper.map(entity, AvailabilityDTO.class))  // 使用 ModelMapper 轉換
            .collect(Collectors.toList());
    }

    private void validateAvailability(Long restaurantId, LocalDateTime reservationTime) {
        List<RestaurantAvailability> availabilities = 
            availabilityRepository.findByRestaurantIdAndDate(
                restaurantId, 
                reservationTime.toLocalDate()
            );
        
        boolean isAvailable = availabilities.stream()
            .anyMatch(a -> isTimeInRange(reservationTime.toLocalTime(), a.getStartTime(), a.getEndTime()));
            
        if (!isAvailable) {
            throw new IllegalStateException("所選時間不可預約");
        }
    }

    private boolean isTimeInRange(LocalTime time, LocalTime start, LocalTime end) {
        return !time.isBefore(start) && !time.isAfter(end);
    }
}
