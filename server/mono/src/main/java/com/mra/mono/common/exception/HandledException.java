package com.mra.mono.common.exception;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class HandledException extends Exception {
    private Integer code;

    public HandledException(Integer code, String message) {
        super(message);
        this.setCode(code);
    }

    public HandledException(Integer code, String message, Throwable cause) {
        super(message, cause);
        this.setCode(code);
    }

}