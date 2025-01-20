package com.mra.mono.repository;

import com.mra.mono.dto.entity.Order;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {


    @Query("SELECT o FROM Order o WHERE o.branchId = :branchId " +
            "AND (coalesce(:tableId, null) IS NULL OR o.tableId = :tableId) " +
            "AND (coalesce(:status, null) IS NULL OR o.status = :status) " +
            "ORDER BY o.orderDate DESC")
    List<Order> findAllByBranchIdAndOptionalCriteria(
            @Param("branchId") UUID branchId,
            @Param("tableId") UUID tableId,
            @Param("status") Integer status);

}
