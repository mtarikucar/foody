package com.mra.mono.dto.request;

import com.mra.mono.common.constant.StringListConverter;
import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
public class ProductUpdateReq implements Serializable {
    private String name;
    private Double price;
    private UUID categoryId;
    @Convert(converter = StringListConverter.class)
    private List<String> images;
    private Integer ratings;
    private String description;
    private Set<UUID> featureIds;
}
