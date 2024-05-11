package com.mra.mono.common.exception;

public class BusinessException extends RuntimeException{
    private static final long serialVersionUID = -6115253309272323785L;

    private int code;

    private String msg;

    @Override
    public String getMessage() {
        return this.msg;
    }

    public BusinessException(String message) {
        super(message);
        this.code=0;
        this.msg=message;
    }


}
