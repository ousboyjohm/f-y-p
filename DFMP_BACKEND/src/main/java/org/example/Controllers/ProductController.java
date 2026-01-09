package org.example.Controllers;

import lombok.AllArgsConstructor;
import org.example.Models.Category;
import org.example.Models.Product;
import org.example.Models.User;
import org.example.Services.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173",
            allowedHeaders = "*",
            methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{id}")
    public Optional<Product> findProductById(@PathVariable Integer id){
        return productService.findById(id);
    }

    @PostMapping("/category")
    public List<Product> findByCategory(@RequestBody Category category) {
        return productService.findByCategory(category);
    }

    @PostMapping("/seller")
    public List<Product> findBySeller(@RequestBody User seller) {
        return productService.findBySeller(seller);
    }

    @GetMapping
    public List<Product> findAllProducts(){
        return productService.findAll();
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.add(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        return productService.update(product);
    }

    @DeleteMapping("/{id}")
    public boolean deleteProduct(@PathVariable Integer id){
        return productService.delete(id);
    }
}
