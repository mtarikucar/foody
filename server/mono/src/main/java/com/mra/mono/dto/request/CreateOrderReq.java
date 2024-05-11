package com.mra.mono.dto.request;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CreateOrderReq {
    private UUID branchId;
    private UUID tableId;
    private Double totalAmount;
    private Double discount;
    private Integer status;
    private List<OrderProductRequest> products;
}
