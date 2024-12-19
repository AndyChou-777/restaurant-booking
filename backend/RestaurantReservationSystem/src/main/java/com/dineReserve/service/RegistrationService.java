package com.dineReserve.service;

import com.dineReserve.model.dto.BusinessUserRegistrationDTO;
import com.dineReserve.model.dto.GeneralUserRegistrationDTO;

public interface RegistrationService {
	
    void registerGeneralUser(GeneralUserRegistrationDTO generalUserDto);
    
    void registerBusinessUser(BusinessUserRegistrationDTO businessUserDto);
    
}

