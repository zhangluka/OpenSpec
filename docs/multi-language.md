# 多语言指南

配置 PhSpec，使生成的制品使用英语以外的语言。

## 快速配置

在 `phspec/config.yaml` 中加入语言说明：

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # 下面写你的其他项目上下文...
  Tech stack: TypeScript, React, Node.js
```

之后生成的制品会使用该语言。

## 示例

### 简体中文

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### 葡萄牙语（巴西）

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### 日语

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### 技术术语处理

可单独约定技术术语写法，例如：

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

语言设置可与其它项目上下文一起使用。

## 校验

确认语言配置生效：

```bash
phspec instructions proposal --change my-change
```

输出中应包含你配置的语言说明。

## 相关文档

- [自定义](customization.md) - 项目配置选项
- [工作流](workflows.md) - 工作流说明
