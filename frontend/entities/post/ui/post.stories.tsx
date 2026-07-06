import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardPost } from "./card";
import { mockPosts } from "../model/mock";

const meta: Meta<typeof CardPost> = {
  title: "Entities/Post",
  component: CardPost,
  parameters: {
    layout: "centered",
  },
};

export const CardPostStory: StoryObj<typeof CardPost> = {
  name: "Card (Dark Photo)",
  render: () => <CardPost post={mockPosts[1]} />,
};

export const CardPostStoryLight: StoryObj<typeof CardPost> = {
  name: "Card (Light Photo)",
  render: () => <CardPost post={mockPosts[4]} />,
};

export const CardPostStoryHero: StoryObj<typeof CardPost> = {
  name: "Card (Hero)",
  render: () => <CardPost post={mockPosts[0]} size="hero" />,
};

export default meta;