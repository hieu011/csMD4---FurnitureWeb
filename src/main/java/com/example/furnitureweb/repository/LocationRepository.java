package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location,Long> {
    Location findLocationByProvinceIdAndDistrictIdAndWardIdAndAddress(String provinceId, String districtId, String wardId, String address);
}
