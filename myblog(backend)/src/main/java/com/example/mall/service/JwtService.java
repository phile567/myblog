package com.example.mall.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.Date;

@Service
public class JwtService {

    // 建议用 Base64 的 32+ 字节密钥，通过环境变量或配置注入
    private final String secretBase64 = System.getenv().getOrDefault("JWT_SECRET_BASE64", "");

    // 生成 Token（1 小时过期）
    public String generateToken(String subject) {
        SecretKey key = getKey();
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(subject)
                .issuedAt(new Date(now))
                .expiration(new Date(now + 3_600_000))
                .signWith(key, Jwts.SIG.HS256) // 0.12.x 写法
                .compact();
    }

    // 校验 Token（签名+过期）
    public boolean validate(String token) {
        try {
            Claims claims = parseClaims(token);
            Date exp = claims.getExpiration();
            return exp == null || exp.after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // 解析用户名
    public String getUsername(String token) {
        Claims claims = parseClaims(token);
        String sub = claims.getSubject();
        if (sub != null && !sub.isBlank()) return sub;
        Object u = claims.get("username");
        return u != null ? String.valueOf(u) : null;
    }

    // 解析角色 -> Authorities
    public Collection<? extends GrantedAuthority> getAuthorities(String token) {
        Claims claims = parseClaims(token);
        Object rolesClaim = Optional.ofNullable(claims.get("roles")).orElse(claims.get("authorities"));
        List<SimpleGrantedAuthority> list = new ArrayList<>();
        if (rolesClaim instanceof List<?> rl) {
            for (Object r : rl) {
                if (r == null) continue;
                String role = String.valueOf(r).trim();
                if (!role.isEmpty()) list.add(asRole(role));
            }
        } else if (rolesClaim instanceof String rs) {
            for (String r : rs.split(",")) {
                String role = r.trim();
                if (!role.isEmpty()) list.add(asRole(role));
            }
        }
        return list;
    }

    /* ==================== 内部工具 ==================== */

    private SecretKey getKey() {
        if (secretBase64 != null && !secretBase64.isBlank()) {
            try {
                byte[] keyBytes = Decoders.BASE64.decode(secretBase64);
                return Keys.hmacShaKeyFor(keyBytes);
            } catch (IllegalArgumentException ignore) {}
        }
        // 演示用明文密钥（确保长度 >= 32 字节）
        String fallback = "JDKl2j3Kdsf83nfsdkfj92Ksdfn23JDKfnsdkfj20sdlfkj239dkfj";
        return Keys.hmacShaKeyFor(fallback.getBytes(StandardCharsets.UTF_8));
    }

    // 0.12.x 解析写法
    private Claims parseClaims(String token) {
        SecretKey key = getKey();
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SimpleGrantedAuthority asRole(String role) {
        return new SimpleGrantedAuthority(role.startsWith("ROLE_") ? role : "ROLE_" + role);
    }
}