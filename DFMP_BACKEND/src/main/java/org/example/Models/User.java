package org.example.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String username;
    private String password;
    private String role;
    private String address;
    private String phoneNumber;

//    @OneToMany(mappedBy = "seller")
//    private List<Product> products;

//    @OneToMany(mappedBy = "customer")
//    private List<Order> orders;
}
