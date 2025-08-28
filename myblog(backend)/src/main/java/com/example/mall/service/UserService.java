package com.example.mall.service;

import com.example.mall.dto.UserDTO;
import com.example.mall.dto.UserLoginDTO;
import com.example.mall.dto.UserRegisterDTO;
import com.example.mall.model.User;
import com.example.mall.dto.ChangePasswordDTO;
import com.example.mall.dto.LoginResponseDTO;

public interface UserService {
    void register(UserRegisterDTO dto);
    LoginResponseDTO login(UserLoginDTO dto);
    UserDTO getUserById(Long id);
    
    /**
     * 修改用户密码
     * @param username 用户名
     * @param dto 修改密码DTO
     * @throws RuntimeException 当旧密码不正确或用户不存在时抛出异常
     */
    void changePassword(String username, ChangePasswordDTO dto);
    
    /**
     * 验证密码是否正确
     * @param rawPassword 原始密码
     * @param encodedPassword 加密后的密码
     * @return 是否匹配
     */
    boolean matchesPassword(String rawPassword, String encodedPassword);
    
    /**
     * 加密密码
     * @param rawPassword 原始密码
     * @return 加密后的密码
     */
    String encodePassword(String rawPassword);
    
    /**
     * 根据用户名查找用户
     * @param username 用户名
     * @return 用户实体
     */
    User findByUsername(String username);
}
