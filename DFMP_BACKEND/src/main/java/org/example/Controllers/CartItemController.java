package org.example.Controllers;

import lombok.AllArgsConstructor;
import org.example.Models.Cart;
import org.example.Models.CartItem;
import org.example.Models.Category;
import org.example.Models.Product;
import org.example.Services.CartItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart-items")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT})
public class CartItemController {

    private final CartItemService cartItemService;

    @GetMapping("/{id}")
    public Optional<CartItem> findCartItemById(@PathVariable Integer id){
        return cartItemService.findById(id);
    }

    @PostMapping("/cart")
    public List<CartItem> findByCart(@RequestBody Cart cart) {
        return cartItemService.findByCart(cart);
    }

    @GetMapping
    public List<CartItem> findAllCartItems(){
        return cartItemService.findAll();
    }

    @PostMapping
    public CartItem addCartItem(@RequestBody CartItem cartItem) {
        return cartItemService.add(cartItem);
    }

    @PutMapping("/{id}")
    public CartItem updateCartItem(@PathVariable Integer id, @RequestBody CartItem cartItem) {
        return cartItemService.update(cartItem);
    }

    @DeleteMapping("/{id}")
    public boolean deleteCartItem(@PathVariable Integer id){
        return cartItemService.delete(id);
    }

    @DeleteMapping("/cart/{cartId}")
    public boolean deleteAllCartItems(@PathVariable Integer cartId) {
        return cartItemService.deleteByCartId(cartId);
    }

}
