package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Order;
import com.example.furnitureweb.model.OrderDetail;
import com.example.furnitureweb.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    @Query(value = "SELECT o FROM Order o " +
            "WHERE " +
            "o.user.fullName LIKE :search OR " +
            "o.status = :search" )
    Page<Order> searchEverything(String search, Pageable pageable);

}
