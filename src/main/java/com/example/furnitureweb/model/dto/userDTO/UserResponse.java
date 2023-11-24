package com.example.furnitureweb.model.dto.userDTO;

import com.example.furnitureweb.model.dto.locationDTO.LocationRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
public class UserResponse {

    private String fullName;

    private String phoneNumber;

    private String email;

    private String address;

    private String provinceId;

    private String districtId;

    private String wardId;

}
