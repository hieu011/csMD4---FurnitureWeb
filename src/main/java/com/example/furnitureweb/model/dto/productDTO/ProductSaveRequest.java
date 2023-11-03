package com.example.furnitureweb.model.dto.productDTO;

import com.example.furnitureweb.model.dto.request.OptionRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSaveRequest {
    private String name;

    private String description;

    private String price;

    private OptionRequest categoryId;

    private OptionRequest materialId;

    private String stockQuantity;

    private List<OptionRequest> files;
}
