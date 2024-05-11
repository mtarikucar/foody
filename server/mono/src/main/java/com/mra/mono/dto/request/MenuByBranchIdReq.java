package com.mra.mono.dto.request;

import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
public class MenuByBranchIdReq {
    private UUID menuId;
    private String menuName;
    private String color;
    private Date createTime;
}
