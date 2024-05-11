package com.mra.mono.common.exception;

import com.mra.mono.common.constant.Constant;
import com.mra.mono.dto.entity.message.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/**
 * @author Xiaofeng Lee
 * @version 1.0
 * @description
 * @date 2021/7/12 16:33
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    /**
     * 参数合法性校验异常
     * @param exception
     * @return
     */
    @ResponseBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Message<String> validationBodyException(MethodArgumentNotValidException exception){

        StringBuffer buffer = new StringBuffer();

        BindingResult result  = exception.getBindingResult();
        if (result.hasErrors()) {

            List<ObjectError> errors = result.getAllErrors();

            errors.forEach(p ->{

                FieldError fieldError = (FieldError) p;
                log.error("Data check failure : object{"+fieldError.getObjectName()+"},field{"+fieldError.getField()+
                        "},errorMessage{"+fieldError.getDefaultMessage()+"}");
                buffer.append(fieldError.getDefaultMessage()).append(",");
            });
        }
        Message<String> message = new Message<>();
        message.setCode(Constant.DEFAULT_FALSE);
        message.setMsg(buffer.toString().substring(0, buffer.toString().length()-1));
        return message;
    }
    @ResponseBody
    @ExceptionHandler(BusinessException.class)
    public Message<String> businessException(BusinessException exception){

        Message<String> message = new Message<>();
        message.setCode(Constant.DEFAULT_FALSE);
        message.setMsg(exception.getMessage());
        return message;
    }
}