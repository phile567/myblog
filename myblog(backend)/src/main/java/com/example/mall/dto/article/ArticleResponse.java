package com.example.mall.dto.article;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ArticleResponse {
    private Long id;
    private String title;
    private String summary;
    private String content;
    private String tags;
    private String coverUrl;
    private String status;
    private String author;
    private Instant createdAt;
    private Instant updatedAt;
}