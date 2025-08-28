package com.example.mall.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    VALIDATION_ERROR("VALIDATION_ERROR", "参数校验失败", HttpStatus.BAD_REQUEST),
    BAD_REQUEST("BAD_REQUEST", "请求不合法", HttpStatus.BAD_REQUEST),
    JSON_PARSE_ERROR("JSON_PARSE_ERROR", "请求体解析失败", HttpStatus.BAD_REQUEST),
    PARAM_TYPE_MISMATCH("PARAM_TYPE_MISMATCH", "参数类型不匹配", HttpStatus.BAD_REQUEST),

    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", "未认证或认证失败", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("UNAUTHORIZED", "未授权", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED("ACCESS_DENIED", "无权限", HttpStatus.FORBIDDEN),
    FORBIDDEN("FORBIDDEN", "禁止访问", HttpStatus.FORBIDDEN),

    NOT_FOUND("NOT_FOUND", "资源不存在", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND("USER_NOT_FOUND", "用户不存在", HttpStatus.NOT_FOUND),
    ARTICLE_NOT_FOUND("ARTICLE_NOT_FOUND", "文章不存在", HttpStatus.NOT_FOUND),
    // 🔥 留言板相关错误码
    GUESTBOOK_NOT_FOUND("GUESTBOOK_NOT_FOUND", "留言不存在", HttpStatus.NOT_FOUND),
    
    METHOD_NOT_ALLOWED("METHOD_NOT_ALLOWED", "不支持的请求方法", HttpStatus.METHOD_NOT_ALLOWED),
    UNSUPPORTED_MEDIA_TYPE("UNSUPPORTED_MEDIA_TYPE", "不支持的媒体类型", HttpStatus.UNSUPPORTED_MEDIA_TYPE),

    CONFLICT("CONFLICT", "资源冲突", HttpStatus.CONFLICT),
    DATA_INTEGRITY_VIOLATION("DATA_INTEGRITY_VIOLATION", "数据完整性冲突", HttpStatus.CONFLICT),

    PAYLOAD_TOO_LARGE("PAYLOAD_TOO_LARGE", "上传或请求体过大", HttpStatus.PAYLOAD_TOO_LARGE),

    INTERNAL_ERROR("INTERNAL_ERROR", "服务器内部错误", HttpStatus.INTERNAL_SERVER_ERROR),
    // 🔥 留言板相关错误码
    GUESTBOOK_CREATE_FAILED("GUESTBOOK_CREATE_FAILED", "留言创建失败", HttpStatus.INTERNAL_SERVER_ERROR),
    GUESTBOOK_DELETE_FAILED("GUESTBOOK_DELETE_FAILED", "留言删除失败", HttpStatus.INTERNAL_SERVER_ERROR),
    GUESTBOOK_REPLY_FAILED("GUESTBOOK_REPLY_FAILED", "留言回复失败", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String defaultMessage;
    private final HttpStatus status;

    ErrorCode(String code, String defaultMessage, HttpStatus status) {
        this.code = code;
        this.defaultMessage = defaultMessage;
        this.status = status;
    }
}