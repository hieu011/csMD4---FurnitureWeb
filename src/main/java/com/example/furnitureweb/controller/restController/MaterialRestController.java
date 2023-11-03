package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.service.materialService.MaterialService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@AllArgsConstructor
public class MaterialRestController {
    private final MaterialService materialService;

    @GetMapping
    public List<OptionResponse> getMaterials(){
        return materialService.getAll();
    }

}
