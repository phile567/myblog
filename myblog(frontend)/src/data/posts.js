// 替换为你的后端接口后，可删除此文件
export const posts = [
  {
    id: "jwt-troubleshooting",
    title: "JWT 实战：从报错到上线",
    date: "2025-08-23",
    excerpt: "记录一次 JJWT 依赖与密钥坑的排查过程，以及最终的可上线实现方案。",
    content: `这篇文章记录了从 NoClassDefFoundError 到密钥长度 WeakKeyException 的完整排查过程...
    
1. 依赖正确引入 jjwt-api/jjwt-impl/jjwt-jackson 同版本
2. 使用 32 字节以上密钥或 Base64 编码
3. 统一封装 JwtService 并注入 Spring 管理
`,
  },
  {
    id: "validation-best-practice",
    title: "表单校验最佳实践（前后端一致性）",
    date: "2025-08-21",
    excerpt: "如何让前端提示和后端规则保持一致，减少重复校验与误报。",
    content: `前端建议使用 whitespace 与 validateFirst；后端使用 Bean Validation 并约定返回错误格式...
`,
  },
  {
    id: "setup-dev-env",
    title: "我的第一篇博客：搭建开发环境",
    date: "2025-08-20",
    excerpt: "从 0 到 1 搭建前后端环境，记录踩坑与解决。",
    content: `记一次开发环境的搭建与优化，包括前端构建、后端热加载、接口联调等。
`,
  },
];