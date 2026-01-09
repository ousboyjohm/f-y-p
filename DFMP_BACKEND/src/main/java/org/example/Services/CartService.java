package org.example.Services;

import org.example.Models.Cart;
import org.example.Models.User;
import org.example.Repositories.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository){
        this.cartRepository = cartRepository;
    }

    public Optional<Cart> findById(Integer id){
        return cartRepository.findById(id);
    }

    public Optional<Cart> findByCustomer(User customer) {
        return cartRepository.findByCustomer(customer);
    }

    public List<Cart> findAll(){
        return cartRepository.findAll();
    }

    public Cart add(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart update(Cart cart) {
        Integer id = cart.getId();
        Optional<Cart> existingCartOpt = cartRepository.findById(id);
        Cart existingCart;
        if(existingCartOpt.isPresent()){
            existingCart = existingCartOpt.get();
            existingCart.setCustomer(cart.getCustomer());
            cartRepository.save(existingCart);
        } else {
            return null;
        }
        return existingCart;
    }

    public boolean delete(Integer id){
        if (cartRepository.existsById(id)){
            cartRepository.deleteById(id);
        } else {
            return false;
        }
        return true;
    }
}
