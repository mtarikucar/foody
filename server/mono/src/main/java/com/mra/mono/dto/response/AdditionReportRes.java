package com.mra.mono.dto.response;

import com.mra.mono.dto.entity.Branch;
import com.mra.mono.dto.entity.Order;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class AdditionReportRes {

    private UUID additionId;
    private Double amount;
    private Double card;
    private Double cash;
    private Double other;
    private String branchName;
    private Integer orderCount;
    private Date createTime;
}
