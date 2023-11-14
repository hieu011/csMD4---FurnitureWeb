package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

public interface ProductRepository extends JpaRepository<Product,Long> {
    @Query(value = "SELECT p FROM Product p " +
            "WHERE " +
            "p.name LIKE :search OR " +
            "p.category.name LIKE :search OR " +
            "p.material.name LIKE :search" )
    Page<Product> searchEverything(String search, Pageable pageable);

    @Query(value = "SELECT p FROM Product p " +
            "WHERE " +
            "p.id = :id")
    Product findProductByOrderDetail(Long id);
}
