package org.example.Services;

import org.example.Models.Category;
import org.example.Models.Order;
import org.example.Models.Product;
import org.example.Models.User;
import org.example.Repositories.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository){
        this.orderRepository = orderRepository;
    }

    public Optional<Order> findById(Integer id){
        return orderRepository.findById(id);
    }

    public List<Order> findByCustomer(User customer) {
        return orderRepository.findByCustomer(customer);
    }


    public List<Order> findAll(){
        return orderRepository.findAll();
    }

    public Order add(Order order) {
        return orderRepository.save(order);
    }

    public Order update(Order order) {
        Integer id = order.getId();
        Optional<Order> existingOrderOpt = orderRepository.findById(id);
        Order existingOrder;
        if(existingOrderOpt.isPresent()){
            existingOrder = existingOrderOpt.get();
            existingOrder.setOrderStatus(order.getOrderStatus());
            existingOrder.setOrderDate(order.getOrderDate());
            existingOrder.setTotalPrice(order.getTotalPrice());
            existingOrder.setShippingDetails(order.getShippingDetails());
            existingOrder.setCustomer(order.getCustomer());
            orderRepository.save(existingOrder);
        } else {
            return null;
        }
        return existingOrder;
    }

    public boolean delete(Integer id){
        if (orderRepository.existsById(id)){
            orderRepository.deleteById(id);
        } else {
            return false;
        }
        return true;
    }
}
