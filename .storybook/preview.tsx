import type { Preview } from "@storybook/nextjs-vite";

import "@/app/globals.css";
import React from "react";

import { StorybookThemeDecorator } from "./theme-decorator";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Цветовая тема компонентов",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Светлая", icon: "sun" },
          { value: "dark", title: "Тёмная", icon: "moon" },
          { value: "system", title: "Системная", icon: "browser" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, { globals }) => (
      <StorybookThemeDecorator
        theme={(globals.theme as "light" | "dark" | "system") ?? "system"}
      >
        <Story />
      </StorybookThemeDecorator>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
