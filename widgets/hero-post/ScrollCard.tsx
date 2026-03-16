// components/ScrollCard.tsx
"use client";

import {motion, MotionValue, useTransform} from "framer-motion";

interface ScrollCardProps {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
}

const useCardTransforms = (scrollYProgress: MotionValue<number>, index: number, total: number) => {
    const safeTotal = Math.max(total, 1);
    const segment = 1 / safeTotal;

    const start = segment * index;
    const middle = start + segment / 2;
    const end = start + segment;

    let inputRange: number[];
    let opacityRange: number[];

    if (index === 0) {
        // Первая карточка сразу видна и уходит после своего сегмента.
        inputRange = [0, middle, end];
        opacityRange = [1, 1, 0];
    } else if (index === total - 1) {
        // Последняя карточка появляется в своём сегменте и остаётся видимой до конца.
        inputRange = [start, middle, 1];
        opacityRange = [0, 1, 1];
    } else {
        // Промежуточные карточки: появляются и исчезают в пределах своего сегмента.
        inputRange = [start, middle, end];
        opacityRange = [0, 1, 0];
    }

    const opacity = useTransform(scrollYProgress, inputRange, opacityRange);
    // Привязываем поворот к той же кривой, что и прозрачность:
    // когда карточка полностью видима — она развернута к нам,
    // когда исчезает — разворачивается на 90°.
    const rotateY = useTransform(opacity, [0, 1], [90, 0]);

    return { opacity, rotateY };
};


export function ScrollCard({ scrollYProgress, children, index, total }: ScrollCardProps) {
    const { opacity, rotateY } = useCardTransforms(scrollYProgress, index, total);
    const zIndex = total - index;

  return <motion.div
      className="absolute inset-0"
      style={{
      opacity,
          rotateY,
          zIndex,
  }}>
      {children}
  </motion.div>;
}
