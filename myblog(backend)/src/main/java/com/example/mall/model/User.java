package com.example.mall.model;

import com.example.mall.common.enums.UserStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;   // 用户名（登录名）

    @Column(nullable = false)
    private String password;   // 密码（加密存储）

    @Column(unique = true, length = 100)
    private String email;      // 邮箱

    @Column(unique = true, length = 20)
    private String phone;      // 手机号

    @Column(length = 50)
    private String nickname;   // 昵称（主页显示用）

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;  // 头像URL

    @Column(name = "created_at")
    private LocalDateTime createdAt;   // 创建时间

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;   // 更新时间

    @Column(nullable = false)
    private Integer status = 1; // 用户状态 0=作者，1=普通用户

    // --- 无参构造方法（JPA/Hibernate 必须） ---
    public User() {}

    // --- 常用有参构造方法（方便业务代码用） ---
    public User(String username, String password, String email, String phone) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = 1; // 默认为普通用户
    }

    // --- 原有的 Getter & Setter ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    // 🔥 新增：权限检查方法
    public UserStatus getUserStatus() {
        return UserStatus.fromCode(this.status);
    }

    public boolean isAuthor() {
        return this.status == 0;
    }

    public boolean canCreateArticle() {
        return this.status == 0;
    }

    // 🔥 新增：角色设置方法
    public void setAsAuthor() {
        this.status = 0;
        this.updatedAt = LocalDateTime.now();
    }

    public void setAsUser() {
        this.status = 1;
        this.updatedAt = LocalDateTime.now();
    }
}
