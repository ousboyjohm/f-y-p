package org.example.Repositories;

import org.example.Models.Cart;
import org.example.Models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByCart(Cart cart);
    @Modifying
    int deleteAllByCartId(Integer cartId);
}
