package com.example.mall.service.impl;

import com.example.mall.dto.guestbook.GuestbookEntryRequest;
import com.example.mall.dto.guestbook.GuestbookEntryResponse;
import com.example.mall.dto.guestbook.GuestbookReplyRequest;
import com.example.mall.model.GuestbookEntry;
import com.example.mall.model.User;
import com.example.mall.exception.BusinessException;
import com.example.mall.exception.ErrorCode;
import com.example.mall.repository.GuestbookEntryRepository;
import com.example.mall.repository.UserRepository;
import com.example.mall.service.GuestbookService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class GuestbookServiceImpl implements GuestbookService {
    
    private final GuestbookEntryRepository guestbookRepository;
    private final UserRepository userRepository;
    
    @Override
    public Page<GuestbookEntryResponse> getAllEntries(Pageable pageable) {
        Page<GuestbookEntry> entries = guestbookRepository.findAllByOrderByCreatedAtDesc(pageable);
        return entries.map(GuestbookEntryResponse::from);
    }
    
    @Override
    @Transactional
    public GuestbookEntryResponse createEntry(GuestbookEntryRequest request, 
                                            String currentUsername, 
                                            HttpServletRequest httpRequest) {
        
        // 构建留言实体
        GuestbookEntry.GuestbookEntryBuilder builder = GuestbookEntry.builder()
                .message(request.getMessage())
                .email(request.getEmail())
                .ipAddress(getClientIpAddress(httpRequest));
        
        // 🔥 处理用户身份
        if (currentUsername != null) {
            // 登录用户：使用真实用户名和ID
            Optional<User> userOpt = userRepository.findByUsername(currentUsername);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                builder.name(user.getUsername())
                       .userId(user.getId())
                       .userType(GuestbookEntry.UserType.REGISTERED);
                log.info("注册用户 {} 提交留言", currentUsername);
            } else {
                throw new BusinessException(ErrorCode.USER_NOT_FOUND, "用户不存在");
            }
        } else {
            // 游客：使用提供的姓名
            builder.name(request.getName())
                   .userType(GuestbookEntry.UserType.GUEST);
            log.info("游客 {} 提交留言", request.getName());
        }
        
        GuestbookEntry entry = guestbookRepository.save(builder.build());
        log.info("留言创建成功，ID: {}", entry.getId());
        
        return GuestbookEntryResponse.from(entry);
    }
    
    @Override
    @Transactional
    public void deleteEntry(Long id, String currentUsername) {
        log.info("尝试删除留言 - ID: {}, 操作者: {}", id, currentUsername);
        
        // 🔥 验证作者权限 - 使用数据库状态检查
        if (!isAuthor(currentUsername)) {
            log.warn("权限检查失败 - 用户: {} 不是作者", currentUsername);
            throw new BusinessException(ErrorCode.FORBIDDEN, "只有作者可以删除留言");
        }
        
        GuestbookEntry entry = guestbookRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.GUESTBOOK_NOT_FOUND, "留言不存在"));
        
        guestbookRepository.delete(entry);
        log.info("作者 {} 删除了留言 ID: {}", currentUsername, id);
    }
    
    @Override
    @Transactional
    public GuestbookEntryResponse replyToEntry(Long id, 
                                             GuestbookReplyRequest request, 
                                             String currentUsername) {
        log.info("尝试回复留言 - ID: {}, 操作者: {}", id, currentUsername);
        
        // 🔥 验证作者权限 - 使用数据库状态检查
        if (!isAuthor(currentUsername)) {
            log.warn("权限检查失败 - 用户: {} 不是作者", currentUsername);
            throw new BusinessException(ErrorCode.FORBIDDEN, "只有作者可以回复留言");
        }
        
        GuestbookEntry entry = guestbookRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.GUESTBOOK_NOT_FOUND, "留言不存在"));
        
        entry.setReply(request.getReply());
        entry.setRepliedAt(LocalDateTime.now());
        
        GuestbookEntry updated = guestbookRepository.save(entry);
        log.info("作者 {} 回复了留言 ID: {}", currentUsername, id);
        
        return GuestbookEntryResponse.from(updated);
    }
    
// 在 GuestbookServiceImpl.java 中修改 getStats 方法
@Override
public GuestbookStats getStats(String currentUsername) {
    // 🔥 添加权限检查
    if (!isAuthor(currentUsername)) {
        log.warn("权限检查失败 - 用户: {} 不是作者", currentUsername);
        throw new BusinessException(ErrorCode.FORBIDDEN, "只有作者可以查看统计信息");
    }
    
    long totalEntries = guestbookRepository.count();
    long pendingReplies = guestbookRepository.countByReplyIsNull();
    
    return GuestbookStats.builder()
            .totalEntries(totalEntries)
            .pendingReplies(pendingReplies)
            .replyRate(totalEntries > 0 ? 
                (double)(totalEntries - pendingReplies) / totalEntries * 100 : 0)
            .build();
}
    
    // 🔥 获取客户端IP地址
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    // 🔥 检查是否为作者 - 使用数据库状态而不是硬编码用户名
    private boolean isAuthor(String username) {
        if (username == null || username.trim().isEmpty()) {
            log.debug("用户名为空，非作者");
            return false;
        }
        
        try {
            Optional<User> userOpt = userRepository.findByUsername(username.trim());
            if (userOpt.isEmpty()) {
                log.warn("用户不存在: {}", username);
                return false;
            }
            
            User user = userOpt.get();
            Integer status = user.getStatus();
            
            log.debug("权限检查 - 用户: {}, status: {}, 类型: {}", 
                    username, status, status != null ? status.getClass().getSimpleName() : "null");
            
            // 🔥 status = 0 表示作者
            boolean isAuthor = Integer.valueOf(0).equals(status);
            
            log.info("权限检查结果 - 用户: {}, status: {}, 是否为作者: {}", 
                    username, status, isAuthor);
            
            return isAuthor;
            
        } catch (Exception e) {
            log.error("权限检查异常 - 用户: {}", username, e);
            return false;
        }
    }
}
