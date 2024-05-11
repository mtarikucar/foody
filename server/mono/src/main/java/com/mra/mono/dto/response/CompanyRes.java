package com.mra.mono.dto.response;

import lombok.Data;
import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Data
public class CompanyRes implements Serializable {

    private UUID companyId;
    private String name;
    private String logo;
    private Date createTime;
    private UUID userId;

    private String type;

    private String phone;

    private String mail;

    private Integer headCount;

}
