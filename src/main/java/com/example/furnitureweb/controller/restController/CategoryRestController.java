package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.dto.productDTO.ProductListResponse;
import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.service.categoryService.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@AllArgsConstructor
public class CategoryRestController {
    private final CategoryService categoryService;

    @GetMapping
    public List<OptionResponse> getCategories(){
        return categoryService.getAll();
    }

}
