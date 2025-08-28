package com.example.mall.service;

import com.example.mall.dto.guestbook.GuestbookEntryRequest;
import com.example.mall.dto.guestbook.GuestbookEntryResponse;
import com.example.mall.dto.guestbook.GuestbookReplyRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GuestbookService {
    
    /**
     * 获取所有留言（分页）
     */
    Page<GuestbookEntryResponse> getAllEntries(Pageable pageable);
    
    /**
     * 创建留言
     */
    GuestbookEntryResponse createEntry(GuestbookEntryRequest request, 
                                     String currentUsername, 
                                     HttpServletRequest httpRequest);
    
    /**
     * 删除留言（仅作者）
     */
    void deleteEntry(Long id, String currentUsername);
    
    /**
     * 回复留言（仅作者）
     */
    GuestbookEntryResponse replyToEntry(Long id, 
                                      GuestbookReplyRequest request, 
                                      String currentUsername);
    
    /**
     * 获取留言统计信息（仅作者）
     * 🔥 添加参数匹配实现类
     */
    GuestbookStats getStats(String currentUsername);
    
    /**
     * 留言统计数据
     */
    @Data
    @Builder
    class GuestbookStats {
        private long totalEntries;      // 总留言数
        private long pendingReplies;    // 待回复数
        private double replyRate;       // 回复率
    }
}
