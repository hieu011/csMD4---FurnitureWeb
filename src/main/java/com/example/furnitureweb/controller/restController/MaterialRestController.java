package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.Material;
import com.example.furnitureweb.model.Product;
import com.example.furnitureweb.model.dto.categoryDTO.CategoryListResponse;
import com.example.furnitureweb.model.dto.categoryDTO.CategorySaveRequest;
import com.example.furnitureweb.model.dto.materialDTO.MaterialListResponse;
import com.example.furnitureweb.model.dto.materialDTO.MaterialSaveRequest;
import com.example.furnitureweb.model.dto.productDTO.ProductListResponse;
import com.example.furnitureweb.model.dto.productDTO.ProductSaveRequest;
import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.service.materialService.MaterialService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@AllArgsConstructor
public class MaterialRestController {
    private final MaterialService materialService;

    @GetMapping
    public ResponseEntity<Page<MaterialListResponse>> getMaterialByPage(@PageableDefault(size = 5) Pageable pageable,
                                                                    @RequestParam(defaultValue = "") String search) {
        return new ResponseEntity<>(materialService.getAllByPage(pageable,search),HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<?> getCategories() {
        return new ResponseEntity<>(materialService.getAll(),HttpStatus.OK);
    }
     @PostMapping
    public ResponseEntity<MaterialListResponse> create(@RequestBody MaterialSaveRequest request){
        Material material = materialService.create(request);
        MaterialListResponse materialListResponse = new MaterialListResponse(material.getId());
        return new ResponseEntity<>(materialListResponse, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<MaterialListResponse> findById(@PathVariable Long id) {
        MaterialListResponse material = materialService.findByIdToList(id);
        return new ResponseEntity<>(material, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMaterial(@RequestBody MaterialSaveRequest request, @PathVariable Long id) {
        materialService.update(request, id);
        return ResponseEntity.ok().build();
    }

}
