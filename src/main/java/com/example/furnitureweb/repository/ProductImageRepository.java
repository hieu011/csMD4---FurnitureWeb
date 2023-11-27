package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Product;
import com.example.furnitureweb.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage,String> {
    ProductImage findProductImageById(String id);

    List<ProductImage> findProductImageByProduct(Product product);
}
