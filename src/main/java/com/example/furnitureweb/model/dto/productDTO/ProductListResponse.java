package com.example.furnitureweb.model.dto.productDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductListResponse {
    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private String category;

    private String material;

    private Long stockQuantity;

    private List<String> images;

    public ProductListResponse(Long id){
        this.id = id;
    }

}
