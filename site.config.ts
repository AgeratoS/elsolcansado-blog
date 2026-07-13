type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  founded_year: number;
};

const defaultSiteDomain = "https://next-wp.com";

function getSiteDomain(): string {
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? defaultSiteDomain;
  return domain.replace(/\/$/, "");
}

export const siteConfig: SiteConfig = {
  site_name: "Elsolcansado Blog: Сайт одного разработчика",
  site_description: "Сайт одного разработчика",
  site_domain: getSiteDomain(),
  founded_year: 2025,
};
