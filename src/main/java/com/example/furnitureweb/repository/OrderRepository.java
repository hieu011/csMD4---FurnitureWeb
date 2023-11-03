package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order,Long> {
}
