package com.mra.mono.dto.response;

import com.mra.mono.dto.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class BranchRes implements Serializable {

    private UUID branchId;
    private UUID companyId;
    private UUID menuId;
    private String branchName;
    private String address;
    private String phone;
    private Date createTime;
    private String menuName;
    private String menuColor;



}
