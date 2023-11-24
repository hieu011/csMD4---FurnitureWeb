package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Category;
import com.example.furnitureweb.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category,Long> {
    @Query(value = "SELECT c FROM Category c " +
            "WHERE " +
            "c.name LIKE :search OR " +
            "c.description LIKE :search" )
    Page<Category> searchEverything(String search, Pageable pageable);

}
