# 自定义

PhSpec 提供三个层次的自定义：

| 层次                 | 作用                         | 适合             |
| -------------------- | ---------------------------- | ---------------- |
| **项目配置**         | 设置默认值、注入上下文与规则 | 多数团队         |
| **自定义工作流模式** | 定义自己的制品流程           | 有独特流程的团队 |
| **全局覆盖**         | 在所有项目间共享模式         | 高级用户         |

---

## 项目配置

`phspec/config.yaml` 是团队定制 PhSpec 最直接的方式，可以：

- **设置默认工作流模式** — 不用每次加 `--schema`
- **注入项目上下文** — AI 能看到技术栈、约定等
- **按制品添加规则** — 为特定制品定制规则

### 快速配置

```bash
phspec init
```

会引导你交互式创建配置，也可手动创建：

```yaml
# phspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### 模式解析顺序

需要解析工作流模式时，按以下顺序查找：

1. CLI 参数：`--schema <name>`
2. 变更元数据（变更目录下的 `.phspec.yaml`）
3. 项目配置（`phspec/config.yaml`）
4. 默认（`spec-driven`）

---

## 自定义工作流模式

项目配置不够时，可在项目的 `phspec/schemas/` 下创建完全自定义的工作流模式，并随代码一起版本管理。

### 基于已有模式复制

最快的方式是复制内置模式再改：

```bash
phspec schema fork spec-driven my-workflow
```

会把 `spec-driven` 整份复制到 `phspec/schemas/my-workflow/`，之后可自由编辑。

### 从零创建

要全新流程时：

```bash
# 交互式
phspec schema init research-first

# 非交互
phspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### 模式结构

模式定义工作流中的制品及其依赖，例如：

- `id` — 唯一标识，用于命令与规则
- `generates` — 产出文件名（支持 `specs/**/*.md` 等 glob）
- `template` — `templates/` 下的模板文件
- `instruction` — 创建该制品的 AI 指引
- `requires` — 依赖，即需先存在的制品

### 校验与使用

使用自定义模式前建议校验：

```bash
phspec schema validate my-workflow
```

使用方式：

```bash
# 命令中指定
phspec new change feature --schema my-workflow

# 或在 config.yaml 中设默认
schema: my-workflow
```

### 调试模式解析

不确定当前用的是哪个模式时：

```bash
phspec schema which my-workflow
phspec schema which --all
```

---

> **说明：** PhSpec 也支持用户级模式（`~/.local/share/phspec/schemas/`），可跨项目共享；更推荐项目级 `phspec/schemas/`，便于随代码版本管理。

---

## 延伸阅读

- [CLI 参考：模式相关命令](cli.md#schema-commands) - 完整命令说明
