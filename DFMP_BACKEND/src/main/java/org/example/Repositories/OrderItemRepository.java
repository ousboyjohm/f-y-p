package org.example.Repositories;

import org.example.Models.Order;
import org.example.Models.OrderItem;
import org.example.Models.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrder(Order order);
    List<OrderItem> findByProduct(Product product);
}
