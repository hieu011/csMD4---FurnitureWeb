package com.example.furnitureweb.service.categoryService;

import com.example.furnitureweb.model.Category;
import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<OptionResponse> getAll(){
        return categoryRepository.findAll().stream()
                .map(category -> new OptionResponse(category.getId().toString(), category.getName()))
                .collect(Collectors.toList());
    }

    public Optional<Category> findByID(Long id){
        return categoryRepository.findById(id);
    }
}
