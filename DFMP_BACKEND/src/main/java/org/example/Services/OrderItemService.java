package org.example.Services;

import org.example.Models.Category;
import org.example.Models.Order;
import org.example.Models.OrderItem;
import org.example.Models.Product;
import org.example.Repositories.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository){
        this.orderItemRepository = orderItemRepository;
    }

    public Optional<OrderItem> findById(Integer id){
        return orderItemRepository.findById(id);
    }

    public List<OrderItem> findByOrder(Order order) {
        return orderItemRepository.findByOrder(order);
    }


    public List<OrderItem> findAll(){
        return orderItemRepository.findAll();
    }

    public OrderItem add(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public OrderItem update(OrderItem orderItem) {
        Integer id = orderItem.getId();
        Optional<OrderItem> existingOrderItemOpt = orderItemRepository.findById(id);
        OrderItem existingOrderItem;
        if(existingOrderItemOpt.isPresent()){
            existingOrderItem = existingOrderItemOpt.get();
            existingOrderItem.setQuantity(orderItem.getQuantity());
            existingOrderItem.setPriceAtPurchase(orderItem.getPriceAtPurchase());
            existingOrderItem.setProduct(orderItem.getProduct());
            existingOrderItem.setOrder(orderItem.getOrder());
            orderItemRepository.save(existingOrderItem);
        } else {
            return null;
        }
        return existingOrderItem;
    }

    public boolean delete(Integer id){
        if (orderItemRepository.existsById(id)){
            orderItemRepository.deleteById(id);
        } else {
            return false;
        }
        return true;
    }
}
