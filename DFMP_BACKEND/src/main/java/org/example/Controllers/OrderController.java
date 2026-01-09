package org.example.Controllers;

import lombok.AllArgsConstructor;
import org.example.Models.Order;
import org.example.Models.User;
import org.example.Services.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{id}")
    public Optional<Order> findOrderById(@PathVariable Integer id){
        return orderService.findById(id);
    }

    @PostMapping("/customer")
    public List<Order> findByCustomer(@RequestBody User customer) {
        return orderService.findByCustomer(customer);
    }

    @GetMapping
    public List<Order> findAllOrders(){
        return orderService.findAll();
    }

    @PostMapping
    public Order addOrder(@RequestBody Order order) {
        return orderService.add(order);
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Integer id, @RequestBody Order order) {
        return orderService.update(order);
    }

    @DeleteMapping("/{id}")
    public boolean deleteOrder(@PathVariable Integer id){
        return orderService.delete(id);
    }
}
