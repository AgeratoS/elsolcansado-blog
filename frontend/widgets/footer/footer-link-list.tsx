import Link from "next/link";

type FooterLinkItem = {
  id: string | number;
  label: string;
  href: string;
};

type FooterLinkListProps = {
  title: string;
  items: FooterLinkItem[];
};

export function FooterLinkList({ title, items }: FooterLinkListProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
