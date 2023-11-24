package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.Category;
import com.example.furnitureweb.model.Product;
import com.example.furnitureweb.model.dto.categoryDTO.CategoryListResponse;
import com.example.furnitureweb.model.dto.categoryDTO.CategorySaveRequest;
import com.example.furnitureweb.model.dto.productDTO.ProductListResponse;
import com.example.furnitureweb.model.dto.productDTO.ProductSaveRequest;
import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.service.categoryService.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@AllArgsConstructor
public class CategoryRestController {
    private final CategoryService categoryService;


    @GetMapping("/all")
    public ResponseEntity<?> getCategoriesByPage() {
        return new ResponseEntity<>(categoryService.getAll(), HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<Page<CategoryListResponse>> getCategoriesByPage(@PageableDefault(size = 5) Pageable pageable,
                                                                          @RequestParam(defaultValue = "") String search) {
        return new ResponseEntity<>(categoryService.getAllByPage(pageable, search), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CategoryListResponse> create(@RequestBody CategorySaveRequest request) {
        Category category = categoryService.create(request);
        CategoryListResponse categoryListResponse = new CategoryListResponse(category.getId());
        return new ResponseEntity<>(categoryListResponse, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryListResponse> findById(@PathVariable Long id) {
        CategoryListResponse category = categoryService.findByIdToList(id);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@RequestBody CategorySaveRequest request, @PathVariable Long id) {
        categoryService.update(request, id);
        return ResponseEntity.ok().build();
    }

}
