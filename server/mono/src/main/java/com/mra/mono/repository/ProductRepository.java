package com.mra.mono.repository;

import com.mra.mono.dto.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query("SELECT p FROM Product p WHERE p.companyId = :companyId" +
            " AND (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))" +
            " AND (:minPrice IS NULL OR p.price >= :minPrice)" +
            " AND (:maxPrice IS NULL OR p.price <= :maxPrice)" +
            " AND (coalesce(:categoryId, null ) = null OR p.categoryId = :categoryId)" +
            " AND (:minRating IS NULL OR p.ratings >= :minRating)" +
            " AND (:maxRating IS NULL OR p.ratings <= :maxRating)")
    Page<Product> findAllWithFilters(@Param("companyId") UUID companyId,
                                     @Param("name") String name,
                                     @Param("minPrice") Double minPrice,
                                     @Param("maxPrice") Double maxPrice,
                                     @Param("categoryId") UUID categoryId,
                                     @Param("minRating") Integer minRating,
                                     @Param("maxRating") Integer maxRating,
                                     Pageable pageable);


    List<Product> findByCategoryId(UUID categoryId);


    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (coalesce(:categoryId, null) = null OR p.categoryId = :categoryId) " +
            "AND (:minRating IS NULL OR p.ratings >= :minRating) " +
            "AND (:maxRating IS NULL OR p.ratings <= :maxRating) " +
            "AND (:productIdsList IS NULL OR p.productId IN :productIdsList)")
    Page<Product> findAllByDynamicCriteria(
            @Param("productIdsList") List<UUID> productIdsList,
            Pageable pageable,
            @Param("name") String name,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("categoryId") UUID categoryId,
            @Param("minRating") Integer minRating,
            @Param("maxRating") Integer maxRating
    );


    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (coalesce(:categoryId, null) = null OR p.categoryId = :categoryId) " +
            "AND (:minRating IS NULL OR p.ratings >= :minRating) " +
            "AND (:maxRating IS NULL OR p.ratings <= :maxRating) " +
            "AND (:productIdsList IS NULL OR p.productId IN :productIdsList)")
    List<Product> findAllByDynamicCriteriaNonPageable(
            @Param("productIdsList") List<UUID> productIdsList,
            @Param("name") String name,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("categoryId") UUID categoryId,
            @Param("minRating") Integer minRating,
            @Param("maxRating") Integer maxRating
    );


    Optional<Object> findByProductId(UUID productId);
}
