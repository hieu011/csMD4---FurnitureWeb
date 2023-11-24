package com.example.furnitureweb.model.dto.categoryDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryListResponse {
    private Long id;

    private String name;

    private String description;

    public CategoryListResponse(Long id){
        this.id = id;
    }
}
