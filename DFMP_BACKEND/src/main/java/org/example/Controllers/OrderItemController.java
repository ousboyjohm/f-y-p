package org.example.Controllers;


import lombok.AllArgsConstructor;
import org.example.Models.Category;
import org.example.Models.Order;
import org.example.Models.OrderItem;
import org.example.Models.Product;
import org.example.Services.OrderItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order-items")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class OrderItemController {

    private final OrderItemService orderItemService;

    @GetMapping("/{id}")
    public Optional<OrderItem> findOrderItemById(@PathVariable Integer id){
        return orderItemService.findById(id);
    }

    @PostMapping("/order")
    public List<OrderItem> findByOrder(@RequestBody Order order) {
        return orderItemService.findByOrder(order);
    }

    @GetMapping
    public List<OrderItem> findAllOrderItems(){
        return orderItemService.findAll();
    }

    @PostMapping
    public OrderItem addOrderItem(@RequestBody OrderItem orderItem) {
        return orderItemService.add(orderItem);
    }

    @PutMapping("/{id}")
    public OrderItem updateOrderItem(@PathVariable Integer id, @RequestBody OrderItem orderItem) {
        return orderItemService.update(orderItem);
    }

    @DeleteMapping("/{id}")
    public boolean deleteOrderItem(@PathVariable Integer id){
        return orderItemService.delete(id);
    }
}
