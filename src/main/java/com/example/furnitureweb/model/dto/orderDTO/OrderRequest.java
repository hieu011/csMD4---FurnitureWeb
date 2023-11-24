package com.example.furnitureweb.model.dto.orderDTO;

import com.example.furnitureweb.model.dto.productDTO.ProductDetailRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderRequest {
    private String idUser;
    private String totalPrice;
    private List<ProductDetailRequest> products;
    private String provinceName;
    private String districtName;
    private String wardName;
    private String address;
}
