package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
}
