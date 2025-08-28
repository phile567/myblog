package com.example.mall.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "guestbook_entries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class GuestbookEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(length = 255)
    private String email;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(columnDefinition = "TEXT")
    private String reply;
    
    // 🔥 关联用户ID（如果是注册用户留言）
    @Column(name = "user_id")
    private Long userId;
    
    // 🔥 用户类型：GUEST（游客）、REGISTERED（注册用户）
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    @Builder.Default
    private UserType userType = UserType.GUEST;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 🔥 回复时间
    @Column(name = "replied_at")
    private LocalDateTime repliedAt;
    
    // 🔥 IP地址（可选，用于管理）
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    public enum UserType {
        GUEST,      // 游客
        REGISTERED  // 注册用户
    }
    
    // 🔥 判断是否有回复
    public boolean hasReply() {
        return reply != null && !reply.trim().isEmpty();
    }
    
    // 🔥 判断是否为注册用户
    public boolean isRegisteredUser() {
        return userType == UserType.REGISTERED && userId != null;
    }
}