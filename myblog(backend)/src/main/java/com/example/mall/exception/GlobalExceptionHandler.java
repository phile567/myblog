
package com.example.mall.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 统一构造响应（基于预置的 ErrorCode 枚举）
    private ResponseEntity<Object> build(ErrorCode ec, String message, WebRequest request, Map<String, String> details) {
        HttpStatus status = ec.getStatus();
        String traceId = MDC.get("traceId");
        String path = null, method = null;
        if (request instanceof ServletWebRequest swr) {
            path = swr.getRequest().getRequestURI();
            method = swr.getRequest().getMethod();
        }
        ApiError body = ApiError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .code(ec.getCode())
                .message(message != null ? message : ec.getDefaultMessage())
                .path(path)
                .method(method)
                .traceId(traceId)
                .details(details)
                .build();
        return ResponseEntity.status(status).body(body);
    }

    // 统一构造响应（自定义 code + HttpStatus，用于 BusinessException 等动态场景）
    private ResponseEntity<Object> build(HttpStatus status, String code, String message, WebRequest request, Map<String, String> details) {
        String traceId = MDC.get("traceId");
        String path = null, method = null;
        if (request instanceof ServletWebRequest swr) {
            path = swr.getRequest().getRequestURI();
            method = swr.getRequest().getMethod();
        }
        ApiError body = ApiError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .code(code != null ? code : ErrorCode.INTERNAL_ERROR.getCode())
                .message(message != null ? message : ErrorCode.INTERNAL_ERROR.getDefaultMessage())
                .path(path)
                .method(method)
                .traceId(traceId)
                .details(details)
                .build();
        return ResponseEntity.status(status).body(body);
    }

    // 400 - Bean 参数校验失败（@Valid @RequestBody）
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> details = new HashMap<>();
        for (FieldError e : ex.getBindingResult().getFieldErrors()) {
            details.put(e.getField(), e.getDefaultMessage());
        }
        log.warn("Validation failed: {}", details);
        return build(ErrorCode.VALIDATION_ERROR, "参数校验失败", request, details);
    }

    // 400 - JSON 解析失败
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, WebRequest request) {
        log.warn("JSON parse error: {}", ex.getMessage());
        return build(ErrorCode.JSON_PARSE_ERROR, "请求体解析失败", request, null);
    }

    // 400 - 请求参数缺失
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex, WebRequest request) {
        Map<String, String> details = Map.of(ex.getParameterName(), "缺少必填参数");
        log.warn("Missing parameter: {}", ex.getParameterName());
        return build(ErrorCode.BAD_REQUEST, "请求参数不完整", request, details);
    }

    // 400 - 参数类型不匹配
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex, WebRequest request) {
        String name = ex.getName();
        //String required = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "未知类型";
        String required;
        Class<?> type = ex.getRequiredType();
        if (type != null) {
            required = type.getSimpleName();
        } else {
        required = "未知类型";
        }
        
        Map<String, String> details = Map.of(name, "需要类型: " + required);
        log.warn("Type mismatch: {} -> {}", name, required);
        return build(ErrorCode.PARAM_TYPE_MISMATCH, "参数类型不匹配", request, details);
    }

    // 400 - 直接在方法参数上校验失败（@RequestParam 等）
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException ex, WebRequest request) {
        Map<String, String> details = new HashMap<>();
        for (ConstraintViolation<?> v : ex.getConstraintViolations()) {
            details.put(v.getPropertyPath().toString(), v.getMessage());
        }
        log.warn("Constraint violation: {}", details);
        return build(ErrorCode.VALIDATION_ERROR, "参数校验失败", request, details);
    }

    // 401 - 认证失败
    @ExceptionHandler({ AuthenticationException.class, BadCredentialsException.class })
    public ResponseEntity<Object> handleAuth(AuthenticationException ex, WebRequest request) {
        log.warn("Authentication failed: {}", ex.getMessage());
        return build(ErrorCode.AUTHENTICATION_FAILED, "未认证或认证失败", request, null);
    }

    // 403 - 无权限
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex, WebRequest request) {
        log.warn("Access denied: {}", ex.getMessage());
        return build(ErrorCode.ACCESS_DENIED, ex.getMessage(), request, null);
    }

    // 404 - 资源不存在
    @ExceptionHandler({ NoSuchElementException.class, EntityNotFoundException.class })
    public ResponseEntity<Object> handleNotFound(RuntimeException ex, WebRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        return build(ErrorCode.NOT_FOUND, "资源不存在", request, null);
    }

    // 405 - 方法不被允许
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex, WebRequest request) {
        log.warn("Method not allowed: {}", ex.getMethod());
        return build(ErrorCode.METHOD_NOT_ALLOWED, "不支持的请求方法: " + ex.getMethod(), request, null);
    }

    // 415 - 媒体类型不支持
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, WebRequest request) {
        log.warn("Unsupported media type: {}", ex.getContentType());
        return build(ErrorCode.UNSUPPORTED_MEDIA_TYPE, "不支持的媒体类型", request, null);
    }

    // 409 - 数据完整性冲突（唯一键、外键等）
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrity(DataIntegrityViolationException ex, WebRequest request) {
        log.warn("Data integrity violation", ex);
        return build(ErrorCode.DATA_INTEGRITY_VIOLATION, "数据冲突，请检查唯一约束或外键引用", request, null);
    }

    // 413 - 上传或请求体过大
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> handleMaxUpload(MaxUploadSizeExceededException ex, WebRequest request) {
        log.warn("Payload too large: {}", ex.getMessage());
        return build(ErrorCode.PAYLOAD_TOO_LARGE, "文件或请求体过大", request, null);
    }

    // 业务异常（自定义）
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Object> handleBusiness(BusinessException ex, WebRequest request) {
        log.warn("Business error [{}]: {}", ex.getCode(), ex.getMessage());
        HttpStatus status = ex.getStatus() != null ? ex.getStatus() : HttpStatus.BAD_REQUEST;
        return build(status, ex.getCode(), ex.getMessage(), request, null);
    }

    // 兜底：500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleOther(Exception ex, WebRequest request) {
        log.error("Unhandled error", ex);
        return build(ErrorCode.INTERNAL_ERROR, "服务器内部错误", request, null);
    }
}