package com.example.furnitureweb.model;

import com.example.furnitureweb.model.Enum.EStatusOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime orderDate;

    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private EStatusOrder status;

    private BigDecimal totalPrice;

    @OneToMany(mappedBy = "order")
    private List<OrderDetail> orderDetails;

    private String address;

    private String provinceName;

    private String districtName;

    private String wardName;

    @OneToOne
    private Location location;
}
