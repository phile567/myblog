package com.example.mall.common.enums;


public enum UserStatus {
    AUTHOR(0, "作者"),
    USER(1, "普通用户");

    private final int code;
    private final String desc;

    UserStatus(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() { return code; }
    public String getDesc() { return desc; }

    public static UserStatus fromCode(int code) {
        for (UserStatus s : values()) {
            if (s.code == code) return s;
        }
        return USER; // 默认返回普通用户
    }

    // 🔥 权限检查方法
    public boolean isAuthor() {
        return this == AUTHOR;
    }

    public boolean canCreateArticle() {
        return this == AUTHOR;
    }

    public boolean isActiveUser() {
        return true; // 两种状态都是活跃用户
    }
}
