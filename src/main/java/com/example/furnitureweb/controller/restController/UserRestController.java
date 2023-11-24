package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.User;
import com.example.furnitureweb.model.dto.productDTO.ProductListResponse;
import com.example.furnitureweb.model.dto.userDTO.UserResponse;
import com.example.furnitureweb.service.userService.UserService;
import com.example.furnitureweb.utils.AppUtils;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserRestController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findById(@PathVariable String id) {
        Optional<User> userOptional = userService.findById(id);
        User user = userOptional.get();
        UserResponse userRes = AppUtils.mapper.map(user,UserResponse.class);
        userRes.setProvinceId(user.getLocation().getProvinceId());
        userRes.setDistrictId(user.getLocation().getDistrictId());
        userRes.setWardId(user.getLocation().getWardId());
        return new ResponseEntity<>(userRes, HttpStatus.OK);
    }
}
