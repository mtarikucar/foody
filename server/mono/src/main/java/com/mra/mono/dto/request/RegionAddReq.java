package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class RegionAddReq implements Serializable {

    @NotNull(message = "branchId is not null")
    private UUID branchId;

    @NotNull(message = "region is not null")
    private String regionName;
}
