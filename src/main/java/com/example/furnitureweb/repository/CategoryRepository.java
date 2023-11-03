package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}
