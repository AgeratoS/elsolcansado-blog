// components/ScrollCard.tsx
"use client";

import {motion, MotionValue, useTransform} from "framer-motion";
import {match} from "ts-pattern";

interface ScrollCardProps {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
}

const useOpacity = (scrollYProgress: MotionValue<number>, index: number, total: number) => {
    const start = index / total;
    const end = (index + 1) / total;

    const startOpacity = useTransform(
        scrollYProgress,
        [start, end],
        [1, 0]
    )

    const endOpacity = useTransform(
        scrollYProgress,
        [start, end],
        [0, 1]
    )

    const defaultOpacity = useTransform(
        scrollYProgress,
        [start, (start + end) / 2, end],
        [0, 1, 0]
    )

    return match(index)
        .with(0, () => startOpacity)
        .with(total - 1, () => endOpacity)
        .otherwise(() => defaultOpacity);

}

const useRotate = (scrollYProgress: MotionValue<number>, index: number, total: number) => {
    const start = index / total;
    const end = (index + 1) / total;

    const startRotation = useTransform(
        scrollYProgress,
        [start, end],
        [0, 90]
    );

    const endRotation = useTransform(
        scrollYProgress,
        [start, end],
        [0, 0]
    );

    const defaultRotation = useTransform(
        scrollYProgress,
        [start, (start + end) / 2, end],
        [0, 0, 90]
    );

    return match(index)
        .with(0, () => startRotation)
        .with(total - 1, () => endRotation)
        .otherwise(() => defaultRotation);
}


export function ScrollCard({ scrollYProgress, children, index, total }: ScrollCardProps) {
    const currentOpacity = useOpacity(scrollYProgress, index, total);
    const rotation = useRotate(scrollYProgress, index, total);

  return <motion.div
      className="absolute origin-left"
      style={{
      opacity: currentOpacity,
          rotateY: rotation,
  }}>
      {children}
  </motion.div>;
}
