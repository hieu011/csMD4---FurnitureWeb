package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.Location;
import com.example.furnitureweb.model.dto.locationDTO.LocationRequest;
import com.example.furnitureweb.model.dto.productImageDTO.ProductImageResponse;
import com.example.furnitureweb.service.locationService.LocationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/location")
@AllArgsConstructor
public class LocationRestController {
    private final LocationService locationService;

    @PostMapping()
    public ResponseEntity<LocationRequest> createLocation(@RequestBody LocationRequest request) throws IOException {
        locationService.createLocation(request);
        return new ResponseEntity<>(request,HttpStatus.CREATED);
    }
}
