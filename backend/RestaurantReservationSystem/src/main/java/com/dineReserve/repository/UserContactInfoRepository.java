package com.dineReserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.UserContactInfo;

@Repository
public interface UserContactInfoRepository extends JpaRepository<UserContactInfo, Long>{

}
