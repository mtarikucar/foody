package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class BranchUpdateReq implements Serializable {


    private String branchName;


    private String address;



    private String phone;


    private UUID menuId;
}
