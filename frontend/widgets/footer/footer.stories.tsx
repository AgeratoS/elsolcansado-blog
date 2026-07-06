import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { mockNavItems } from "@/frontend/shared/config/menu";

import { FooterView } from "./footer-view";
import { mockFooterCategories } from "./model/mock";

const meta: Meta<typeof FooterView> = {
  title: "Widgets/Footer",
  component: FooterView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof FooterView>;

export const Default: Story = {
  render: () => (
    <FooterView navItems={mockNavItems} categories={mockFooterCategories} />
  ),
};

export const FewCategories: Story = {
  render: () => (
    <FooterView
      navItems={mockNavItems}
      categories={mockFooterCategories.slice(0, 2)}
    />
  ),
};

export const NoCategories: Story = {
  render: () => <FooterView navItems={mockNavItems} categories={[]} />,
};
