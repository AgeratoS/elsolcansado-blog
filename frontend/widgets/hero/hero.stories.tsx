import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeroSection } from "./hero-section";

const meta: Meta<typeof HeroSection> = {
    title: "Widgets/Hero",
    component: HeroSection,
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
    name: "По умолчанию",
    args: {
        postCount: 148,
    },
};

export const FewPosts: Story = {
    name: "Мало статей",
    args: {
        postCount: 12,
    },
};

export const SinglePost: Story = {
    name: "Одна статья",
    args: {
        postCount: 1,
    },
};

export const CustomStats: Story = {
    name: "Кастомная статистика",
    args: {
        postCount: 148,
        stats: [
            { value: "148", label: "Статей" },
            { value: "12K", label: "Читателей" },
            { value: "4+", label: "Года" },
        ],
    },
};
