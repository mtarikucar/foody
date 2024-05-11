package com.mra.mono.service;

import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.Category;
import com.mra.mono.dto.request.CategoryAddReq;
import com.mra.mono.dto.request.CategoryUpdateReq;
import com.mra.mono.repository.CategoryRepository;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class CategoryService {

    @Resource
    private CategoryRepository categoryRepository;

    public List<Category> findAll() {
        try {
            return categoryRepository.findAll();
        } catch (Exception e) {
            log.error("Error while fetching all product categories", e);
            throw e;
        }
    }

    public Category save(CategoryAddReq categoryAddReq) {
        try {
            Category category = new Category();

            BeanUtils.copyProperties(categoryAddReq, category);
            category.setCreateTime(new Date());
            category.setCategoryId(UUID.randomUUID());
            return categoryRepository.save(category);
        } catch (Exception e) {
            log.error("Error while saving product category", e);
            throw e;
        }
    }

    public Optional<Category> findById(UUID id) {
        try {
            return categoryRepository.findById(id);
        } catch (Exception e) {
            log.error("Error while fetching product category by ID", e);
            throw e;
        }
    }

    public boolean existsById(UUID id) {
        try {
            return categoryRepository.existsById(id);
        } catch (Exception e) {
            log.error("Error while checking if product category exists by ID", e);
            throw e;
        }
    }

    public void deleteById(UUID id) {
        try {
            categoryRepository.deleteById(id);
        } catch (Exception e) {
            log.error("Error while deleting product category by ID", e);
            throw e;
        }
    }


    public Category update(UUID id, CategoryUpdateReq categoryUpdateReq) {
        try {
            Category category = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
            BeanUtils.copyProperties(categoryUpdateReq, category);
            category.setCreateTime(new Date());
            return categoryRepository.save(category);
        } catch (Exception e) {
            log.error("Error while deleting product category by ID", e);
            throw e;
        }
    }

    public List<Category> findByCompanyId(Optional<UUID> menuId) {

        try {
            return categoryRepository.findByCompanyId(menuId);
        } catch (Exception e) {
            log.error("Error while fetching all product categories", e);
            throw e;
        }
    }
}