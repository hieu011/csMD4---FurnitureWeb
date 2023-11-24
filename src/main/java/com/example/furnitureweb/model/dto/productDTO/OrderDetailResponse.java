package com.example.furnitureweb.model.dto.productDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderDetailResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private Long quantity;
    private String file;
}
