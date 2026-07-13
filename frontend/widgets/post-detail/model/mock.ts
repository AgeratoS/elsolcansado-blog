import { mockPosts } from "@/frontend/entities/post/model/mock";
import type { Author, Comment, Post } from "@/lib/wordpress.d";

const AVATAR_URL =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop";

const FEATURED_IMAGE =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop";

export const mockPostDetailAuthor: Author = {
  id: 1,
  name: "Анна Соколова",
  slug: "anna-sokolova",
  description:
    "Главный редактор. Пишу о технологиях, медиа и о том, как искусственный интеллект меняет современную журналистику.",
  url: "",
  link: "",
  avatar_urls: { "96": AVATAR_URL },
  meta: {},
};

export const mockPostDetail: Post = {
  id: 100,
  date: "2023-07-12T10:00:00",
  date_gmt: "2023-07-12T07:00:00",
  modified: "2023-07-12T10:00:00",
  modified_gmt: "2023-07-12T07:00:00",
  slug: "ai-and-modern-journalism",
  status: "publish",
  link: "https://example.com/posts/ai-and-modern-journalism",
  guid: { rendered: "https://example.com/posts/ai-and-modern-journalism" },
  title: {
    rendered:
      "Как искусственный интеллект меняет современную журналистику и медиаиндустрию",
  },
  content: {
    rendered: `
      <p>Искусственный интеллект перестал быть экспериментом в лабораториях и стал частью ежедневной работы редакций. От автоматической расшифровки интервью до генерации черновиков — технологии меняют не только скорость, но и саму природу журналистики.</p>
      <p>Главный вопрос сегодня не в том, заменит ли ИИ журналистов, а в том, как профессионалы будут использовать его, сохраняя редакционные стандарты и доверие аудитории.</p>
      <blockquote><p>«ИИ — это не замена журналиста, а усилитель его возможностей. Тот, кто научится с ним работать, получит несправедливое преимущество.»</p><cite>— Джон Мишель, главный редактор The Atlantic</cite></blockquote>
      <h2>Три ключевых направления трансформации</h2>
      <p>Первое — автоматизация рутины: транскрипция, перевод, базовая фактчекинг-проверка. Второе — персонализация контента для разных сегментов аудитории. Третье — аналитика данных для выявления трендов и скрытых историй.</p>
      <p>При всём этом редакционный контроль остаётся критически важным. Алгоритм может ошибаться, галлюцинировать факты и воспроизводить предвзятость обучающих данных.</p>
      <h2>Пример кода</h2>
      <p>Ниже — фрагмент TypeScript, который иллюстрирует простую обработку текста статьи:</p>
      <pre class="wp-block-code"><code lang="typescript" class="language-typescript">type ArticleDraft = {
  title: string;
  body: string;
};

export function summarizeDraft(draft: ArticleDraft): string {
  const intro = draft.body.trim().slice(0, 140);
  return intro.length &lt; draft.body.length ? \`\${intro}...\` : intro;
}</code></pre>
    `,
    protected: false,
  },
  excerpt: {
    rendered:
      "<p>Искусственный интеллект меняет современную журналистику и медиаиндустрию.</p>",
    protected: false,
  },
  author: 1,
  featured_media: 1000,
  comment_status: "open",
  ping_status: "open",
  sticky: false,
  template: "",
  format: "standard",
  categories: [3],
  tags: [10, 11, 12, 13],
  meta: { post_views_count: 6400 },
  _embedded: {
    author: [
      {
        id: 1,
        name: mockPostDetailAuthor.name,
        slug: mockPostDetailAuthor.slug,
        avatar_urls: mockPostDetailAuthor.avatar_urls,
      },
    ],
    "wp:featuredmedia": [
      {
        id: 1000,
        date: "2023-07-12T10:00:00",
        date_gmt: "2023-07-12T07:00:00",
        modified: "2023-07-12T10:00:00",
        modified_gmt: "2023-07-12T07:00:00",
        slug: "ai-journalism",
        status: "publish",
        link: FEATURED_IMAGE,
        guid: { rendered: FEATURED_IMAGE },
        title: { rendered: "AI and journalism" },
        author: 1,
        caption: { rendered: "" },
        alt_text: "Abstract visualization of artificial intelligence",
        media_type: "image",
        mime_type: "image/jpeg",
        source_url: FEATURED_IMAGE,
        media_details: {
          width: 1200,
          height: 800,
          file: "ai-journalism.jpg",
          sizes: {},
        },
      },
    ],
    "wp:term": [
      [{ id: 3, name: "Технологии", slug: "technologies" }],
      [
        { id: 10, name: "ИИ", slug: "ai" },
        { id: 11, name: "Медиа", slug: "media" },
        { id: 12, name: "Технологии", slug: "tech" },
        { id: 13, name: "Будущее", slug: "future" },
      ],
    ],
  },
};

export const mockPostDetailWithCode: Post = {
  ...mockPostDetail,
  id: 101,
  slug: "functors-and-map-in-typescript",
  title: {
    rendered: "Функторы и метод map в TypeScript",
  },
  content: {
    rendered: `
      <p>Метод <code>map</code> — один из базовых инструментов функционального программирования. Он позволяет преобразовать каждый элемент коллекции, не мутируя исходные данные.</p>
      <p>Например:</p>
      <pre class="wp-block-code"><code lang="typescript" class="language-typescript">const array: string[] = ["1", "2", "3", "4", "5", "6"]; // имеем массив строк - нехорошо, вдруг захотим найти сумму

const numbers = array.map((item) =&gt; parseInt(item)); // [1, 2, 3, 4, 5, 6] - теперь это массив чисел

const sum = numbers.reduce((acc, item) =&gt; acc + item, 0); // 21 - сумма всех элементов</code></pre>
      <p>Здесь <code>map</code> выступает как функтор: он принимает функцию преобразования и возвращает новую структуру того же «типа» — массив той же длины, но с другими значениями.</p>
      <p>Тот же приём можно применить к объектам через композицию:</p>
      <pre class="wp-block-code"><code lang="typescript" class="language-typescript">type User = { id: number; name: string };

const users: User[] = [
  { id: 1, name: "Анна" },
  { id: 2, name: "Борис" },
];

const names = users.map((user) =&gt; user.name);
// ["Анна", "Борис"]</code></pre>
      <p>Для сравнения — эквивалент на Python:</p>
      <pre class="wp-block-code"><code lang="python" class="language-python">numbers = [int(x) for x in ["1", "2", "3", "4", "5", "6"]]
total = sum(numbers)  # 21</code></pre>
      <p>А вот bash-скрипт для быстрой проверки суммы из stdin:</p>
      <pre class="wp-block-code"><code lang="bash" class="language-bash">#!/bin/bash
paste -sd+ | bc</code></pre>
      <p>Главное — различать <code>map</code> как преобразование и <code>reduce</code> как свёртку к одному значению.</p>
    `,
    protected: false,
  },
  excerpt: {
    rendered:
      "<p>Разбираем map, reduce и функторы на примерах TypeScript.</p>",
    protected: false,
  },
  tags: [10, 12],
};

export const mockPostDetailRecentPosts = mockPosts
  .filter((post) => post.id !== mockPostDetail.id)
  .slice(0, 4);

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export const mockPostDetailComments: Comment[] = [
  {
    id: 1,
    post: mockPostDetail.id,
    parent: 0,
    author: 0,
    author_name: "Михаил Петров",
    author_url: "",
    date: hoursAgo(2),
    date_gmt: hoursAgo(2),
    content: {
      rendered:
        "<p>Отличная статья! Особенно интересен раздел про автоматизацию рутинных задач. Мы в нашей редакции уже используем ИИ для транскрипции интервью.</p>",
      protected: false,
    },
    status: "approved",
    type: "comment",
    author_avatar_urls: { "96": AVATAR_URL },
  },
  {
    id: 2,
    post: mockPostDetail.id,
    parent: 0,
    author: 0,
    author_name: "Елена Козлова",
    author_url: "",
    date: hoursAgo(5),
    date_gmt: hoursAgo(5),
    content: {
      rendered:
        "<p>Согласна с тезисом о том, что ИИ — усилитель, а не замена. Главное — не потерять критическое мышление при работе с алгоритмами.</p>",
      protected: false,
    },
    status: "approved",
    type: "comment",
    author_avatar_urls: { "96": AVATAR_URL },
  },
  {
    id: 3,
    post: mockPostDetail.id,
    parent: 1,
    author: 0,
    author_name: "Анна Соколова",
    author_url: "",
    date: hoursAgo(1),
    date_gmt: hoursAgo(1),
    content: {
      rendered:
        "<p>Михаил, а какой сервис для транскрипции вы используете? Буду благодарна за рекомендацию.</p>",
      protected: false,
    },
    status: "approved",
    type: "comment",
    author_avatar_urls: { "96": AVATAR_URL },
  },
];
