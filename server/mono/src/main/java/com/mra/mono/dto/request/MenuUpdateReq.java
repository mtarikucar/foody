package com.mra.mono.dto.request;

import com.mra.mono.common.constant.StringListConverter;
import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class MenuUpdateReq implements Serializable {

    @NotNull(message = "menuName is not null")
    private String menuName;

    @NotNull(message = "color is not null")
    private String color;

    @Convert(converter = StringListConverter.class)
    private List<String> banners;
}
