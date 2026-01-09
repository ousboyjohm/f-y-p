package org.example.Services;

import org.example.Models.Category;
import org.example.Models.Product;
import org.example.Models.User;
import org.example.Repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public Optional<Product> findById(Integer id){
        return productRepository.findById(id);
    }

    public List<Product> findByCategory(Category category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> findBySeller(User seller) {
        return productRepository.findBySeller(seller);
    }

    public List<Product> findAll(){
        return productRepository.findAll();
    }

    public Product add(Product product) {
        return productRepository.save(product);
    }

    public Product update(Product product) {
        Integer id = product.getId();
        Optional<Product> existingProductOpt = productRepository.findById(id);
        Product existingProduct;
        if(existingProductOpt.isPresent()){
            existingProduct = existingProductOpt.get();
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPricePerUnit(product.getPricePerUnit());
            existingProduct.setStockQuantity(product.getStockQuantity());
            existingProduct.setImageUrl(product.getImageUrl());
            existingProduct.setSeller(product.getSeller());
            existingProduct.setCategory(product.getCategory());
            productRepository.save(existingProduct);
        } else {
            return null;
        }
        return existingProduct;
    }

    public boolean delete(Integer id){
        if (productRepository.existsById(id)){
            productRepository.deleteById(id);
        } else {
            return false;
        }
        return true;
    }
}
