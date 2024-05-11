package com.mra.mono.dto.response;

import com.mra.mono.common.constant.StringListConverter;
import com.mra.mono.dto.entity.Menu;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import lombok.Data;

import java.util.*;

@Data
public class MenuRes {

    private UUID menuId;

    private UUID companyId;
    private String menuName;
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<UUID> productIds = new HashSet<>();
    private String color;

    @Convert(converter = StringListConverter.class)
    private List<String> banners;

    private String logo;
    private Date createTime;

    private boolean isActive;

}
