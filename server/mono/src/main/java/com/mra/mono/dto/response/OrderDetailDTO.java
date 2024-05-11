package com.mra.mono.dto.response;

import com.mra.mono.dto.entity.Product;
import lombok.Data;

import java.util.UUID;
@Data
public class OrderDetailDTO {
    private UUID orderDId;
    private int quantity;
    private Product product;
}
