# 安装

## 环境要求

- **Node.js 20.19.0 或更高** — 检查版本：`node --version`

## 包管理器

### npm

```bash
npm install -g @fission-ai/phspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/phspec@latest
```

### yarn

```bash
yarn global add @fission-ai/phspec@latest
```

### bun

```bash
bun add -g @fission-ai/phspec@latest
```

## Nix

不安装即可直接运行 PhSpec：

```bash
nix run github:Fission-AI/PhSpec -- init
```

或安装到当前 profile：

```bash
nix profile install github:Fission-AI/PhSpec
```

或在 `flake.nix` 中加入开发环境：

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    phspec.url = "github:Fission-AI/PhSpec";
  };

  outputs = { nixpkgs, phspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ phspec.packages.x86_64-linux.default ];
    };
  };
}
```

## 验证安装

```bash
phspec --version
```

## 下一步

安装后，在项目中初始化 PhSpec：

```bash
cd your-project
phspec init
```

完整流程见 [入门](getting-started.md)。
