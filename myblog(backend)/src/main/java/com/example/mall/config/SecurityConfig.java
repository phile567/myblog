package com.example.mall.config;

import com.example.mall.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * 密码编码器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS 配置：修复 allowCredentials 和 allowedOrigins 冲突
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        
        // 🔥 修复：明确指定前端地址，支持常见的开发端口
        cfg.setAllowedOrigins(List.of(
            "http://localhost:5173",  // Vite 默认端口
            "http://localhost:3000"   // Create React App 默认端口
        ));
        
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        cfg.setExposedHeaders(List.of("Authorization"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS / CSRF / 无状态会话
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 鉴权规则
            .authorizeHttpRequests(auth -> auth
                // 预检请求放行（CORS）
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // 登录、注册匿名
                .requestMatchers("/api/user/login", "/api/user/register").permitAll()

                // 文章读取匿名；写操作需登录（POST/PUT/DELETE 由下面 anyRequest() 控制）
                .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()

                // 🔥 留言板相关接口配置
                .requestMatchers(HttpMethod.GET, "/api/guestbook/**").permitAll()  // 获取留言列表 - 匿名可访问
                .requestMatchers(HttpMethod.POST, "/api/guestbook").permitAll()    // 创建留言 - 匿名可访问
                .requestMatchers(HttpMethod.PUT, "/api/guestbook/*/reply").authenticated()    // 回复留言 - 需认证
                .requestMatchers(HttpMethod.DELETE, "/api/guestbook/**").authenticated()      // 删除留言 - 需认证

                // Swagger（可选，如无可删除）
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()

                // 其他全部需要认证
                .anyRequest().authenticated()
            )

            // 关闭表单登录和 httpBasic（改用 JWT）
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // 异常处理（可替换为自定义 EntryPoint/DeniedHandler）
            .exceptionHandling(eh -> {
                // 使用默认 401/403 响应；如需统一响应结构，可注入自定义 handler
            })

            // 加入 JWT 过滤器（在用户名密码过滤器之前）
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}