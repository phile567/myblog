package com.example.mall.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一 API 响应结构
 * @param <T> 返回的数据类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {

    private int code;       // 0=成功，非0=错误
    private String message; // 提示信息
    private T data;         // 返回数据

    public static <T> Result<T> success(T data) {
        return new Result<>(0, "success", data);
    }

    public static <T> Result<T> error(String message) {
        return new Result<>(1, message, null);
    }
}
