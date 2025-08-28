package com.example.mall.service.impl;

import com.example.mall.common.enums.UserStatus;
import com.example.mall.dto.*;
import com.example.mall.exception.UserNotFoundException;
import com.example.mall.model.User;
import com.example.mall.repository.UserRepository;
import com.example.mall.service.JwtService;
import com.example.mall.service.UserService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
   
    @Autowired 
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService; // 注入JWT服务
    
    @Override
    public void register(UserRegisterDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(encodePassword(dto.getPassword())); // 修改为使用加密
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        userRepository.save(user);
    }
    
@Override
public LoginResponseDTO login(UserLoginDTO dto) {
    System.out.println("=== UserService.login 开始 ===");
    System.out.println("登录用户名: " + dto.getUsername());
    
    // 1. 查找用户
    User user = userRepository.findByUsername(dto.getUsername())
            .orElseThrow(() -> new RuntimeException("用户不存在"));
    
    System.out.println("找到用户:");
    System.out.println("  username: " + user.getUsername());
    System.out.println("  email: " + user.getEmail());
    System.out.println("  status: " + user.getStatus());
    
    // 2. 验证密码
    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
        throw new RuntimeException("密码错误");
    }
    
    // 3. 登录成功，生成 JWT Token
    String token = jwtService.generateToken(user.getUsername());
    
    // 4. 🔥 构建包含完整用户信息的响应
    LoginResponseDTO response = new LoginResponseDTO(
        true, 
        token, 
        user.getId(), 
        "登录成功",
        user.getUsername(),    // 🔥 添加用户名
        user.getEmail(),       // 🔥 添加邮箱
        user.getStatus()       // 🔥 添加状态
    );
    
    // 设置可选字段
    response.setNickname(user.getNickname());
    response.setAvatarUrl(user.getAvatarUrl());
    
    System.out.println("构建的响应对象:");
    System.out.println("  success: " + response.isSuccess());
    System.out.println("  username: " + response.getUsername());
    System.out.println("  email: " + response.getEmail());
    System.out.println("  status: " + response.getStatus());
    System.out.println("=== UserService.login 结束 ===");
    
    return response;
}
    
    @Override
    @Transactional
    public void changePassword(String username, ChangePasswordDTO dto) {
        log.info("用户 {} 尝试修改密码", username);
        
        // 1. 查找用户
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

        // 2. 验证旧密码是否正确
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("旧密码不正确");
        }

        // 3. 验证新密码和确认密码是否一致
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("新密码和确认密码不一致");
        }

        // 4. 验证新密码是否与旧密码不同
        if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("新密码不能与旧密码相同");
        }
        
        // 5. 加密新密码并保存
        String encodedNewPassword = passwordEncoder.encode(dto.getNewPassword());
        user.setPassword(encodedNewPassword);

        userRepository.save(user);

        log.info("用户 {} 密码修改成功", username);
    }
    
    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> UserNotFoundException.byUsername(username));
    }
    
    @Override
    public boolean matchesPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    @Override
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
    
    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .status(UserStatus.fromCode(user.getStatus()).getDesc())
                .build();
    }
}