package com.example.mall.exception;

/**
 * 用户不存在异常
 */
public class UserNotFoundException extends RuntimeException {
    
    public UserNotFoundException(String message) {
        super(message);
    }
    
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static UserNotFoundException byUsername(String username) {
        return new UserNotFoundException("用户不存在: " + username);
    }
    
    public static UserNotFoundException byId(Long id) {
        return new UserNotFoundException("用户不存在，ID: " + id);
    }
    
    public static UserNotFoundException byEmail(String email) {
        return new UserNotFoundException("用户不存在，邮箱: " + email);
    }
}