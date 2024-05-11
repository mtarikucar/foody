package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class TableUpdateReq implements Serializable {

    @NotNull(message = "tableName is not null")
    private String tableName;

}
