package com.example.mall.repository;

import com.example.mall.model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    Page<Article> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Page<Article> findByAuthorOrderByCreatedAtDesc(String author, Pageable pageable);
}