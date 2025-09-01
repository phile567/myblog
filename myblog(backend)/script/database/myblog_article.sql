-- MySQL dump 10.13  Distrib 8.0.43, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: myblog
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `cover_url` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `tags` varchar(1000) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (5,'admin','React Hooks 是 React 16.8 引入的新特性，它让我们能够在函数组件中使用状态和其他 React 特性。\n\n## 什么是 Hooks\n\nHooks 是一些可以让你在函数组件里\"钩入\" React state 及生命周期等特性的函数。它们让你在不编写 class 的情况下使用 state 以及其他的 React 特性。\n\n## useState Hook\n\nuseState 是最常用的 Hook，它让函数组件拥有状态：\n\n```javascript\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>你点击了 {count} 次</p>\n      <button onClick={() => setCount(count + 1)}>\n        点击我\n      </button>\n    </div>\n  );\n}\nuseEffect Hook\nuseEffect 让你能够在函数组件中执行副作用操作：\nimport React, { useState, useEffect } from \'react\';\n\nfunction Timer() {\n  const [seconds, setSeconds] = useState(0);\n\n  useEffect(() => {\n    const interval = setInterval(() => {\n      setSeconds(seconds => seconds + 1);\n    }, 1000);\n\n    return () => clearInterval(interval);\n  }, []);\n\n  return <div>计时器: {seconds} 秒</div>;\n}',NULL,'2025-08-26 14:54:21.496214','PUBLISHED',NULL,NULL,'React Hooks 入门指南','2025-08-26 14:54:21.496245'),(16,'admin','test',NULL,'2025-08-27 10:33:55.306101','DRAFT',NULL,NULL,'this is a  draft','2025-08-27 10:33:55.306219'),(17,'admin','欢迎来到我的博客！今天我将为大家展示 **Markdown** 这个神奇的标记语言，看看它如何让我们的写作变得更加高效和专业。\n\n## 什么是 Markdown？\n\nMarkdown 是一种**轻量级标记语言**，它让你可以使用简单的语法来格式化文本。相比于复杂的富文本编辑器，Markdown 让你专注于内容本身，而不是格式化的细节。\n\n### 为什么选择 Markdown？\n\n1. **简单易学** - 语法直观，几分钟就能上手\n2. **跨平台兼容** - 任何文本编辑器都能打开\n3. **专业美观** - 生成的文档格式统一、美观\n4. **版本控制友好** - 纯文本格式，便于 Git 管理\n\n## 基础语法展示\n\n### 文本格式化\n\n这里有一些基本的文本格式：\n\n- **粗体文字** - 使用 `**粗体**` 语法\n- *斜体文字* - 使用 `*斜体*` 语法  \n- ~~删除线~~ - 使用 `~~删除线~~` 语法\n- `行内代码` - 使用反引号包围\n\n你可以组合使用：***粗斜体*** 文字！\n\n### 列表功能\n\n#### 无序列表\n- ? 项目规划\n- ? 文档编写\n- ? 产品发布\n  - 内测版本\n  - 公开测试\n  - 正式发布\n\n#### 有序列表\n1. **需求分析** - 明确项目目标\n2. **技术选型** - 选择合适的技术栈\n3. **开发实现** - 编码和测试\n4. **部署上线** - 发布到生产环境\n\n### 代码展示\n\nMarkdown 对程序员特别友好，支持语法高亮：\n\n```javascript\n// JavaScript 示例\nfunction createBlogPost(title, content) {\n    return {\n        id: Date.now(),\n        title: title,\n        content: content,\n        createdAt: new Date(),\n        author: \"博主\"\n    };\n}\n\nconst post = createBlogPost(\n    \"我的第一篇 Markdown 文章\", \n    \"这是用 Markdown 写的内容\"\n);\nconsole.log(post);\n```\n\n```python\n# Python 示例\ndef fibonacci(n):\n    \"\"\"生成斐波那契数列\"\"\"\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# 生成前10个斐波那契数\nnumbers = [fibonacci(i) for i in range(10)]\nprint(f\"斐波那契数列: {numbers}\")\n```\n\n```sql\n-- SQL 查询示例\nSELECT \n    u.username,\n    COUNT(a.id) as article_count,\n    MAX(a.created_at) as last_post\nFROM users u\nLEFT JOIN articles a ON u.id = a.author_id\nWHERE u.status = \'ACTIVE\'\nGROUP BY u.id, u.username\nORDER BY article_count DESC\nLIMIT 10;\n```\n\n## 高级功能\n\n### 引用块\n\n> \"简洁是智慧的灵魂，冗长是肤浅的装饰。\"\n> \n> —— 威廉·莎士比亚\n\n> ? **小贴士**：Markdown 的设计哲学是让写作者专注于内容，而不是格式。当你习惯了 Markdown 的语法后，你会发现写作效率大大提升。\n\n### 表格展示\n\n| 功能特性 | 传统编辑器 | Markdown | 优势 |\n|---------|-----------|----------|------|\n| 学习成本 | 中等 | 低 | ✅ 易上手 |\n| 文件大小 | 大 | 小 | ✅ 轻量级 |\n| 跨平台性 | 差 | 优秀 | ✅ 通用性强 |\n| 版本控制 | 困难 | 简单 | ✅ Git 友好 |\n| 专注度 | 分散 | 集中 | ✅ 专注内容 |\n\n### 链接和图片\n\n你可以轻松添加链接：\n- [Markdown 官方语法](https://daringfireball.net/projects/markdown/syntax)\n- [GitHub Markdown 指南](https://guides.github.com/features/mastering-markdown/)\n- 我的博客首页\n\n图片也很简单（这里是示例语法）：\n```markdown\n![Markdown Logo](https://markdown-here.com/img/icon256.png)\n```\n\n### 分割线\n\n你可以使用分割线来分隔不同的内容部分：\n\n---\n\n## 数学公式（如果支持）\n\n对于技术博客，数学公式是必不可少的：\n\n```\n行内公式：$E = mc^2$\n\n块级公式：\n$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n$$\n```\n\n## 实际应用场景\n\n### 1. 技术文档\n```markdown\n## API 接口文档\n\n### 创建文章\n- **URL**: `POST /api/articles`\n- **参数**:\n  - `title` (string) - 文章标题\n  - `content` (string) - 文章内容\n- **返回**: 创建成功的文章对象\n```\n\n### 2. 项目说明\n```markdown\n# MyBlog 项目\n\n## 快速开始\n1. 克隆仓库：`git clone https://github.com/username/myblog.git`\n2. 安装依赖：`npm install`\n3. 启动服务：`npm start`\n\n## 功能特性\n- [x] 用户注册登录\n- [x] 文章发布编辑\n- [x] Markdown 支持\n- [ ] 评论系统\n- [ ] 搜索功能\n```\n\n### 3. 会议记录\n```markdown\n# 产品会议纪要\n**时间**：2024年8月27日  \n**参与者**：产品经理、前端开发、后端开发\n\n## 讨论要点\n1. 新功能需求确认\n2. 技术实现方案\n3. 时间排期安排\n\n## 行动项\n- [ ] 前端：完成 UI 设计稿 (本周五前)\n- [ ] 后端：API 接口设计 (下周一前)\n- [ ] 测试：准备测试用例 (下周三前)\n```\n\n## 总结\n\n通过这篇文章，我们看到了 Markdown 的强大功能：\n\n### ✅ 优势总结\n1. **语法简单** - 几个符号就能完成复杂格式\n2. **渲染美观** - 自动生成专业的排版\n3. **功能丰富** - 支持代码、表格、公式等\n4. **专注写作** - 不被格式化细节干扰\n5. **通用兼容** - 几乎所有平台都支持\n\n### ? 适用场景\n- ? 技术博客和文档\n- ? 项目 README 文件  \n- ? 会议记录和报告\n- ? 在线教程和指南\n- ? 工作笔记和总结\n\n现在你已经看到了 Markdown 的魅力，是不是很想开始使用它来写作呢？在我的博客系统中，你可以直接使用 Markdown 编辑器来创建这样专业的文章！\n\n---\n\n*感谢阅读！如果你觉得这篇文章有帮助，欢迎在留言板分享你的想法。* ?\n\n**Happy Writing with Markdown!** ✨',NULL,'2025-08-27 12:50:52.895093','PUBLISHED',NULL,NULL,'Markdown 编写指南：让你的博客文章更专业','2025-08-27 12:50:52.895131'),(19,'admin','这是一个测试',NULL,'2025-08-27 15:13:14.536159','PUBLISHED','',NULL,'这是一个测试','2025-08-28 01:17:36.728492');
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-30 15:12:37
