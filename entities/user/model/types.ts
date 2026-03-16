export interface WpUser {
  id: number;
  username: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  url?: string;
  description?: string;
  link: string;
  locale?: string;
  nickname?: string;
  slug: string;
  registered_date?: string;
  roles?: string[];
  avatar_urls?: Record<string, string>;
  meta?: Record<string, unknown>;
}

export interface User {
  id: number;
  slug: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  url?: string;
  descriptionHtml?: string;
  profileUrl: string;
  avatarUrl?: string;
  roles: string[];
}

export interface GetUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
  include?: number[];
  exclude?: number[];
  slug?: string | string[];
}

export const mapWpUserToUser = (raw: WpUser): User => {
  const avatarUrl =
    raw.avatar_urls && Object.keys(raw.avatar_urls).length > 0
      ? raw.avatar_urls["96"] || Object.values(raw.avatar_urls)[0]
      : undefined;

  return {
    id: raw.id,
    slug: raw.slug,
    displayName: raw.name || raw.username,
    firstName: raw.first_name,
    lastName: raw.last_name,
    url: raw.url,
    descriptionHtml: raw.description,
    profileUrl: raw.link,
    avatarUrl,
    roles: raw.roles ?? [],
  };
};

