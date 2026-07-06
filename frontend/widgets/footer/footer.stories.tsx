import type { Meta, StoryObj } from "@storybook/nextjs-vite";

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
  render: () => <FooterView categories={mockFooterCategories} />,
};

export const FewCategories: Story = {
  render: () => (
    <FooterView categories={mockFooterCategories.slice(0, 2)} />
  ),
};

export const NoCategories: Story = {
  render: () => <FooterView categories={[]} />,
};
