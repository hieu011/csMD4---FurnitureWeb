package com.example.furnitureweb.service.orderDetailService;

import com.example.furnitureweb.model.*;
import com.example.furnitureweb.model.dto.productDTO.ProductSaveRequest;
import com.example.furnitureweb.model.dto.request.OptionRequest;
import com.example.furnitureweb.model.dto.request.OrderDetailRequest;
import com.example.furnitureweb.repository.OrderDetailRepository;
import com.example.furnitureweb.repository.OrderRepository;
import com.example.furnitureweb.repository.ProductRepository;
import com.example.furnitureweb.repository.UserRepository;
import com.example.furnitureweb.utils.AppUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderDetailService {
    private final OrderDetailRepository orderDetailRepository;

    private final OrderRepository orderRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    public void create(OrderDetailRequest request){
        OrderDetail orderDetail = new OrderDetail();
        Product product = productRepository.findProductByOrderDetail(Long.valueOf(request.getProductId()));
//        User user = userRepository.findUserByOrderDetail(Long.valueOf(request.getUserID()));
        orderDetail.setName(product.getName());
        orderDetail.setPrice(product.getPrice());
        orderDetail.setQuantity(Long.valueOf(request.getQuantity()));
        orderDetail.setProduct(product);
//        orderDetail.setUser(user);
        orderDetailRepository.save(orderDetail);
    }
}
