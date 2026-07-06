import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { mockNavItems } from "@/frontend/shared/config/menu";

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
  render: () => (
    <HeaderView navItems={mockNavItems} activePath="/posts" />
  ),
};

export const HomeActive: Story = {
  name: "Главная (active)",
  render: () => <HeaderView navItems={mockNavItems} activePath="/" />,
};

export const AboutActive: Story = {
  name: "О нас (active)",
  render: () => (
    <HeaderView navItems={mockNavItems} activePath="/about-me" />
  ),
};

export const ContactsActive: Story = {
  name: "Контакты (active)",
  render: () => (
    <HeaderView
      navItems={[
        ...mockNavItems,
        { id: "43", label: "Контакты", href: "/contacts" },
      ]}
      activePath="/contacts"
    />
  ),
};
