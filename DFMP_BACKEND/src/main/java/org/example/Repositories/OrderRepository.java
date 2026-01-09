package org.example.Repositories;

import org.example.Models.Order;
import org.example.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByCustomer(User customer);
}
