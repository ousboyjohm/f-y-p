package org.example.Controllers;

import lombok.AllArgsConstructor;
import org.example.Models.Category;
import org.example.Services.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/{id}")
    public Optional<Category> findCategoryById(@PathVariable Integer id){
        return categoryService.findById(id);
    }

    @GetMapping
    public List<Category> findAllCategories(){
        return categoryService.findAll();
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryService.add(category);
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        return categoryService.update(category);
    }

    @DeleteMapping("/{id}")
    public boolean deleteCategory(@PathVariable Integer id){
        return categoryService.delete(id);
    }
}
