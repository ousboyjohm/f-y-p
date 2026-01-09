package org.example.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;
    private LocalDateTime orderDate;
    private BigDecimal totalPrice;
    @ManyToOne
    @JoinColumn(name = "shipping_details")
    private ShippingDetails shippingDetails;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

//    @OneToMany(mappedBy = "order")
//    private List<OrderItem> orderItems;
}
