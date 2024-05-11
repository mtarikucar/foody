package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.Category;
import com.mra.mono.dto.entity.Feature;
import com.mra.mono.dto.entity.Menu;
import com.mra.mono.dto.entity.Product;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.FeatureAddReq;
import com.mra.mono.dto.request.ProductAddReq;
import com.mra.mono.dto.request.ProductUpdateReq;
import com.mra.mono.repository.ProductRepository;
import com.mra.mono.service.FeatureService;
import com.mra.mono.service.ProductService;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.boot.actuate.cache.NonUniqueCacheException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.*;

@AllArgsConstructor
@NoArgsConstructor
@RestController
@RequestMapping("/product")
@Slf4j
public class ProductController extends BaseController {

    @Resource
    private ProductService productService;
    @Resource
    private FeatureService featureService;

    @Resource
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<Message<Page<Product>>> getProducts(
            @RequestParam UUID companyId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false ) UUID categoryId,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "productId") String sortBy) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
            Page<Product> products = productService.getProducts(companyId, name, minPrice, maxPrice, categoryId, minRating, maxRating, pageable);
            return buildSuccessReturnEntity(products);
        } catch (Exception e) {
            log.error("Error retrieving products: {}", e.getMessage());
            return buildReturnEntity("An error occurred while fetching products",300);
        }
    }


    @GetMapping("/list")
    public ResponseEntity<Message<Page<Product>>> getAllProducts(
            @RequestParam UUID menuId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false ) UUID categoryId,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "productId") String sortBy
    ) {
        try {
            if (menuId == null) {
                // menuId null ise uygun bir işlem yapın veya hata fırlatın
                throw new IllegalArgumentException("Menu ID must not be null");
            }
            log.info("menuId:{}",menuId);
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
            Page<Product> products = productService.getAllProducts(categoryId, name, minPrice, maxPrice,menuId , minRating, maxRating, pageable);
            log.info("Product:{}",products);
            return buildSuccessReturnEntity(products);
        } catch (Exception e) {
            log.error("Error retrieving products: {}", e.getMessage());
            return buildFailureReturnEntity("An error occurred while fetching products");
        }
    }

    @GetMapping("/list-non-pageable")
    public ResponseEntity<Message<List<Product>>> getAllProductsNonPageable(
            @RequestParam UUID menuId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false ) UUID categoryId,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxRating
    ) {
        try {
            if (menuId == null) {
                throw new IllegalArgumentException("Menu ID must not be null");
            }
            log.info("menuId:{}", menuId);
            List<Product> products = productService.getAllProductsNonPageable(categoryId, name, minPrice, maxPrice, menuId, minRating, maxRating);
            log.info("Product:{}", products);
            return buildSuccessReturnEntity(products);
        } catch (Exception e) {
            log.error("Error retrieving products: {}", e.getMessage());
            return buildFailureReturnEntity("An error occurred while fetching products");
        }
    }


    @PostMapping
    public ResponseEntity<Message<Product>> createProduct(@Validated @RequestBody ProductAddReq product) {
        try {
            Product savedProduct = productService.save(product);
            return buildSuccessReturnEntity(savedProduct);

        } catch (Exception e) {
            log.error("Error while creating product", e);
            return buildFailureReturnEntity("Error creating product: " + e.getMessage());
        }
    }

    @PostMapping("/features")
    public ResponseEntity<Message<String>> createFeature(@Validated @RequestBody FeatureAddReq featureAddReq) {
        try {
            featureService.save(featureAddReq);
            return buildSuccessReturnEntity("savedProduct");

        } catch (Exception e) {
            log.error("Error while creating feature", e);
            return buildFailureReturnEntity("Error creating feature: " + e.getMessage());
        }
    }
    @GetMapping("/features")
    public ResponseEntity<Message<List<Feature>>> getFeatures(@RequestParam Optional<UUID> companyId ) {
        try {
            List<Feature> features;
            if (companyId.isPresent()) {
                features = featureService.findByCompanyId(companyId);
            } else {
                features = featureService.findAll();
            }

            if (features.isEmpty()) {
                log.warn("No product features found");
                return buildReturnEntity("No product features found", 301);
            }

            return buildSuccessReturnEntity(features);
        } catch (Exception e) {
            log.error("Error while fetching product features", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message<Product>> updateProduct(@PathVariable UUID id, @Validated @RequestBody ProductUpdateReq product) {
        try {
            if (!productService.existsById(id)) {
                log.warn("Product not found with id: {}", id);
                return buildFailureReturnEntity("Product not found with id: " + id);
            }
            Product updatedProduct = productService.update(id,product);
            return buildSuccessReturnEntity(updatedProduct);
        } catch (Exception e) {
            log.error("Error updating product with id {}: ", id, e);
            return buildFailureReturnEntity("Error updating product: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message<Product>> getProduct(@PathVariable UUID id) {
        try {
            Product product = productService.findById(id).orElseThrow(() -> {
                log.error("Product not found with ID: {}", id);
                return new ResourceNotFoundException("Product not found with id: " + id);
            });
            return buildSuccessReturnEntity(product);
        } catch (ResourceNotFoundException e) {
            log.warn("Product not found with id: {}", id, e);
            return buildFailureReturnEntity("Product not found with id: " + id);
        } catch (Exception e) {
            log.error("Error fetching product with id {}: ", id, e);
            return buildFailureReturnEntity("Error fetching product: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Message<String>> deleteProduct(@PathVariable UUID id) {
        try {
            if (!productService.existsById(id)) {
                log.warn("Product not found with id: {}", id);
                return buildFailureReturnEntity("Product not found with id: " + id);
            }
            productService.deleteById(id);
            return buildSuccessReturnEntity("Product successfully deleted");
        } catch (Exception e) {
            log.error("Error deleting product with id {}: ", id, e);
            return buildFailureReturnEntity("Error deleting product: " + e.getMessage());
        }
    }


    @GetMapping("/{menuId}/company/{companyId}")
    public ResponseEntity<List<Product>> getProductsNotInMenuByCompany(@PathVariable UUID menuId, @PathVariable UUID companyId) {
        try {
            List<Product> products = productService.getProductsNotInMenuByCompanyId(menuId, companyId);
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            log.error("Error retrieving products not in menu for company with id {}: ", companyId, e);
            return ResponseEntity.badRequest().body(null);
        }
    }


    @GetMapping("/{categoryId}/products")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable UUID categoryId) {
        List<Product> products = productService.getProductsByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }


    @GetMapping("/features/{id}")
    public ResponseEntity<Message<List<Feature>>> addProductsToMenu( @PathVariable UUID id) {
        try {
            Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));

           List<Feature> feature = featureService.findAllFeatures(new ArrayList<>(product.getFeatureIds()));
            return buildSuccessReturnEntity(feature);
        } catch (RuntimeException e) {
            log.error("Error getting product-features with ids " ,e);
            return buildFailureReturnEntity("Error getting product-features");
        }
    }




}
