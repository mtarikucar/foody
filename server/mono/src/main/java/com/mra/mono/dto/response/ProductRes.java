package com.mra.mono.dto.response;

import com.mra.mono.common.constant.StringListConverter;
import com.mra.mono.dto.entity.Feature;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import lombok.Data;

import java.util.*;

@Data
public class ProductRes {
    private UUID productId;

    private UUID categoryId;
    private UUID companyId;
    private String name;
    @Convert(converter = StringListConverter.class)
    private List<String> images;
    private Double price;
    private Integer ratings;
    private Date createTime;
    private String description;

    private List<Feature> features;

}
