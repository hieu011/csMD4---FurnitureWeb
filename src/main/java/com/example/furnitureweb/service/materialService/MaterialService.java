package com.example.furnitureweb.service.materialService;

import com.example.furnitureweb.model.Category;
import com.example.furnitureweb.model.Material;
import com.example.furnitureweb.model.dto.categoryDTO.CategoryListResponse;
import com.example.furnitureweb.model.dto.categoryDTO.CategorySaveRequest;
import com.example.furnitureweb.model.dto.materialDTO.MaterialListResponse;
import com.example.furnitureweb.model.dto.materialDTO.MaterialSaveRequest;
import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.repository.MaterialRepository;
import com.example.furnitureweb.utils.AppUtils;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepository;

    public Page<MaterialListResponse> getAllByPage(Pageable pageable, String search) {
        search = "%" + search + "%";
        return materialRepository.searchEverything(search, pageable).map(e -> {
            return AppUtils.mapper.map(e, MaterialListResponse.class);
        });
    }

    public List<OptionResponse> getAll(){
        return materialRepository.findAll().stream()
                .map(material -> new OptionResponse(material.getId().toString(), material.getName()))
                .collect(Collectors.toList());
    }
    public Optional<Material> findByID(Long id){
        return materialRepository.findById(id);
    }

    public Material create(MaterialSaveRequest request) {
        var material = AppUtils.mapper.map(request, Material.class);
        materialRepository.save(material);
        return material;
    }
    public MaterialListResponse findByIdToList(Long id) {
        var material = materialRepository.findById(id).orElse(new Material());
        return AppUtils.mapper.map(material, MaterialListResponse.class);
    }
    public void update(MaterialSaveRequest request, Long id) {
        var material = materialRepository.findById(id).orElse(new Material());
        AppUtils.mapper.map(request, material);
        materialRepository.save(material);

    }
}
