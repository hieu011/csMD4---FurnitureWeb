package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage,String> {
    ProductImage findProductImageById(String id);
}
