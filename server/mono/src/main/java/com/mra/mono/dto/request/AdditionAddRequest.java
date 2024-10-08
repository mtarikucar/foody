package com.mra.mono.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdditionAddRequest implements Serializable {
    private UUID tableId;
    private Double amount;
    private Double cash;
    private Double card;
    private Double other;
    private UUID branchId;
    private List<UUID> orderIds;
}
