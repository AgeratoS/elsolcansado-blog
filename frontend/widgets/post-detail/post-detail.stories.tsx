import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  mockPostDetail,
  mockPostDetailAuthor,
  mockPostDetailComments,
  mockPostDetailRecentPosts,
  mockPostDetailWithCode,
} from "./model/mock";
import { PostDetailView } from "./post-detail-view";

const meta: Meta<typeof PostDetailView> = {
  title: "Widgets/PostDetail",
  component: PostDetailView,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/posts/ai-and-modern-journalism",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PostDetailView>;

export const Default: Story = {
  name: "Страница записи",
  render: () => (
    <PostDetailView
      post={mockPostDetail}
      author={mockPostDetailAuthor}
      recentPosts={mockPostDetailRecentPosts}
      comments={mockPostDetailComments}
      totalComments={12}
    />
  ),
};

export const CommentsClosed: Story = {
  name: "Комментарии закрыты",
  render: () => (
    <PostDetailView
      post={{ ...mockPostDetail, comment_status: "closed" }}
      author={mockPostDetailAuthor}
      recentPosts={mockPostDetailRecentPosts}
      comments={mockPostDetailComments}
      totalComments={mockPostDetailComments.length}
    />
  ),
};

export const WithoutComments: Story = {
  name: "Без комментариев",
  render: () => (
    <PostDetailView
      post={mockPostDetail}
      author={mockPostDetailAuthor}
      recentPosts={mockPostDetailRecentPosts}
      comments={[]}
      totalComments={0}
    />
  ),
};

export const WithCodeBlocks: Story = {
  name: "С фрагментами кода",
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/posts/functors-and-map-in-typescript",
      },
    },
  },
  render: () => (
    <PostDetailView
      post={mockPostDetailWithCode}
      author={mockPostDetailAuthor}
      recentPosts={mockPostDetailRecentPosts}
      comments={mockPostDetailComments}
      totalComments={12}
    />
  ),
};

export const WithoutViewCount: Story = {
  name: "Без счётчика просмотров",
  render: () => (
    <PostDetailView
      post={{ ...mockPostDetail, meta: {} }}
      author={mockPostDetailAuthor}
      recentPosts={mockPostDetailRecentPosts}
      comments={mockPostDetailComments}
      totalComments={mockPostDetailComments.length}
    />
  ),
};
