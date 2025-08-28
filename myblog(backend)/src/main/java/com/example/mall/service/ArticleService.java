package com.example.mall.service;

import com.example.mall.dto.article.ArticleCreateRequest;
import com.example.mall.dto.article.ArticleResponse;
import com.example.mall.dto.article.ArticleUpdateRequest;
import org.springframework.data.domain.Page;

public interface ArticleService {

    Page<ArticleResponse> list(int page, int size, String status);

    Page<ArticleResponse> listByAuthor(String author, int page, int size);

    ArticleResponse get(Long id);

    ArticleResponse create(ArticleCreateRequest req, String username);

    ArticleResponse update(Long id, ArticleUpdateRequest req, String username);

    void delete(Long id, String username);
}