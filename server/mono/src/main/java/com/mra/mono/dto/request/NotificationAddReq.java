package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
public class NotificationAddReq {

    @NotNull(message = "userId is not null")
    private UUID userId;

    @NotNull(message = "content is not null")
    private String content;

    @NotNull(message = "createTime is not null")
    private Date createTime;

    @NotNull(message = "createTime is not null")
    private boolean read;
}
