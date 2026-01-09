package org.example.Repositories;

import org.example.Models.Category;
import org.example.Models.Product;
import org.example.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByCategory(Category category);
    List<Product> findBySeller(User seller);
}
