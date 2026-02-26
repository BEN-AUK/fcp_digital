/**
 * FCP Digital - 工业级高能效设计系统 (V3: 工业亮色模式)
 * 高对比度、干净清爽的亮色主题；底栏保持深色形成强烈分割。
 */

export const theme = {
  colors: {
    // --- 亮色基础 ---
    background: '#F5F7F8', // 灰白冷色调背景，不刺眼
    surface: '#FFFFFF', // 纯白卡片背景，提升层级
    border: '#E2E8F0', // 浅灰色边框，界限清晰

    // --- 文字系统 (深色文字 on 亮色背景) ---
    textPrimary: '#1A1C1E', // 深枪灰，用于标题和正文
    textSecondary: '#718096', // 中灰色，用于次要信息
    textMuted: '#A0AEC0', // 浅灰，用于禁用态
    textOnDark: '#FFFFFF', // 专门用于深色背景上的文字（如 Tab 栏、主按钮）

    // --- 品牌与功能色 ---
    primary: '#008080', // 专业的深青色，在亮色底上更稳重
    secondary: '#38B2AC',
    success: '#2F855A', // 更深一点的绿色
    danger: '#C53030', // 更深一点的红色
    warning: '#C05621',

    // --- 特殊区域：底部 Tab 栏 (保持深色沉底) ---
    tabBarBackground: '#1E3A5F', // 深蓝色底栏背景，形成强烈分割
    tabBarActive: '#00B5B5', // 激活状态的高亮青色
    tabBarInactive: '#A0AEC0', // 未激活状态的灰色
  },

  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },

  borderRadius: {
    s: 4,
    m: 8,
    l: 12, // 推荐的工业卡片圆角
    full: 9999,
  },

  typography: {
    title: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
      letterSpacing: 0.5,
    },
    header: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
    },
  },

  layout: {
    maxContentWidth: 600, // Web 端安全宽度
    touchableHeight: 48, // 强制触控标准高度
    mainButtonHeight: 52, // 主操作按钮高度
  },
};

export type Theme = typeof theme;
