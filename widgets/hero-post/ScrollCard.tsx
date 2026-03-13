// components/ScrollCard.tsx
"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface ScrollCardProps {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
}

export function ScrollCard({ scrollYProgress, children }: ScrollCardProps) {
  return <motion.div>{children}</motion.div>;
}
