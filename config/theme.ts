import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    // Brand
    colorPrimary: "#2563EB",
    colorSuccess: "#10B981",
    colorWarning: "#F59E0B",
    colorError: "#EF4444",
    colorInfo: "#3B82F6",

    // Backgrounds
    colorBgBase: "#FFFFFF",
    colorBgLayout: "#F8FAFC",
    colorBgContainer: "#FFFFFF",

    // Typography
    colorText: "#0F172A",
    colorTextSecondary: "#64748B",
    colorTextTertiary: "#94A3B8",

    // Borders
    colorBorder: "#E2E8F0",
    colorBorderSecondary: "#F1F5F9",

    // Shape
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Typography
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,

    // Layout
    controlHeight: 36,
    controlHeightLG: 42,
    controlHeightSM: 28,

    // Motion
    motionDurationMid: "0.2s",
  },

  components: {
    Button: {
      primaryShadow: "none",
      defaultShadow: "none",
      borderRadius: 8,
      controlHeight: 36,
    },

    Card: {
      borderRadiusLG: 12,
      paddingLG: 24,
      headerFontSize: 16,
    },

    Table: {
      headerBg: "#F8FAFC",
      headerColor: "#475569",
      borderColor: "#E2E8F0",
      rowHoverBg: "#F1F5F9",
      cellPaddingBlock: 14,
      cellPaddingInline: 16,
    },

    Input: {
      activeShadow: "0 0 0 3px rgba(37, 99, 235, 0.10)",
    },

    Select: {
      optionSelectedBg: "#EFF6FF",
    },

    Menu: {
      itemBorderRadius: 8,
      itemSelectedBg: "#EFF6FF",
      itemSelectedColor: "#2563EB",
      itemHoverBg: "#F8FAFC",
    },

    Modal: {
      borderRadiusLG: 14,
    },

    Tag: {
      borderRadiusSM: 6,
    },

    Tabs: {
      inkBarColor: "#2563EB",
      itemSelectedColor: "#2563EB",
      itemHoverColor: "#3B82F6",
    },
  },
};

export default theme;
