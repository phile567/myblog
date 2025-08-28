package com.example.mall.controller;

import com.example.mall.dto.*;
import com.example.mall.service.UserService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserRegisterDTO dto) {
        userService.register(dto);
        return ResponseEntity.ok("注册成功");
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody UserLoginDTO dto) {
        try {
            LoginResponseDTO response = userService.login(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LoginResponseDTO response = new LoginResponseDTO(false, null, null, e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 修改密码
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordDTO dto,
            BindingResult result,
            Authentication authentication) {  // Spring Security自动注入
        
        if (result.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(Map.of("errors", result.getAllErrors()));
        }
        
        try {
            // 从认证信息中获取当前用户名，更安全
            String currentUsername = authentication.getName();
            
            userService.changePassword(currentUsername, dto);
            
            return ResponseEntity.ok()
                .body(Map.of("message", "密码修改成功"));
                
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }
}
