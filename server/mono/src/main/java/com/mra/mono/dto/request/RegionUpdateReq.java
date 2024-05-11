package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class RegionUpdateReq implements Serializable {

    @NotNull(message = "id is not null")
    private UUID id;

    @NotNull(message = "region is not null")
    private String regionName;
}
