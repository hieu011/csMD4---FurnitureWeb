package com.example.furnitureweb.service.categoryService;

import com.example.furnitureweb.model.Category;
import com.example.furnitureweb.model.dto.categoryDTO.CategoryListResponse;
import com.example.furnitureweb.model.dto.categoryDTO.CategorySaveRequest;
import com.example.furnitureweb.model.dto.response.OptionResponse;
import com.example.furnitureweb.repository.CategoryRepository;
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
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Page<CategoryListResponse> getAllByPage(Pageable pageable, String search) {
        search = "%" + search + "%";
        return categoryRepository.searchEverything(search, pageable).map(e -> {
            return AppUtils.mapper.map(e, CategoryListResponse.class);
        });
    }

    public List<OptionResponse> getAll(){
        return categoryRepository.findAll().stream()
                .map(category -> new OptionResponse(category.getId().toString(), category.getName()))
                .collect(Collectors.toList());
    }

    public CategoryListResponse findByIdToList(Long id) {
        var category = categoryRepository.findById(id).orElse(new Category());
        return AppUtils.mapper.map(category, CategoryListResponse.class);
    }

    public Optional<Category> findByID(Long id) {
        return categoryRepository.findById(id);
    }

    public Category create(CategorySaveRequest request) {
        var category = AppUtils.mapper.map(request, Category.class);
        categoryRepository.save(category);
        return category;
    }

    public void update(CategorySaveRequest request, Long id) {
        var category = categoryRepository.findById(id).orElse(new Category());
        AppUtils.mapper.map(request, category);
        categoryRepository.save(category);

    }
}
