package com.example.mall.dto.article;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ArticleCreateRequest {
    @NotBlank(message = "标题不能为空")
    @Size(max = 200, message = "标题最长 200 字")
    private String title;

    @Size(max = 300, message = "摘要最长 300 字")
    private String summary;

    @NotBlank(message = "内容不能为空")
    private String content;

    // 逗号分隔标签，例如：Java,Spring
    private String tags;

    private String coverUrl;

    // DRAFT 或 PUBLISHED（不传默认为 DRAFT）
    private String status;
}