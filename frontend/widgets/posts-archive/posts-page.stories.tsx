import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo, useState } from "react";

import { createMockPosts } from "@/frontend/entities/post/model/mock";

import { POSTS_PER_PAGE, PostsPageView } from "./posts-page-view";

const meta: Meta<typeof PostsPageView> = {
  title: "Widgets/Posts Archive",
  component: PostsPageView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof PostsPageView>;

const ALL_MOCK_POSTS = createMockPosts(32);

function PaginatedPostsDemo({ totalPosts }: { totalPosts: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const allPosts = useMemo(
    () => createMockPosts(totalPosts),
    [totalPosts],
  );

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const pageStart = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(pageStart, pageStart + POSTS_PER_PAGE);

  return (
    <PostsPageView
      posts={posts}
      currentPage={currentPage}
      total={allPosts.length}
      totalPages={totalPages}
      createPageUrl={(page) => `/posts?page=${page}`}
      onPageChange={setCurrentPage}
    />
  );
}

export const WithPagination: Story = {
  name: "С пагинацией (32 записи)",
  render: () => <PaginatedPostsDemo totalPosts={32} />,
};

export const FirstPage: Story = {
  name: "Первая страница (15 записей)",
  render: () => (
    <PostsPageView
      posts={ALL_MOCK_POSTS.slice(0, POSTS_PER_PAGE)}
      currentPage={1}
      total={ALL_MOCK_POSTS.length}
      totalPages={Math.ceil(ALL_MOCK_POSTS.length / POSTS_PER_PAGE)}
      createPageUrl={(page) => `/posts?page=${page}`}
    />
  ),
};

export const SecondPage: Story = {
  name: "Вторая страница",
  render: () => (
    <PostsPageView
      posts={ALL_MOCK_POSTS.slice(POSTS_PER_PAGE, POSTS_PER_PAGE * 2)}
      currentPage={2}
      total={ALL_MOCK_POSTS.length}
      totalPages={Math.ceil(ALL_MOCK_POSTS.length / POSTS_PER_PAGE)}
      createPageUrl={(page) => `/posts?page=${page}`}
    />
  ),
};

export const Empty: Story = {
  name: "Пустой список",
  render: () => (
    <PostsPageView
      posts={[]}
      currentPage={1}
      total={0}
      totalPages={0}
      createPageUrl={() => "/posts"}
    />
  ),
};
