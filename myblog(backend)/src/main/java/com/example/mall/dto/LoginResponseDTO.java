package com.example.mall.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private boolean success;
    private String token;
    private Long userId;
    private String message;
    
    // 🔥 添加前端需要的字段
    private String username;
    private String email;
    private Integer status;
    private String nickname;
    private String avatarUrl;
    
    // 🔥 添加便于创建成功响应的构造函数
    public LoginResponseDTO(boolean success, String token, Long userId, String message, 
                           String username, String email, Integer status) {
        this.success = success;
        this.token = token;
        this.userId = userId;
        this.message = message;
        this.username = username;
        this.email = email;
        this.status = status;
    }
    
    // 保留原有的构造函数用于错误响应
    public LoginResponseDTO(boolean success, String token, Long userId, String message) {
        this.success = success;
        this.token = token;
        this.userId = userId;
        this.message = message;
    }
}