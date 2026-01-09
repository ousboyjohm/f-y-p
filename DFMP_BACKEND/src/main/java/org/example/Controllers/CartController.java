package org.example.Controllers;

import lombok.AllArgsConstructor;
import org.example.Models.Cart;
import org.example.Models.User;
import org.example.Services.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/carts")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class CartController {

    private final CartService cartService;

    @GetMapping("/{id}")
    public Optional<Cart> findCartById(@PathVariable Integer id){
        return cartService.findById(id);
    }

    @PostMapping("/customer")
    public Optional<Cart> findByCustomer(@RequestBody User customer) {
        return cartService.findByCustomer(customer);
    }

    @GetMapping
    public List<Cart> findAllCarts(){
        return cartService.findAll();
    }

    @PostMapping
    public Cart addCart(@RequestBody Cart cart) {
        return cartService.add(cart);
    }

    @PutMapping("/{id}")
    public Cart updateCart(@PathVariable Integer id, @RequestBody Cart cart) {
        return cartService.update(cart);
    }

    @DeleteMapping("/{id}")
    public boolean deleteCart(@PathVariable Integer id){
        return cartService.delete(id);
    }
}
