package com.mra.mono.common.controller;

import com.mra.mono.dto.entity.message.Message;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.nio.charset.Charset;

public class BaseController {
    public static final String ENCODING_UTF8 = "UTF-8";

    public static final String SUCCESS = "success";

    public static final int SUCCESS_CODE = 200;

    public static final String FAILURE = "failure";

    public static final int FAILURE_CODE = 400;

    private HttpHeaders createResponseHeaders() {
        HttpHeaders responseHeaders = new HttpHeaders();

        responseHeaders.set("charset", ENCODING_UTF8);
        responseHeaders.set("pageEncoding", ENCODING_UTF8);

        responseHeaders.setContentType(new MediaType("application", "json",
                Charset.forName("UTF-8")));

        return responseHeaders;
    }

    public <T> ResponseEntity<Message<T>> buildReturnEntity(Message<T> message) {
        ResponseEntity<Message<T>> messageResponseEntity = new ResponseEntity<>(message, createResponseHeaders(),
                HttpStatusCode.valueOf(message.getCode()));
        return messageResponseEntity;
    }

    public <T> ResponseEntity<Message<T>> buildSuccessReturnEntity(T t) {
        Message<T> message = new Message<T>();
        message.setCode(SUCCESS_CODE);
        message.setMsg(SUCCESS);
        message.setData(t);
        ResponseEntity<Message<T>> messageResponseEntity = buildReturnEntity(message);
        return messageResponseEntity;
    }


    public <T> ResponseEntity<Message<T>> buildSuccessReturnEntity(T t, String info) {
        Message<T> message = new Message<T>();
        message.setCode(SUCCESS_CODE);
        message.setMsg(info);
        message.setData(t);

        return buildReturnEntity(message);
    }

    public <T> ResponseEntity<Message<T>> buildSuccessReturnEntity(T t, int totalPages) {
        Message<T> message = new Message<T>();
        message.setCode(SUCCESS_CODE);
        message.setData(t);

        return buildReturnEntity(message);
    }

    public <T> ResponseEntity<Message<T>> buildFailureReturnEntity(String info) {
        Message<T> message = new Message<T>();
        message.setCode(FAILURE_CODE);
        message.setMsg(info);

        return buildReturnEntity(message);
    }

    public <T> ResponseEntity<Message<T>> buildReturnEntity(String info, Integer code) {
        Message<T> message = new Message<T>();
        message.setCode(code);
        message.setMsg(info);

        return buildReturnEntity(message);
    }


    public <T> ResponseEntity<Message<T>> buildReturnEntity(T t, String info, int code) {
        Message<T> message = new Message<T>();
        message.setCode(code);
        message.setMsg(info);
        message.setData(t);

        return buildReturnEntity(message);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Message<String>> handleException(RuntimeException e){
        return buildFailureReturnEntity(e.getMessage());
    }

    public ResponseEntity<Message<String>> handleToNum(int num){
        if(num == 1){
            return buildSuccessReturnEntity(null);
        }
        return buildFailureReturnEntity(null);
    }
}
