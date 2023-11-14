package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.OrderDetail;
import com.example.furnitureweb.model.Product;
import com.example.furnitureweb.model.dto.productDTO.ProductListResponse;
import com.example.furnitureweb.model.dto.productDTO.ProductSaveRequest;
import com.example.furnitureweb.model.dto.request.OrderDetailRequest;
import com.example.furnitureweb.service.orderDetailService.OrderDetailService;
import com.example.furnitureweb.service.orderService.OrderService;
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

    private final OrderService orderService;

    private final OrderDetailService orderDetailService;

    @GetMapping
    public ResponseEntity<Page<ProductListResponse>> getProducts(@PageableDefault(size = 5) Pageable pageable,
                                                                    @RequestParam(defaultValue = "") String search){
        return new ResponseEntity<>(productService.getAll(pageable, search), HttpStatus.OK);
    }

    @GetMapping("/client")
    public ResponseEntity<Page<ProductListResponse>> getProductsToClient(@PageableDefault(size = 8) Pageable pageable,
                                                                 @RequestParam(defaultValue = "") String search){
        return new ResponseEntity<>(productService.getAll(pageable, search), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductListResponse> create(@RequestBody ProductSaveRequest request){
        Product product = productService.create(request);
        ProductListResponse productListResponse = new ProductListResponse(product.getId());
        return new ResponseEntity<>(productListResponse,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductListResponse> findById(@PathVariable Long id) {
        ProductListResponse product = productService.findById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<ProductListResponse> findByIdForClient(@PathVariable Long id) {
        ProductListResponse product = productService.findByIdForClient(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductSaveRequest request, @PathVariable Long id) {
        productService.update(request, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/orderDetails")
    public ResponseEntity<?> addNewOrderDetail(@RequestBody OrderDetailRequest request){
        orderDetailService.create(request);
        return new ResponseEntity<>("Thêm vào giỏ hàng thành công",HttpStatus.OK);
    }
}
