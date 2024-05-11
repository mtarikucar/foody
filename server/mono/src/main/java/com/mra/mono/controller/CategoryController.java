package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.dto.entity.Category;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.CategoryAddReq;
import com.mra.mono.dto.request.CategoryUpdateReq;
import com.mra.mono.service.CategoryService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("category")
@Slf4j
@AllArgsConstructor
@NoArgsConstructor
public class CategoryController extends BaseController {

    @Resource
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Message<List<Category>>> getAllCategories(@RequestParam Optional<UUID> CompanyId ) {
        try {
            List<Category> categories;
            if (CompanyId.isPresent()) {
                categories = categoryService.findByCompanyId(CompanyId);
            } else {
                categories = categoryService.findAll();
            }

            if (categories.isEmpty()) {
                log.warn("No product categories found");
                return buildReturnEntity("No product categories found", 301);
            }

            return buildSuccessReturnEntity(categories);
        } catch (Exception e) {
            log.error("Error while fetching product categories", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message<Category>> getCategoryById(@PathVariable UUID id) {
        try {
            Optional<Category> productCategory = categoryService.findById(id);
            if (productCategory.isPresent()) {
                return buildSuccessReturnEntity(productCategory.get());
            } else {
                log.warn("Product category not found with id: {}", id);
                return buildReturnEntity("Product category not found with id"+id,301);
            }
        } catch (Exception e) {
            log.error("Error while fetching product category with id: {}", id, e);
            return buildFailureReturnEntity(FAILURE);
        }
    }

    @PostMapping
    public ResponseEntity<Message<Category>> createCategory(@RequestBody @Valid CategoryAddReq category) {
        try {
            Category savedCategory = categoryService.save(category);
            return buildSuccessReturnEntity(savedCategory);
        } catch (Exception e) {
            log.error("Error while creating product category", e);
            return buildReturnEntity("Error while creating product category"+e,404);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message<Category>> updateCategory(@PathVariable UUID id, @RequestBody CategoryUpdateReq category) {
        try {
            if (categoryService.existsById(id)) {
                Category updatedCategory = categoryService.update(id,category);
                return buildSuccessReturnEntity(updatedCategory);
            } else {
                log.warn("Product category not found with id: {}", id);
                return buildReturnEntity("Product category not found with id: {}"+ id,301);
            }
        } catch (Exception e) {
            log.error("Error while updating product category with id: {}", id, e);
            return buildReturnEntity("Error while updating product category with id: {}"+ id,404);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Message<String>> deleteCategory(@PathVariable UUID id) {
        try {
            if (categoryService.existsById(id)) {
                categoryService.deleteById(id);
                return buildSuccessReturnEntity(SUCCESS);
            } else {
                log.warn("Product category not found with id: {}", id);
                return buildReturnEntity("Product category not found with id: {}"+ id,301);
            }
        } catch (Exception e) {
            log.error("Error while updating product category with id: {}", id, e);
            return buildReturnEntity("Error while updating product category with id: {}"+ id,404);
        }
    }
}
