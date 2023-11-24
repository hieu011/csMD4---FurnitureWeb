package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Category;
import com.example.furnitureweb.model.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MaterialRepository extends JpaRepository<Material,Long> {
    @Query(value = "SELECT m FROM Material m " +
            "WHERE " +
            "m.name LIKE :search " )
    Page<Material> searchEverything(String search, Pageable pageable);

}
