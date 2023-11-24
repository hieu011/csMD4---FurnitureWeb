package com.example.furnitureweb.model.dto.materialDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaterialListResponse {
    private Long id;

    private String name;
    public MaterialListResponse(Long id){
        this.id = id;
    }
}
