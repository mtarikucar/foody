package com.mra.mono.dto.response;

import com.mra.mono.dto.request.TableAddReq;
import lombok.Data;

import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Data
public class OrderRes {
    private UUID orderId;
    private TableAddReq table;
    private UUID branchId;
    private Double totalAmount;
    private Double discount;
    private Integer status;
    private Set<OrderDetailDTO> orderDetails;
    private Date orderDate;
    private Date createTime;
}
