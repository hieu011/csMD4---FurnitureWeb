package com.example.furnitureweb.repository;

import com.example.furnitureweb.model.Product;
import com.example.furnitureweb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,String> {
    @Query(value = "SELECT u FROM User u where u.id = :id ")
    User findUserByOrderDetail(Long id);

    Optional<User> findByUsernameIgnoreCaseOrEmailIgnoreCaseOrPhoneNumber(String username, String email, String phoneNumber);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByPhoneNumber(String phoneNumber);

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);
}
