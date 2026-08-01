# 在 Mac 上运行书房网页

这个项目可以从 Windows 迁移到 Mac。网页源码、旅行照片和唱片机音频都可以直接复制，但 Windows 生成的依赖和构建缓存不能继续使用。

## 第一次运行

1. 解压迁移压缩包。
2. 安装 Node.js 22.13.0 或更高版本：<https://nodejs.org/>
3. 打开 Mac 的“终端”。
4. 输入 `cd `（`cd` 后留一个空格），把解压后的 `study-room-site` 文件夹拖进终端窗口，然后按回车。
5. 运行：

   ```zsh
   zsh ./start-mac.command
   ```

脚本会在第一次启动时自动安装依赖，随后启动网页并打开 <http://localhost:3000/>。终端窗口需要保持打开；结束预览时在终端按 `Control + C`。

## 手动启动方式

如果不使用启动脚本，也可以在项目目录依次运行：

```zsh
npm ci
npm run dev
```

然后用浏览器打开终端显示的本地地址，通常是 <http://localhost:3000/>。

## 直接复制整个文件夹时

请不要使用从 Windows 复制来的以下目录：

- `node_modules`
- `dist`
- `build`
- `.wrangler`

它们分别是平台相关依赖或可重新生成的缓存。在 Mac 上删除这些目录后运行 `npm ci` 即可重建。Windows 的 `启动本地预览.cmd` 也不能在 Mac 上执行，请改用上面的 `start-mac.command` 脚本。

`localhost` 只代表当前这台电脑。只有启动脚本或 `npm run dev` 正在运行时，Mac 上的 <http://localhost:3000/> 才能访问。
