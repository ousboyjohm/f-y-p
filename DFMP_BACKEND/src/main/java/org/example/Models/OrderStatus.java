package org.example.Models;

public enum OrderStatus {

    PENDING("Pending"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled"),
    SHIPPED("Shipped"),
    PROCESSING("Processing");

    private final String status;

     OrderStatus(String status){
        this.status = status;
    }
}
