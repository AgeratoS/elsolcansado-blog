type PostContentProps = {
  html: string;
  className?: string;
};

export function PostContent({ html, className }: PostContentProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
