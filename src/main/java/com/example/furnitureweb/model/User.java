package com.example.furnitureweb.model;

import com.example.furnitureweb.model.Enum.ERole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import javax.persistence.*;
import java.util.List;

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
    private String username;

    private String password;

    @Column(unique = true)
    private String email;

    private String fullName;

    @Column(unique = true)
    private String phoneNumber;

    @Enumerated(value = EnumType.STRING)
    private ERole role;

    private String address;

    private String provinceName;

    private String districtName;

    private String wardName;

    @OneToOne
    private Location location;

    @OneToMany
    private List<OrderDetail> orderDetail;
}
