# 汉化术语表

内化时请统一使用下表译法，避免同一概念出现多种中文表述。

| 英文        | 中文（推荐） | 备注                                       |
| ----------- | ------------ | ------------------------------------------ |
| spec        | 规范         | 指 openspec/specs/ 下的规格说明            |
| change      | 变更         | 指一次改动提案及其目录                     |
| proposal    | 提案         | proposal.md 对应                           |
| design      | 设计         | design.md 对应                             |
| tasks       | 任务（列表） | tasks.md 对应                              |
| artifact    | 制品         | 变更内的产出物（提案、设计、规范、任务等） |
| delta spec  | 增量规范     | 描述对主规范的增/改/删的 spec              |
| archive     | 归档         | 动词：将变更合并并移入 archive             |
| requirement | 需求         | 规范中的「必须」条款                       |
| scenario    | 场景         | 需求下的 Given/When/Then 示例              |
| schema      | 工作流模式   | 或简称「模式」，指 artifact 依赖定义       |
| capability  | 能力         | 规范按能力/领域划分时的单位                |
| workflow    | 工作流       | 与 schema 相关时与「工作流模式」一致       |

**不翻译**：命令名（`openspec`、`init`、`list` 等）、斜杠命令 ID（`/opsx:new`）、选项名（`--json`、`--change`）、路径与文件名（`proposal.md`、`openspec/specs/`）、配置键名。

执行汉化前可据此表微调用词，并在全库中保持一致。
