package com.mra.mono.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class OrderProductRequest {
    private UUID productId;
    private int quantity;
}
