package com.example.furnitureweb.service.locationService;

import com.example.furnitureweb.model.Location;
import com.example.furnitureweb.model.dto.authDTO.RegisterRequest;
import com.example.furnitureweb.model.dto.locationDTO.LocationRequest;
import com.example.furnitureweb.repository.LocationRepository;
import com.example.furnitureweb.utils.AppUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;

    public void createLocation(LocationRequest request){
        var location = AppUtils.mapper.map(request,Location.class);
        locationRepository.save(location);
    }
}
