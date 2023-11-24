package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.Product;
import com.example.furnitureweb.model.dto.orderDTO.OrderRequest;
import com.example.furnitureweb.model.dto.orderDTO.OrderResponse;
import com.example.furnitureweb.model.dto.orderDTO.OrderStatusRequest;
import com.example.furnitureweb.model.dto.productDTO.ProductListResponse;
import com.example.furnitureweb.model.dto.productDTO.ProductSaveRequest;
import com.example.furnitureweb.model.dto.productImageDTO.ProductImageResponse;
import com.example.furnitureweb.service.orderDetailService.OrderDetailService;
import com.example.furnitureweb.service.orderService.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/order")
@AllArgsConstructor
public class OrderRestController {

    private final OrderService orderService;
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request){
        orderService.create(request);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(@PageableDefault(size = 5) Pageable pageable,
                                                           @RequestParam(defaultValue = "") String search){
        return new ResponseEntity<>(orderService.getAll(pageable, search), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id){
        return new ResponseEntity<>(orderService.findById(id),HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateOrderById(@RequestBody OrderStatusRequest request,@PathVariable Long id){
        orderService.update(id, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
