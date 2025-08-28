package com.example.mall.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 用于抛业务异常（可带自定义错误码与 HttpStatus）。
 * 典型用法：throw new BusinessException(ErrorCode.NOT_FOUND, "文章不存在");
 */
@Getter
public class BusinessException extends RuntimeException {
    private final String code;
    private final HttpStatus status;

    public BusinessException(ErrorCode ec) {
        super(ec.getDefaultMessage());
        this.code = ec.getCode();
        this.status = ec.getStatus();
    }

    public BusinessException(ErrorCode ec, String message) {
        super(message);
        this.code = ec.getCode();
        this.status = ec.getStatus();
    }

    public BusinessException(String code, String message, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
    }
}