package com.example.furnitureweb.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String fullName;

    @Column(unique = true)
    private String phoneNumber;

    private String address;

    private String provinceName;

    private String districtName;

    private String wardName;

    @OneToOne
    private Location location;
}
