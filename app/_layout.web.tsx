/**
 * Web 专用根布局：注入 PWA 全局样式后复用默认布局。
 * 仅参与 Web 构建；导出自 _layoutBase 避免与 _layout 的循环引用。
 */
import "@/styles/web-pwa.css";

if (typeof __DEV__ !== "undefined" && __DEV__) {
  console.info(
    "[PWA] 如需离线/缓存逻辑，可考虑安装并配置 expo-service-worker 或 Workbox。"
  );
}

export { default } from "./_layoutBase";
