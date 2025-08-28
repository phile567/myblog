package com.example.mall.controller;

import com.example.mall.dto.guestbook.GuestbookEntryRequest;
import com.example.mall.dto.guestbook.GuestbookEntryResponse;
import com.example.mall.dto.guestbook.GuestbookReplyRequest;
import com.example.mall.service.GuestbookService;
import com.example.mall.exception.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/guestbook")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class GuestbookController {
    
    private final GuestbookService guestbookService;
    
    // 🔥 获取留言列表（分页）
    @GetMapping
    public ResponseEntity<Page<GuestbookEntryResponse>> getEntries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("获取留言列表 - 页码: {}, 大小: {}", page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<GuestbookEntryResponse> entries = guestbookService.getAllEntries(pageable);
        
        log.info("返回留言列表 - 总数: {}, 当前页数量: {}", 
                entries.getTotalElements(), entries.getContent().size());
        
        return ResponseEntity.ok(entries);
    }
    
    // 🔥 创建留言
    @PostMapping
    public ResponseEntity<?> createEntry(
            @Valid @RequestBody GuestbookEntryRequest request,
            Authentication auth,
            HttpServletRequest httpRequest) {
        
        try {
            String currentUsername = auth != null ? auth.getName() : null;
            
            log.info("创建留言 - 用户: {}, 姓名: {}", 
                    currentUsername != null ? currentUsername : "游客", request.getName());
            
            GuestbookEntryResponse response = guestbookService.createEntry(
                    request, currentUsername, httpRequest);
            
            return ResponseEntity.status(201).body(response);
            
        } catch (BusinessException e) {
            log.error("创建留言失败: {}", e.getMessage());
            return ResponseEntity.status(e.getStatus().value())
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("创建留言异常", e);
            return ResponseEntity.status(500)
                .body(Map.of("message", "创建留言失败"));
        }
    }
    
    // 🔥 删除留言（仅作者）
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntry(
            @PathVariable Long id,
            Authentication auth) {
        
        try {
            if (auth == null) {
                return ResponseEntity.status(401)
                    .body(Map.of("message", "需要登录"));
            }
            
            String username = auth.getName();
            log.info("删除留言 - ID: {}, 操作者: {}", id, username);
            
            // 🔥 Service 层会检查权限，如果没权限会抛出 BusinessException
            guestbookService.deleteEntry(id, username);
            
            return ResponseEntity.ok(Map.of("message", "留言删除成功"));
            
        } catch (BusinessException e) {
            log.error("删除留言失败: {}", e.getMessage());
            return ResponseEntity.status(e.getStatus().value())
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("删除留言异常", e);
            return ResponseEntity.status(500)
                .body(Map.of("message", "删除留言失败"));
        }
    }
    
    // 🔥 回复留言（仅作者）
    @PutMapping("/{id}/reply")
    public ResponseEntity<?> replyToEntry(
            @PathVariable Long id,
            @Valid @RequestBody GuestbookReplyRequest request,
            Authentication auth) {
        
        try {
            if (auth == null) {
                return ResponseEntity.status(401)
                    .body(Map.of("message", "需要登录"));
            }
            
            String username = auth.getName();
            log.info("回复留言 - ID: {}, 操作者: {}", id, username);
            
            // 🔥 Service 层会检查权限，如果没权限会抛出 BusinessException
            GuestbookEntryResponse response = guestbookService.replyToEntry(
                    id, request, username);
            
            return ResponseEntity.ok(response);
            
        } catch (BusinessException e) {
            log.error("回复留言失败: {}", e.getMessage());
            return ResponseEntity.status(e.getStatus().value())
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("回复留言异常", e);
            return ResponseEntity.status(500)
                .body(Map.of("message", "回复留言失败"));
        }
    }
    
// 修改 getStats 方法中的调用

@GetMapping("/stats")
public ResponseEntity<?> getStats(Authentication auth) {
    
    try {
        if (auth == null) {
            return ResponseEntity.status(401)
                .body(Map.of("message", "需要登录"));
        }
        
        String username = auth.getName();
        log.info("获取留言统计 - 操作者: {}", username);
        
        // 🔥 传递用户名参数
        GuestbookService.GuestbookStats stats = guestbookService.getStats(username);
        
        return ResponseEntity.ok(stats);
        
    } catch (BusinessException e) {
        log.error("获取统计失败: {}", e.getMessage());
        return ResponseEntity.status(e.getStatus().value())
            .body(Map.of("message", e.getMessage()));
    } catch (Exception e) {
        log.error("获取统计异常", e);
        return ResponseEntity.status(500)
            .body(Map.of("message", "获取统计失败"));
    }
}
}