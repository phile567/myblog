package com.example.mall.repository;

import com.example.mall.model.GuestbookEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GuestbookEntryRepository extends JpaRepository<GuestbookEntry, Long> {
    
    // 🔥 按创建时间倒序分页查询
    Page<GuestbookEntry> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // 🔥 查询指定用户的留言
    Page<GuestbookEntry> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    // 🔥 查询有回复的留言
    Page<GuestbookEntry> findByReplyIsNotNullOrderByCreatedAtDesc(Pageable pageable);
    
    // 🔥 查询无回复的留言
    Page<GuestbookEntry> findByReplyIsNullOrderByCreatedAtDesc(Pageable pageable);
    
    // 🔥 按用户类型查询
    Page<GuestbookEntry> findByUserTypeOrderByCreatedAtDesc(
            GuestbookEntry.UserType userType, Pageable pageable);
    
    // 🔥 统计总留言数
    long count();
    
    // 🔥 统计待回复留言数
    long countByReplyIsNull();
    
    // 🔥 查询最近的留言
    @Query("SELECT g FROM GuestbookEntry g WHERE g.createdAt >= :since ORDER BY g.createdAt DESC")
    List<GuestbookEntry> findRecentEntries(@Param("since") LocalDateTime since);
}
