package com.example.mall.exception;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
public class ApiError {
    private Instant timestamp;
    private int status;          // HTTP 状态码
    private String error;        // 状态描述，例如 "Bad Request"
    private String code;         // 业务错误码，例如 "VALIDATION_ERROR"
    private String message;      // 人类可读的错误信息
    private String path;         // 请求路径
    private String method;       // 请求方法
    private String traceId;      // 链路ID（如果你在日志里放了 MDC traceId）
    private Map<String, String> details; // 细节，如字段校验错误 {field: msg}
}