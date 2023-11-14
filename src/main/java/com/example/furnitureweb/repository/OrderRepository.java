package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Order;
import com.example.furnitureweb.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order,Long> {
}
