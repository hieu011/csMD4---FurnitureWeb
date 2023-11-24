package com.example.furnitureweb.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private BigDecimal price;

    private Long quantity;


    @ManyToOne
    private Product product;

    @ManyToOne
    private Order order;

    @ManyToOne
    private User user;

    public OrderDetail(String name, BigDecimal price, Long quantity, Product product, Order order, User user) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.product = product;
        this.order = order;
        this.user = user;
    }
}
