package com.mra.mono.dto.entity.message;

import lombok.Data;

import java.io.Serializable;

@Data
public class Message<T> implements Serializable {

    private String msg;

    private int code;

    private T data;

}
