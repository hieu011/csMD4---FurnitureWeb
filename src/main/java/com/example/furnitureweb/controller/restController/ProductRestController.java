package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.Product;
import com.example.furnitureweb.model.dto.productDTO.ProductListResponse;
import com.example.furnitureweb.model.dto.productDTO.ProductSaveRequest;
import com.example.furnitureweb.service.productService.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductRestController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductListResponse>> getProducts(@PageableDefault(size = 5) Pageable pageable,
                                                                    @RequestParam(defaultValue = "") String search){
        return new ResponseEntity<>(productService.getAll(pageable, search), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductListResponse> create(@RequestBody ProductSaveRequest request){
        Product product = productService.   create(request);
        ProductListResponse productListResponse = new ProductListResponse(product.getId());
        return new ResponseEntity<>(productListResponse,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductListResponse> findById(@PathVariable Long id) {
        ProductListResponse product = productService.findById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductSaveRequest request, @PathVariable Long id) {
        productService.update(request, id);
        return ResponseEntity.ok().build();
    }
}
