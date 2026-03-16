import { PostListItemWithFeaturedMedia } from "@/entities/post";

interface PreviewPostProps {
  post: PostListItemWithFeaturedMedia;
}

export function PreviewPost({ post }: PreviewPostProps) {
  const media = post.featuredMedia;

  return (
    <div className="flex flex-col bg-ui-white max-w-xl relative">
      {/* Video block */}
      <div className="relative min-w-full">
        {media && <img
          className="object-cover aspect-video"
          src={media?.url ?? ""}
          alt={media?.alt || "Next post"}
        />
        }
      </div>
      {/* Video card text */}
      <div className="flex">
        <div className="flex flex-col p-6 flex-1">
          <span className="text-sm md:text-lg">Далее</span>
          <span className="font-bold text-sm md:text-lg">{post!.title}</span>
        </div>
        <button className="bg-ui-black aspect-square flex px-6 items-center justify-center">
          <svg className="block" width="51" height="37" viewBox="0 0 51 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M49.7678 20.1777C50.7441 19.2014 50.7441 17.6184 49.7678 16.6421L33.8579 0.732227C32.8816 -0.244083 31.2986 -0.244083 30.3223 0.732227C29.346 1.70854 29.346 3.29145 30.3223 4.26776L44.4645 18.4099L30.3223 32.552C29.346 33.5283 29.346 35.1113 30.3223 36.0876C31.2986 37.0639 32.8816 37.0639 33.8579 36.0876L49.7678 20.1777ZM0 18.4099V20.9099H48V18.4099V15.9099H0V18.4099Z" fill="white" />
          </svg>
        </button>
      </div>

    </div>
  );
}