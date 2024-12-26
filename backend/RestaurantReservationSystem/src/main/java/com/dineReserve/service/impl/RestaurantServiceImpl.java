package com.dineReserve.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dineReserve.exception.ResourceNotFoundException;
import com.dineReserve.exception.UserNotFoundException;
import com.dineReserve.model.dto.ReservationDTO;
import com.dineReserve.model.dto.AvailabilityDTO;
import com.dineReserve.model.dto.RestaurantDTO;
import com.dineReserve.model.dto.RestaurantSearchDTO;
import com.dineReserve.model.dto.TimeSlotDTO;
import com.dineReserve.model.entity.Reservation;
import com.dineReserve.model.entity.Restaurant;
import com.dineReserve.model.entity.RestaurantAvailability;
import com.dineReserve.model.entity.RestaurantImage;
import com.dineReserve.model.entity.RestaurantTag;
import com.dineReserve.model.entity.User;
import com.dineReserve.repository.ReservationRepository;
import com.dineReserve.repository.RestaurantAvailabilityRepository;
import com.dineReserve.repository.RestaurantImageRepository;
import com.dineReserve.repository.RestaurantRepository;
import com.dineReserve.repository.RestaurantTagRepository;
import com.dineReserve.repository.UserRepository;
import com.dineReserve.service.RestaurantService;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class RestaurantServiceImpl implements RestaurantService {
	
	@Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private RestaurantTagRepository restaurantTagRepository;

    @Autowired
    private RestaurantAvailabilityRepository availabilityRepository;
    
    @Autowired
    private RestaurantImageRepository restaurantImageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RestaurantDTO createRestaurant(Long userId, RestaurantDTO dto) {
        System.out.println("開始執行");
        
        // 1. 檢查並獲取用戶
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException());
        System.out.println("找到用戶: " + user);

        // 2. 創建並設置餐廳基本信息
        Restaurant restaurant = new Restaurant();
        restaurant.setName(dto.getName());
        restaurant.setAddress(dto.getAddress());
        restaurant.setAverageSpending(dto.getAverageSpending());
        restaurant.setDescription(dto.getDescription());
        restaurant.setOwner(user);
        
        // 3. 先保存餐廳以獲取ID
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        System.out.println("餐廳保存完成，ID: " + savedRestaurant.getId());

        // 4. 保存時間段
        for (TimeSlotDTO timeSlot : dto.getTimeSlots()) {
            RestaurantAvailability availability = new RestaurantAvailability();
            availability.setRestaurant(savedRestaurant);
            availability.setStartDate(timeSlot.getStartDate());
            availability.setEndDate(timeSlot.getEndDate());
            availability.setStartTime(timeSlot.getStartTime());
            availability.setEndTime(timeSlot.getEndTime());
            availabilityRepository.save(availability);
        }
        
        // 5. 創建並保存標籤
        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            List<RestaurantTag> tags = new ArrayList<>();
            for (String tagName : dto.getTags()) {
                RestaurantTag tag = new RestaurantTag();
                tag.setTag(tagName);
                tag.setRestaurant(savedRestaurant);
                tags.add(tag);
            }
            restaurantTagRepository.saveAll(tags);
            // 更新關聯
            savedRestaurant.setTags(tags);
            System.out.println("標籤保存完成: " + tags);
        }
        
        // 6. 創建並保存圖片
        if (dto.getImageBase64List() != null && !dto.getImageBase64List().isEmpty()) {
            List<RestaurantImage> images = new ArrayList<>();
            for (String imageBase64 : dto.getImageBase64List()) {
                RestaurantImage img = new RestaurantImage();
                img.setImageBase64(imageBase64);
                img.setRestaurant(savedRestaurant);
                images.add(img);
            }
            restaurantImageRepository.saveAll(images);
            // 更新關聯
            savedRestaurant.setImages(images);
            System.out.println("圖片保存完成: " + images);
        }
        
        // 7. 再次保存餐廳以更新關聯
        savedRestaurant = restaurantRepository.save(savedRestaurant);
        System.out.println("再次儲存完成: " + savedRestaurant);
        return modelMapper.map(savedRestaurant, RestaurantDTO.class);
    }

    @Override
    public RestaurantDTO updateRestaurant(Long id, RestaurantDTO dto) {
    	// 獲取餐廳
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException());

        // 更新基本資料
        restaurant.setName(dto.getName());
        restaurant.setAddress(dto.getAddress());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAverageSpending(dto.getAverageSpending());
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        // 清空並重新保存關聯的 Tags
        restaurantTagRepository.deleteByRestaurantId(id);
        List<RestaurantTag> newTags = dto.getTags().stream()
                .map(tag -> new RestaurantTag(restaurant, tag))
                .collect(Collectors.toList());
        restaurantTagRepository.saveAll(newTags);

        // 清空並重新保存關聯的 Images
        restaurantImageRepository.deleteByRestaurantId(id);
        List<RestaurantImage> newImages = dto.getImageBase64List().stream()
                .map(base64 -> new RestaurantImage(restaurant, base64))
                .collect(Collectors.toList());
        restaurantImageRepository.saveAll(newImages);

        // 清空並重新保存可預約時間段
        availabilityRepository.deleteByRestaurantId(id);
        List<RestaurantAvailability> newAvailabilities = dto.getTimeSlots().stream()
                .map(timeSlot -> new RestaurantAvailability(
                        restaurant, 
                        timeSlot.getStartDate(), timeSlot.getEndDate(), 
                        timeSlot.getStartTime(), timeSlot.getEndTime()))
                .collect(Collectors.toList());
        availabilityRepository.saveAll(newAvailabilities);

        // 返回更新後的資料
        savedRestaurant = restaurantRepository.save(savedRestaurant);
        System.out.println("更新完成的 Restaurant: " + savedRestaurant);
        return modelMapper.map(savedRestaurant, RestaurantDTO.class);
    }

    @Override
    public void deleteRestaurant(Long id) {     
    	Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("餐廳不存在"));

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
    public List<RestaurantDTO> getRestaurantsById(Long id) {
        return restaurantRepository.findByOwnerId(id).stream()
            .map(restaurant -> {
                RestaurantDTO dto = new RestaurantDTO();
                dto.setId(restaurant.getId());
                dto.setName(restaurant.getName());
                dto.setAddress(restaurant.getAddress());
                dto.setDescription(restaurant.getDescription());
                dto.setAverageSpending(restaurant.getAverageSpending());

                // 處理標籤
                List<String> tags = restaurant.getTags().stream()
                    .map(RestaurantTag::getTag)
                    .collect(Collectors.toList());
                dto.setTags(tags);

                // 處理圖片
                List<String> images = restaurant.getImages().stream()
                    .map(RestaurantImage::getImageBase64)
                    .collect(Collectors.toList());
                dto.setImageBase64List(images);

                // 處理營業時間段
                List<TimeSlotDTO> timeSlots = restaurant.getAvailabilities().stream()
                    .map(availability -> {
                        TimeSlotDTO timeSlot = new TimeSlotDTO();
                        timeSlot.setStartDate(availability.getStartDate());
                        timeSlot.setEndDate(availability.getEndDate());
                        timeSlot.setStartTime(availability.getStartTime());
                        timeSlot.setEndTime(availability.getEndTime());
                        return timeSlot;
                    })
                    .collect(Collectors.toList());
                dto.setTimeSlots(timeSlots);

                return dto;
            })
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

