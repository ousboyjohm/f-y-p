package org.example.Services;

import org.example.Models.Cart;
import org.example.Models.CartItem;
import org.example.Models.Category;
import org.example.Models.Product;
import org.example.Repositories.CartItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemService(CartItemRepository cartItemRepository){
        this.cartItemRepository = cartItemRepository;
    }

    public Optional<CartItem> findById(Integer id){
        return cartItemRepository.findById(id);
    }

    public List<CartItem> findByCart(Cart cart) {
        return cartItemRepository.findByCart(cart);
    }

    public List<CartItem> findAll(){
        return cartItemRepository.findAll();
    }

    public CartItem add(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public CartItem update(CartItem cartItem) {
        Integer id = cartItem.getId();
        Optional<CartItem> existingCartItemOpt = cartItemRepository.findById(id);
        CartItem existingCartItem;
        if(existingCartItemOpt.isPresent()){
            existingCartItem = existingCartItemOpt.get();
            existingCartItem.setQuantity(cartItem.getQuantity());
            existingCartItem.setProduct(cartItem.getProduct());
            existingCartItem.setCart(cartItem.getCart());

            cartItemRepository.save(existingCartItem);
        } else {
            return null;
        }
        return existingCartItem;
    }

    public boolean delete(Integer id){
        if (cartItemRepository.existsById(id)){
            cartItemRepository.deleteById(id);
        } else {
            return false;
        }
        return true;
    }
}
