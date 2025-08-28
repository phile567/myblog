package com.example.mall.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "article")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=200)
    private String title;

    @Column(length=500) // 🔥 增加摘要长度
    private String summary;

    @Lob
    @Column(nullable=false, columnDefinition = "LONGTEXT") // 🔥 明确指定为 LONGTEXT
    private String content;

    // 用逗号分隔或存 JSON（这里示例逗号分隔）
    @Column(length=1000) // 🔥 增加标签字段长度
    private String tags;

    @Column(length=500) // 🔥 增加封面URL长度
    private String coverUrl;

    @Column(nullable=false, length=20) // 🔥 状态字段长度适中
    private String status; // DRAFT / PUBLISHED

    @Column(nullable=false, length=100) // 🔥 增加作者字段长度
    private String author; // 直接保存用户名，便于做"只允许作者编辑"

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}