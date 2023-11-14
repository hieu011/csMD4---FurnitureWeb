package com.example.furnitureweb.controller;

import com.example.furnitureweb.model.dto.authDTO.RegisterRequest;
import com.example.furnitureweb.model.dto.locationDTO.LocationRequest;
import com.example.furnitureweb.service.auth.AuthService;
import com.example.furnitureweb.service.locationService.LocationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@AllArgsConstructor
@Controller
public class AuthController {

    private final AuthService authService;

    private final LocationService locationService;
    @GetMapping("/login")
    public String showLogin(){
        return "/auth/login";
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model){
        model.addAttribute("user",new RegisterRequest());
        return "/auth/register";
    }

}
