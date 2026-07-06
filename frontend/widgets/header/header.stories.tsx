import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeaderView } from "./header-view";

const meta: Meta<typeof HeaderView> = {
  title: "Widgets/Header",
  component: HeaderView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof HeaderView>;

export const ArticlesActive: Story = {
  name: "Статьи (active)",
  render: () => <HeaderView activePath="/posts" />,
};

export const HomeActive: Story = {
  name: "Главная (active)",
  render: () => <HeaderView activePath="/" />,
};

export const AboutActive: Story = {
  name: "О нас (active)",
  render: () => <HeaderView activePath="/about" />,
};

export const ContactsActive: Story = {
  name: "Контакты (active)",
  render: () => <HeaderView activePath="/contacts" />,
};
