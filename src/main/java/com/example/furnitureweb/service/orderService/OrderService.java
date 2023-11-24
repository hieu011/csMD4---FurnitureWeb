package com.example.furnitureweb.service.orderService;

import com.example.furnitureweb.model.*;
import com.example.furnitureweb.model.Enum.EStatusOrder;
import com.example.furnitureweb.model.dto.orderDTO.OrderRequest;
import com.example.furnitureweb.model.dto.orderDTO.OrderResponse;
import com.example.furnitureweb.model.dto.orderDTO.OrderStatusRequest;
import com.example.furnitureweb.model.dto.productDTO.OrderDetailResponse;
import com.example.furnitureweb.model.dto.productDTO.ProductDetailRequest;
import com.example.furnitureweb.model.dto.productDTO.ProductListResponse;
import com.example.furnitureweb.model.dto.productDTO.ProductSaveRequest;
import com.example.furnitureweb.model.dto.request.OptionRequest;
import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.model.dto.userDTO.UserBillResponse;
import com.example.furnitureweb.repository.*;
import com.example.furnitureweb.utils.AppUtils;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    private final OrderDetailRepository orderDetailRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final ProductImageRepository fileRepository;

    public void create(OrderRequest request){
        var order = AppUtils.mapper.map(request,Order.class);
        order.setStatus(EStatusOrder.CONFIRMED);
        order.setTotalPrice(BigDecimal.valueOf(Long.parseLong(request.getTotalPrice())));
        order.setOrderDate(LocalDateTime.now());
        User user = userRepository.findById(Long.valueOf(request.getIdUser())).get();
        order.setUser(user);
        orderRepository.save(order);
        userRepository.save(user);
        var products = productRepository.findAllById(request.getProducts().stream().map(ProductDetailRequest::getProductId).collect(Collectors.toList()));
        for (int i = 0; i < products.size(); i++){
            Long quantityOld = products.get(i).getStockQuantity();
            Long quantityOrder = request.getProducts().get(i).getQuantity();
            products.get(i).setStockQuantity(quantityOld - quantityOrder);
        }
        productRepository.saveAll(products);
        List<OrderDetail> orderDetails = new ArrayList<>();
        for( int i = 0; i < products.size(); i++ ){
            OrderDetail orderDetail = new OrderDetail(products.get(i).getName(),
                                                        products.get(i).getPrice(),
                                                        request.getProducts().get(i).getQuantity(),
                                                        products.get(i),
                                                        order,
                                                        user);
            orderDetails.add(orderDetail);
        }
        orderDetailRepository.saveAll(orderDetails);
    }

    public Page<OrderResponse> getAll(Pageable pageable, String search){
        search = "%" + search + "%";
        return orderRepository.searchEverything(search ,pageable).map(e -> {
            var result = AppUtils.mapper.map(e, OrderResponse.class);
            var userRes = AppUtils.mapper.map(e.getUser(), UserBillResponse.class);
            result.setUser(userRes);
            var orderDetails = orderDetailRepository.findAllByOrderId(e.getId());
            List<OrderDetailResponse> orderDetailResponses = new ArrayList<>();
            for (int i = 0; i < orderDetails.size(); i++){
                Product product = productRepository.findById(orderDetails.get(i).getProduct().getId()).get();
                ProductImage productImage = fileRepository.findProductImageByProduct(product);
                var orderDetail = AppUtils.mapper.map(product,OrderDetailResponse.class);
                orderDetail.setQuantity(orderDetails.get(i).getQuantity());
                orderDetail.setFile(productImage.getFileUrl());
                orderDetailResponses.add(orderDetail);
            }
            result.setProducts(orderDetailResponses);
            return result;
        });
    }

    public OrderResponse findById(Long id){
       Order order = orderRepository.findById(id).get();
        var result = AppUtils.mapper.map(order, OrderResponse.class);
        var userRes = AppUtils.mapper.map(order.getUser(), UserBillResponse.class);
        result.setUser(userRes);
        var orderDetails = orderDetailRepository.findAllByOrderId(order.getId());
        List<OrderDetailResponse> orderDetailResponses = new ArrayList<>();
        for (int i = 0; i < orderDetails.size(); i++){
            Product product = productRepository.findById(orderDetails.get(i).getProduct().getId()).get();
            ProductImage productImage = fileRepository.findProductImageByProduct(product);
            var orderDetail = AppUtils.mapper.map(product,OrderDetailResponse.class);
            orderDetail.setQuantity(orderDetails.get(i).getQuantity());
            orderDetail.setFile(productImage.getFileUrl());
            orderDetailResponses.add(orderDetail);
        }
        result.setProducts(orderDetailResponses);
        return result;
    }

    public void update(Long id, OrderStatusRequest request){
        Order order = orderRepository.findById(id).get();
       if(request.getStatus().equals("CONFIRMED")){
           order.setStatus(EStatusOrder.CONFIRMED);
        }
        if(request.getStatus().equals("COMPLETED")){
            order.setStatus(EStatusOrder.COMPLETED);
        }
        if(request.getStatus().equals("CANCELLED")){
            order.setStatus(EStatusOrder.CANCELLED);
        }
       orderRepository.save(order);
    }
}
