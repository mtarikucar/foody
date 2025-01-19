package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class TableAddReq implements Serializable {

    private UUID tableId;

    @NotNull(message = "branchId is not null")
    private UUID branchId;

    @NotNull(message = "branchId is not null")
    private UUID regionId;

    @NotNull(message = "tableNumber is not null")
    private String tableName;
}
