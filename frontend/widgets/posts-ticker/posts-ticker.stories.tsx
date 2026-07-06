import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { createMockPosts, mockPosts } from "@/frontend/entities/post/model/mock";

import { MAX_TICKER_POSTS, PostsTicker } from "./posts-ticker";

const meta: Meta<typeof PostsTicker> = {
    title: "Widgets/Posts Ticker",
    component: PostsTicker,
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;

type Story = StoryObj<typeof PostsTicker>;

export const Default: Story = {
    name: "По умолчанию (5 записей)",
    args: {
        posts: mockPosts,
    },
};

export const SinglePost: Story = {
    name: "Одна запись",
    args: {
        posts: [mockPosts[0]],
    },
};

export const WithStickyPost: Story = {
    name: "С закреплённой записью",
    args: {
        posts: [
            mockPosts[0],
            { ...mockPosts[1], sticky: true },
            mockPosts[2],
            mockPosts[3],
        ],
    },
};

export const MaxLimit: Story = {
    name: `Лимит ${MAX_TICKER_POSTS} записей`,
    args: {
        posts: createMockPosts(20),
    },
};

export const Empty: Story = {
    name: "Пустой список",
    args: {
        posts: [],
    },
};
