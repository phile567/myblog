package com.example.mall.controller;

import com.example.mall.dto.article.ArticleCreateRequest;
import com.example.mall.dto.article.ArticleResponse;
import com.example.mall.dto.article.ArticleUpdateRequest;
import com.example.mall.exception.BusinessException;
import com.example.mall.exception.ErrorCode;
import com.example.mall.model.User;
import com.example.mall.service.ArticleService;
import com.example.mall.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService service;
    private final UserService userService;

    // 公共：分页列表（默认只返回已发布）
    @GetMapping
    public Page<ArticleResponse> list(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size,
                                      @RequestParam(defaultValue = "PUBLISHED") String status) {
        return service.list(page, size, status);
    }

    // 公共：详情
    @GetMapping("/{id}")
    public ArticleResponse detail(@PathVariable Long id) {
        return service.get(id);
    }

    // 我的文章（需要作者权限）
    @GetMapping("/me")
    public Page<ArticleResponse> myArticles(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size,
                                            Authentication auth) {
        // 🔥 检查是否为作者
        User currentUser = userService.findByUsername(auth.getName());
        if (!currentUser.canCreateArticle()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "只有作者可以查看文章管理");
        }

        return service.listByAuthor(auth.getName(), page, size);
    }

    // 创建（需要作者权限）
    @PostMapping
    public ArticleResponse create(@Valid @RequestBody ArticleCreateRequest req, Authentication auth) {
        // 🔥 检查是否为作者 (status = 0)
        User currentUser = userService.findByUsername(auth.getName());
        if (!currentUser.canCreateArticle()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "只有作者可以创建文章");
        }

        return service.create(req, auth.getName());
    }

    // 更新（只有文章作者可以更新）
    @PutMapping("/{id}")
    public ArticleResponse update(@PathVariable Long id,
                                  @Valid @RequestBody ArticleUpdateRequest req,
                                  Authentication auth) {
        // 🔥 检查是否为作者
        User currentUser = userService.findByUsername(auth.getName());
        if (!currentUser.canCreateArticle()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "只有作者可以编辑文章");
        }

        // 🔥 移除多余的 false 参数
        return service.update(id, req, auth.getName());
    }

    // 删除（只有文章作者可以删除）
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        // 🔥 检查是否为作者
        User currentUser = userService.findByUsername(auth.getName());
        if (!currentUser.canCreateArticle()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "只有作者可以删除文章");
        }

        // 🔥 移除多余的 false 参数
        service.delete(id, auth.getName());
    }
}