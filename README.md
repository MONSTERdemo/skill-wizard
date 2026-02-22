# Claude Code Skill Generator

一个用于生成 Claude Code skill 配置文件的工具，支持 Web 界面和命令行两种方式。

## 功能特点

- 可视化 Web 界面，实时预览生成结果
- 命令行工具，支持交互式和快速创建模式
- 支持 Markdown 和 JSON 两种输出格式
- 支持自定义触发短语
- 一键下载生成的文件

## 安装

```bash
git clone https://github.com/YOUR_USERNAME/claude-code-skill-generator.git
cd claude-code-skill-generator
```

无需安装依赖，使用 Node.js 原生模块。

## 使用方法

### 方式 1: Web 界面

启动本地服务器：

```bash
node skill-generator.js serve
```

然后访问 http://localhost:3000

或者直接在浏览器中打开 `skill-generator.html` 文件。

### 方式 2: 命令行交互式创建

```bash
node skill-generator.js create
```

按照提示输入 skill 信息即可。

### 方式 3: 快速创建模板

```bash
node skill-generator.js create -n my-awesome-skill
```

这会在 `skills/` 目录下生成一个模板文件，你可以编辑它来完善你的 skill。

## Skill 文件格式

生成的 Markdown 格式 skill 文件示例：

```markdown
---
name: my-skill
title: My Awesome Skill
userInvocable: true
---

# My Awesome Skill

这是一个示例 skill...

## 触发条件

当用户使用以下短语时触发此 skill：
- "触发短语1"
- "触发短语2"

## 指令

在此编写详细的指令内容...
```

## 命令参考

| 命令 | 说明 |
|------|------|
| `node skill-generator.js serve` | 启动 Web 服务器 |
| `node skill-generator.js create` | 交互式创建 skill |
| `node skill-generator.js create -n <name>` | 快速创建 skill 模板 |
| `node skill-generator.js help` | 显示帮助信息 |

## 许可证

MIT License
