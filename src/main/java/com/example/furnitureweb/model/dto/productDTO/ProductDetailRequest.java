package com.example.furnitureweb.model.dto.productDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductDetailRequest {
    private Long productId;

    private Long quantity;
}
