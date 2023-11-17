package com.example.furnitureweb.model.dto.authDTO;

import com.example.furnitureweb.model.Location;
import com.example.furnitureweb.model.dto.locationDTO.LocationRequest;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;

@Data
@NoArgsConstructor
public class RegisterRequest {

    @NotEmpty(message = "Vui lòng nhập Họ và Tên")
    private String fullName;

    @NotEmpty(message = "Vui lòng nhập SĐT")
    private String phoneNumber;

    @NotEmpty(message = "Vui lòng nhập tên tài khoản")
    private String username;

    @NotEmpty(message = "Vui lòng nhập mật khẩu")
    private String password;

    @NotEmpty(message = "Vui lòng nhập email")
    private String email;

    @NotEmpty(message = "Vui lòng nhập địa chỉ")
    private String address;

    private LocationRequest location;
}
