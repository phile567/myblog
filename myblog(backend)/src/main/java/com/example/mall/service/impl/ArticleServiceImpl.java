package com.example.mall.service.impl;

import com.example.mall.dto.article.ArticleCreateRequest;
import com.example.mall.dto.article.ArticleResponse;
import com.example.mall.dto.article.ArticleUpdateRequest;
import com.example.mall.exception.BusinessException;
import com.example.mall.exception.ErrorCode;
import com.example.mall.mapper.ArticleMapper;
import com.example.mall.model.Article;
import com.example.mall.repository.ArticleRepository;
import com.example.mall.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository repo;
    private final ArticleMapper mapper;

    @Override
    public Page<ArticleResponse> list(int page, int size, String status) {
        PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
            return repo.findAll(pr).map(mapper::toResponse);
        }
        return repo.findByStatusOrderByCreatedAtDesc(status, pr).map(mapper::toResponse);
    }

    @Override
    public Page<ArticleResponse> listByAuthor(String author, int page, int size) {
        PageRequest pr = PageRequest.of(page, size);
        return repo.findByAuthorOrderByCreatedAtDesc(author, pr).map(mapper::toResponse);
    }

    @Override
    public ArticleResponse get(Long id) {
        Article a = repo.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "文章不存在"));
        return mapper.toResponse(a);
    }

    @Override
    @Transactional
    public ArticleResponse create(ArticleCreateRequest req, String username) {
        Article a = mapper.toEntity(req, username);
        a = repo.save(a);
        return mapper.toResponse(a);
    }

    @Override
    @Transactional
    public ArticleResponse update(Long id, ArticleUpdateRequest req, String username) {
        Article a = repo.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "文章不存在"));
        
        // 🔥 简化权限检查：只有文章作者才能编辑
        if (a.getAuthor() == null || !a.getAuthor().equals(username)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "只能编辑自己的文章");
        }
        
        mapper.updateEntity(a, req);
        a = repo.save(a);
        return mapper.toResponse(a);
    }

    @Override
    @Transactional
    public void delete(Long id, String username) {
        Article a = repo.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "文章不存在"));
        
        // 🔥 简化权限检查：只有文章作者才能删除
        if (a.getAuthor() == null || !a.getAuthor().equals(username)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "只能删除自己的文章");
        }
        
        repo.deleteById(id);
    }
}