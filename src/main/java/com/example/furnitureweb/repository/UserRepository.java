package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
}
