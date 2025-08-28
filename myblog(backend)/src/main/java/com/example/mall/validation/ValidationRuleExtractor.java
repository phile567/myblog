package com.example.mall.validation;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ValidationRuleExtractor {

    public static class RuleSpec {
        public String rule;                 // 规则名，如 "Size"
        public Map<String, Object> params;  // 参数，如 {min:6, max:20}
    }

    /**
     * 根据字段错误的 ruleCode（如 "Size"）和 DTO 字段，提取规则及其参数
     */
    public static RuleSpec extractRule(Class<?> dtoClass, String fieldName, String ruleCode) {
        RuleSpec spec = new RuleSpec();
        spec.rule = ruleCode;
        spec.params = new HashMap<>();

        if (dtoClass == null || fieldName == null || ruleCode == null) {
            return spec;
        }

        Field field = findField(dtoClass, fieldName);
        if (field == null) return spec;

        switch (ruleCode) {
            case "NotBlank" -> {
                NotBlank ann = field.getAnnotation(NotBlank.class);
                if (ann != null) {
                    // NotBlank 没有参数，这里仅保留 rule 名称
                }
            }
            case "Size" -> {
                Size ann = field.getAnnotation(Size.class);
                if (ann != null) {
                    spec.params.put("min", ann.min());
                    spec.params.put("max", ann.max());
                }
            }
            case "Pattern" -> {
                Pattern ann = field.getAnnotation(Pattern.class);
                if (ann != null) {
                    spec.params.put("regexp", ann.regexp());
                }
            }
            case "Email" -> {
                Email ann = field.getAnnotation(Email.class);
                if (ann != null) {
                    // Email 一般无额外参数
                }
            }
            default -> {
                // 其他规则可按需扩展
            }
        }
        return spec;
    }

    private static Field findField(Class<?> clazz, String name) {
        Class<?> current = clazz;
        while (current != null && current != Object.class) {
            try {
                Field f = current.getDeclaredField(name);
                f.setAccessible(true);
                return f;
            } catch (NoSuchFieldException ignored) {
            }
            current = current.getSuperclass();
        }
        return null;
    }
}