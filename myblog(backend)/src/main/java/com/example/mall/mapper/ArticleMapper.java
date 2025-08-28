package com.example.mall.mapper;

import com.example.mall.dto.article.ArticleCreateRequest;
import com.example.mall.dto.article.ArticleResponse;
import com.example.mall.dto.article.ArticleUpdateRequest;
import com.example.mall.model.Article;
import org.springframework.stereotype.Component;

@Component
public class ArticleMapper {

    public Article toEntity(ArticleCreateRequest req, String author) {
        Article a = new Article();
        a.setTitle(req.getTitle());
        a.setSummary(req.getSummary());
        a.setContent(req.getContent());
        a.setTags(req.getTags());
        a.setCoverUrl(req.getCoverUrl());
        a.setStatus(req.getStatus() == null ? "DRAFT" : req.getStatus());
        a.setAuthor(author);
        return a;
    }

    public void updateEntity(Article entity, ArticleUpdateRequest req) {
        entity.setTitle(req.getTitle());
        entity.setSummary(req.getSummary());
        entity.setContent(req.getContent());
        entity.setTags(req.getTags());
        entity.setCoverUrl(req.getCoverUrl());
        if (req.getStatus() != null) {
            entity.setStatus(req.getStatus());
        }
    }

    public ArticleResponse toResponse(Article a) {
        return ArticleResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .summary(a.getSummary())
                .content(a.getContent())
                .tags(a.getTags())
                .coverUrl(a.getCoverUrl())
                .status(a.getStatus())
                .author(a.getAuthor())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}