import { PostListItem } from "@/entities/post/model/types";
import * as motion from "framer-motion/client";

interface HeroPostProps {
  post: PostListItem;
}

export function HeroPost({ post }: HeroPostProps) {
  return (
    <motion.div className="min-h-screen bg-ui-gray-50 relative">
      {/* Content block */}
      <div className="relative z-50 py-6 px-10">
        <header className="flex justify-end mb-20 md:mb-48">
          <span className="text-ui-white">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="30" cy="30" r="29" stroke="white" strokeWidth="2" />
              <path
                d="M21.832 38.384C20.472 34.032 19.248 30.344 18.16 27.32H17.944C17.896 28.136 17.8 29.672 17.656 31.928C17.528 34.168 17.464 35.408 17.464 35.648C17.464 36.176 17.72 36.44 18.232 36.44C18.376 36.44 18.528 36.432 18.688 36.416C18.864 36.4 18.984 36.392 19.048 36.392L19.168 36.536L18.928 38.096C18.704 38.08 18.304 38.056 17.728 38.024C17.152 38.008 16.6 38 16.072 38C15.672 38 15.208 38.024 14.68 38.072C14.152 38.136 13.808 38.176 13.648 38.192L13.792 36.584C14.288 36.52 14.64 36.368 14.848 36.128C15.072 35.872 15.208 35.448 15.256 34.856C15.256 34.728 15.28 34.536 15.328 34.28C15.92 28.552 16.216 25.544 16.216 25.256C16.216 24.824 16.096 24.536 15.856 24.392C15.632 24.248 15.152 24.136 14.416 24.056L14.272 23.912L14.488 22.472C14.728 22.488 15.152 22.512 15.76 22.544C16.384 22.576 16.984 22.592 17.56 22.592C18.104 22.592 18.632 22.584 19.144 22.568C19.656 22.536 20 22.512 20.176 22.496C20.784 24.72 21.384 26.792 21.976 28.712C22.568 30.616 22.952 31.832 23.128 32.36H23.344C23.52 31.832 23.92 30.616 24.544 28.712C25.168 26.808 25.808 24.76 26.464 22.568C26.832 22.568 27.128 22.576 27.352 22.592L28.672 22.616L29.44 22.592C29.952 22.576 30.44 22.552 30.904 22.52C31.384 22.488 31.704 22.464 31.864 22.448L31.96 22.544L31.816 24.032C31.128 24.08 30.664 24.192 30.424 24.368C30.184 24.544 30.064 24.856 30.064 25.304C30.064 25.816 30.128 27.072 30.256 29.072C30.384 31.056 30.512 32.776 30.64 34.232C30.72 35.096 30.84 35.68 31 35.984C31.16 36.272 31.424 36.416 31.792 36.416C31.952 36.416 32.096 36.408 32.224 36.392C32.352 36.376 32.44 36.368 32.488 36.368L32.584 36.512L32.368 38.072C32.208 38.056 31.888 38.04 31.408 38.024C30.944 38.008 30.448 38 29.92 38C29.536 38 28.872 38.024 27.928 38.072C27 38.12 26.496 38.16 26.416 38.192L26.584 36.56C27.048 36.512 27.384 36.4 27.592 36.224C27.816 36.032 27.928 35.752 27.928 35.384C27.928 35 27.856 33.752 27.712 31.64C27.584 29.512 27.496 28.072 27.448 27.32H27.232C25.904 31.032 24.68 34.648 23.56 38.168L21.832 38.384ZM38.4837 38.288C37.7317 38.288 37.0437 38.216 36.4197 38.072C35.7957 37.944 35.2757 37.8 34.8597 37.64C34.4437 37.48 34.2357 37.392 34.2357 37.376L34.0437 37.04C34.0597 36.928 34.0917 36.688 34.1397 36.32C34.2037 35.936 34.2677 35.424 34.3317 34.784C34.3957 34.144 34.4277 33.536 34.4277 32.96L36.4437 32.792C36.4437 33.688 36.5237 34.376 36.6837 34.856C36.8437 35.336 37.1077 35.672 37.4757 35.864C37.8597 36.056 38.3957 36.152 39.0837 36.152C39.8357 36.152 40.4357 35.984 40.8837 35.648C41.3477 35.312 41.5797 34.864 41.5797 34.304C41.5797 33.936 41.4517 33.608 41.1957 33.32C40.9397 33.032 40.6277 32.784 40.2597 32.576C39.8917 32.352 39.3557 32.064 38.6517 31.712L38.0277 31.424C36.8437 30.848 35.9157 30.24 35.2437 29.6C34.5717 28.96 34.2357 28.128 34.2357 27.104C34.2357 26.176 34.5077 25.352 35.0517 24.632C35.5957 23.896 36.3557 23.328 37.3317 22.928C38.3077 22.512 39.4197 22.304 40.6677 22.304C41.3717 22.304 42.0277 22.352 42.6357 22.448C43.2437 22.544 43.7237 22.648 44.0757 22.76C44.4437 22.856 44.6757 22.92 44.7717 22.952L44.9397 23.264C44.8917 23.488 44.7957 24.008 44.6517 24.824C44.5237 25.624 44.4277 26.48 44.3637 27.392L42.5397 27.536L42.3237 27.368C42.3237 27.32 42.3237 27.224 42.3237 27.08C42.3397 26.92 42.3477 26.736 42.3477 26.528C42.3477 25.824 42.1717 25.328 41.8197 25.04C41.4677 24.736 40.8757 24.584 40.0437 24.584C39.3717 24.584 38.8197 24.744 38.3877 25.064C37.9557 25.384 37.7397 25.792 37.7397 26.288C37.7397 26.832 37.9957 27.296 38.5077 27.68C39.0197 28.048 39.8117 28.48 40.8837 28.976C41.7797 29.408 42.5157 29.8 43.0917 30.152C43.6677 30.504 44.1557 30.96 44.5557 31.52C44.9557 32.064 45.1557 32.704 45.1557 33.44C45.1557 34.4 44.8757 35.248 44.3157 35.984C43.7717 36.72 42.9957 37.288 41.9877 37.688C40.9797 38.088 39.8117 38.288 38.4837 38.288Z"
                fill="white"
              />
            </svg>
          </span>
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
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
            className="md:place-items-center lg:place-items-end"
          >
            {/* Video Card */}
            <div className="flex flex-col bg-ui-white max-w-md relative md:max-w-xl md:bottom-16">
              {/* Video block */}
              <div className="aspect-video relative">
                <img
                  className="object-cover"
                  src="https://img.freepik.com/free-photo/woman-hand-holding-camera-standing-top-rock-nature-travel-concept_335224-887.jpg"
                  alt="Next trip"
                />

                <div className="absolute inset-0 w-full h-full flex justify-center items-center">
                  <button>
                    <svg
                      width="98"
                      height="98"
                      viewBox="0 0 98 98"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="49"
                        cy="49"
                        r="47"
                        fill="black"
                        fillOpacity="0.2"
                        stroke="white"
                        strokeWidth="4"
                      />
                      <path
                        d="M74 49L36.5 27.3494V70.6506L74 49Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Video card text */}
              <div className="p-6 text-center font-bold text-sm md:text-lg">
                <span>My last trip</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative block */}
      <div className="overflow-hidden absolute size-full top-0 z-30">
        <img
          className="absolute size-full object-cover z-10"
          src="https://img.freepik.com/free-photo/smiley-woman-talking-phone-medium-shot_23-2149476757.jpg"
          alt="Post image"
        />
        <div className="absolute size-full bg-[#00000094] z-20" />
      </div>
    </motion.div>
  );
}
