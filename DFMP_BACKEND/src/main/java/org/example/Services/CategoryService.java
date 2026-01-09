package org.example.Services;

import org.example.Models.Category;
import org.example.Repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    public Optional<Category> findById(Integer id){
        return categoryRepository.findById(id);
    }

    public List<Category> findAll(){
        return categoryRepository.findAll();
    }

    public Category add(Category category) {
        return categoryRepository.save(category);
    }

    public Category update(Category category) {
        Integer id = category.getId();
        Optional<Category> existingCategoryOpt = categoryRepository.findById(id);
        Category existingCategory;
        if(existingCategoryOpt.isPresent()){
            existingCategory = existingCategoryOpt.get();
            existingCategory.setName(category.getName());
            existingCategory.setDescription(category.getDescription());
            categoryRepository.save(existingCategory);
        } else {
            return null;
        }
        return existingCategory;
    }

    public boolean delete(Integer id){
        if (categoryRepository.existsById(id)){
            categoryRepository.deleteById(id);
        } else {
            return false;
        }
        return true;
    }
}
