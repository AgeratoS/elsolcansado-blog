import { PostListItemWithFeaturedMedia } from "@/entities/post/model/types";
import * as motion from "framer-motion/client";
import { pipe } from 'fp-ts/function';
import {fromNullable, match} from 'fp-ts/Option';
import { PreviewPost } from "./PreviewPost";

interface HeroPostProps {
  post: PostListItemWithFeaturedMedia;
  nextPost?: PostListItemWithFeaturedMedia | undefined
}

export function HeroPost({ post, nextPost }: HeroPostProps) {
  return (
    <motion.div className="min-h-screen bg-ui-gray-50 relative">
      {/* Content block */}
      <div className="relative z-50 py-6 px-10">
        <header className="flex justify-end mb-20 md:mb-48">
          
        </header>

        <motion.div
          initial={{
            opacity: 0,
            y: -100,
            rotateX: 0,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
        >
          <div className="md:max-w-full">
            <h3 className="text-ui-white text-5xl mb-3 md:mb-6 line-clamp-3 xl:text-7xl">
              {post.title}
            </h3>

            <div className="text-ui-gray-300 mb-8 md:mb-12 xl:text-2xl" dangerouslySetInnerHTML={{ __html: post.excerptHtml }} />

            <a href={`/posts/${post.id}`} className="py-6 px-10 min-w-xs bg-[#00000067] text-ui-gray-300 xl:text-2xl">
              Читать далее
            </a>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: -100,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1,
              duration: 1,
            }}
            className="hidden md:block md:place-items-center lg:place-items-end"
          >
            
            {pipe(fromNullable(nextPost), match(() => null, (post) => <PreviewPost key={post.id} post={post} />))}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative block */}
      <div className="overflow-hidden absolute size-full top-0 z-30">
        {
          pipe(fromNullable(post.featuredMedia), match(() => null, (media) => <img
            className="absolute size-full object-cover z-10"
            src={media.url ?? ""}
            alt="Post image"
          />))
        }
        <div className="absolute size-full bg-[#00000094] z-20" />
      </div>
    </motion.div>
  );
}
