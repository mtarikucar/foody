package com.mra.mono.service;

import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.common.utils.CustomBeanUtils;
import com.mra.mono.dto.entity.Menu;
import com.mra.mono.dto.entity.Product;
import com.mra.mono.dto.request.ProductAddReq;
import com.mra.mono.dto.request.ProductUpdateReq;
import com.mra.mono.repository.MenuRepository;
import com.mra.mono.repository.ProductRepository;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class ProductService {
    @Resource
    private ProductRepository productRepository;


    @Resource
    private MenuRepository menuRepository;

    public Product save(ProductAddReq productAddReq) {
        try {
            Product product = new Product();
            BeanUtils.copyProperties(productAddReq, product);
            product.setCreateTime(new Date());
            product.setProductId(UUID.randomUUID());

            return productRepository.save(product);
        } catch (Exception e) {
            log.error("Error while saving product: ", e);
            throw e;
        }
    }

    public Optional<Product> findById(UUID id) {
        try {
            return productRepository.findById(id);
        } catch (Exception e) {
            log.error("Error while finding product by id: {}", id, e);
            throw e;
        }
    }

/*    public List<Product> findAll(Optional<UUID> categoryId,  Optional<UUID> companyId) {
        try {
            if (categoryId.isPresent()) {
                return productRepository.findByCategoryId(categoryId);
            }  else if (companyId.isPresent()) {
                return productRepository.findByCompanyId(companyId);
            }
            return null;
        } catch (Exception e) {
            log.error("Error while finding all products", e);
            throw e;
        }
    }*/


    public void deleteById(UUID id) {
        try {
            productRepository.deleteById(id);
        } catch (Exception e) {
            log.error("Error while deleting product with id: {}", id, e);
            throw e;
        }
    }

    public boolean existsById(UUID id) {
        try {
            return productRepository.existsById(id);
        } catch (Exception e) {
            log.error("Error checking existence of product with id: {}", id, e);
            throw e;
        }
    }

    public Product update(UUID id, ProductUpdateReq productUpdateReq) {
        try {
            Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
            CustomBeanUtils.copyNonNullProperties(productUpdateReq, product);
            product.setCreateTime(new Date());
            log.info("productUpdateReq :{}",productUpdateReq);
            log.info("product :{}",product);

            return productRepository.save(product);
        } catch (Exception e) {
            log.error("Error updating product with id: {}", id, e);
            throw e;
        }
    }

    public List<Product> getProductsByMenuId(UUID menuId) {
        try {
            Menu menu = menuRepository.findById(menuId).orElseThrow(() -> new RuntimeException("Menu not found with id: " + menuId));
            Set<UUID> productIds = menu.getProductIds();

            return productIds.stream()
                    .map(id -> productRepository.findById(id).orElse(null))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving products for menu with id {}: ", menuId, e);
            throw e;
        }
    }

    @Transactional
    public List<Product> getProductsNotInMenuByCompanyId(UUID menuId, UUID companyId) {
        try {
            Menu menu = menuRepository.findById(menuId).orElseThrow(() -> new RuntimeException("Menu not found with id: " + menuId));
            Set<UUID> productIdsInMenu = menu.getProductIds();

            return productRepository.findAll().stream()
                    .filter(product -> !productIdsInMenu.contains(product.getProductId()) && product.getCompanyId().equals(companyId))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving products not in menu for company with id {}: ", companyId, e);
            throw e;
        }
    }

    @Transactional
    public List<Product> getAllProductsNonPageable(UUID categoryId, String name, Double minPrice, Double maxPrice, UUID menuId, Integer minRating, Integer maxRating) {
        log.info("menuId:{}", menuId);
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + menuId));

        log.info("menu:{}", menu);
        try {
            List<UUID> productIdsList = new ArrayList<>(menu.getProductIds());
            List<Product> products = productRepository.findAllByDynamicCriteriaNonPageable(productIdsList, name, minPrice, maxPrice, categoryId, minRating, maxRating);
            log.info("pro:{}", products);
            return products;
        } catch (Exception e) {
            log.error("Error while finding all products", e);
            throw e;
        }
    }
    @Transactional
    public Page<Product> getProducts(UUID companyId, String name,
                                     Double minPrice, Double maxPrice,
                                     UUID categoryId, Integer minRating,
                                     Integer maxRating, Pageable pageable
    ) {
        return productRepository.findAllWithFilters(companyId, name, minPrice, maxPrice, categoryId, minRating, maxRating, pageable);
    }



    public List<Product> getProductsByCategoryId(UUID categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Page<Product> getAllProducts(UUID categoryId, String name, Double minPrice, Double maxPrice, UUID menuId, Integer minRating, Integer maxRating, Pageable pageable) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + menuId));

        log.info("menu:{}",menu);
        try {
            List<UUID> productIdsList = new ArrayList<>(menu.getProductIds());
            Page<Product> products =productRepository.findAllByDynamicCriteria( productIdsList, pageable ,name, minPrice, maxPrice, categoryId, minRating, maxRating);
            return products;
        } catch (Exception e) {
            log.error("Error while finding all products", e);
            throw e;
        }
    }

}

