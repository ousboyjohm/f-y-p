package org.example.Repositories;

import org.example.Models.Cart;
import org.example.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    Optional<Cart> findByCustomer(User customer);
}
