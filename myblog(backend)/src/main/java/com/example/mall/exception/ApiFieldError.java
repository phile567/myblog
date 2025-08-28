package com.example.mall.exception;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiFieldError {
    // 出错字段名（如 "password"）
    private String field;
    // 人类可读的错误消息（如 "密码长度必须在 6-20 位之间"）
    private String message;
    // 触发的规则名（如 "Size"、"NotBlank"、"Pattern"、"Email"）
    private String rule;
    // 规则参数（如 { "min": 6, "max": 20 } 或 { "regexp": "^\\d{10,15}$" }）
    private Map<String, Object> ruleParams;
    // 用户提交的错误值（谨慎返回，密码字段建议打码或不返回）
    private Object rejectedValue;
}