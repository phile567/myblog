package com.example.mall.dto.guestbook;

import com.example.mall.model.GuestbookEntry;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GuestbookEntryResponse {
    
    private Long id;
    private String name;
    private String email;
    private String message;
    private String reply;
    private String userType;
    private boolean isRegisteredUser;
    private boolean hasReply;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime repliedAt;
    
    // 🔥 静态工厂方法
    public static GuestbookEntryResponse from(GuestbookEntry entry) {
        return GuestbookEntryResponse.builder()
                .id(entry.getId())
                .name(entry.getName())
                .email(entry.getEmail())
                .message(entry.getMessage())
                .reply(entry.getReply())
                .userType(entry.getUserType().name())
                .isRegisteredUser(entry.isRegisteredUser())
                .hasReply(entry.hasReply())
                .createdAt(entry.getCreatedAt())
                .repliedAt(entry.getRepliedAt())
                .build();
    }
}