package com.example.furnitureweb.service.materialService;

import com.example.furnitureweb.model.Category;
import com.example.furnitureweb.model.Material;
import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.repository.MaterialRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepository;

    public List<OptionResponse> getAll(){
        return materialRepository.findAll().stream()
                .map(material -> new OptionResponse(material.getId().toString(), material.getName()))
                .collect(Collectors.toList());
    }

    public Optional<Material> findByID(Long id){
        return materialRepository.findById(id);
    }
}
