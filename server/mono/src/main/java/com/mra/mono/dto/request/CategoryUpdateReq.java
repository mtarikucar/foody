package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class CategoryUpdateReq implements Serializable {

    @NotNull(message = "categoryName is not null")
    private String categoryName;
}
