package com.mra.mono.dto.response;

import lombok.Data;

@Data
public class ReportWidgetsRes {
    private Integer totalCompanyOrderPrice;
    private Integer totalMonthlyPrice;
    private Integer totalProductCount;
    private Integer totalOrderCount;
    private Integer totalUserCount;
    private Integer totalBranchCount;
}
