package com.mra.mono.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BranchAddReq {

    @NotNull(message = "companyId is not null")
    private UUID companyId;

    @NotNull(message = "branchName is not null")
    private String branchName;


    private String phone;

    private String city;

    private String district;

    private String street;

    private Integer buildingNumber;

    private Integer apartmentNumber;

    private String openAddress;
}
