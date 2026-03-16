// components/ScrollCard.tsx
"use client";

import {motion, MotionValue, useTransform} from "framer-motion";

interface ScrollCardProps {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
}

const useCardTransforms = (
    scrollYProgress: MotionValue<number>,
    index: number,
    total: number,
) => {
    // Приводим глобальный прогресс к локальной "позиции" карточки:
    //  - когда position = 0 — карточка в центре и полностью видима
    //  - когда position = -1 или 1 — карточка на границе перехода (почти невидима)
    const factor = Math.max(total - 1, 1);

    const position = useTransform(scrollYProgress, (v) => v * factor - index);

    const opacity = useTransform(position, [-1, 0, 1], [0, 1, 0]);
    const rotateY = useTransform(position, [-1, 0, 1], [0, 0, -50]);

    const scale = useTransform(position, [-1, 0, 1], [1, 1, 0]);

    return { opacity, rotateY, scale };
};


export function ScrollCard({ scrollYProgress, children, index, total }: ScrollCardProps) {
    const { opacity, rotateY, scale } = useCardTransforms(scrollYProgress, index, total);
    const zIndex = total - index;

  return <motion.div
      className="absolute inset-0 origin-left"
      style={{
      opacity,
          zIndex,
          skewX: rotateY,
          scale
  }}>
      {children}
  </motion.div>;
}
