package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Order;
import com.example.furnitureweb.model.OrderDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail,Long> {
    @Query(value = "SELECT od FROM OrderDetail od " +
            "WHERE od.order.id = :orderId ")
    List<OrderDetail> findAllByOrderId(Long orderId);
}
