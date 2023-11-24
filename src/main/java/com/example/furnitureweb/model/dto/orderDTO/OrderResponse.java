package com.example.furnitureweb.model.dto.orderDTO;

import com.example.furnitureweb.model.Enum.EStatusOrder;
import com.example.furnitureweb.model.dto.productDTO.OrderDetailResponse;
import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.model.dto.userDTO.UserBillResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderResponse {
    private Long id;
    private UserBillResponse user;
    private BigDecimal totalPrice;
    private LocalDateTime orderDate;
    private EStatusOrder status;
    private List<OrderDetailResponse> products;
    private String address;
    private String provinceName;
    private String districtName;
    private String wardName;

}
