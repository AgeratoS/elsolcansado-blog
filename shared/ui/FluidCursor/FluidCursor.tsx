"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
const INITIAL_SIZE = 12;
const elementPadding = 4;

export function FluidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  // 🎯 Motion values с ЯВНЫМИ начальными значениями
  const x = useMotionValue(-100); // Начинаем за пределами экрана
  const y = useMotionValue(-100);
  const width = useMotionValue(INITIAL_SIZE);
  const height = useMotionValue(INITIAL_SIZE);
  const borderRadius = useMotionValue("50%");
  const isHovering = useMotionValue(0); // 0 = нет, 1 = да

  const [hasPrecisePointer, setHasPrecisePointer] = useState(false);

  // 🌀 Пружинная физика
  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");

    const updatePointerType = () => {
      if (window.matchMedia("(pointer: fine)").matches) {
        setHasPrecisePointer(true);
      } else {
        setHasPrecisePointer(false);
      }
    }

    updatePointerType();

    mediaQuery.addEventListener("change", updatePointerType);
    return () => mediaQuery.removeEventListener("change", updatePointerType);
  }, []);
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  const widthSpring = useSpring(width, springConfig);
  const heightSpring = useSpring(height, springConfig);
  const radiusSpring = useSpring(borderRadius, { damping: 15, stiffness: 100 });
  const isHoveringSpring = useSpring(isHovering, {
    damping: 10,
    stiffness: 100,
  });

  // 🎨 Производные стили — теперь с явными значениями
  const backgroundColor = useTransform(
    isHoveringSpring,
    [0, 1],
    ["white", "rgba(255, 255, 255, 0.85)"],
  );

  const borderColor = useTransform(
    isHoveringSpring,
    [0, 1],
    ["white", "transparent"],
  );

  const borderWidth = useTransform(isHoveringSpring, [0, 1], [2, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest<HTMLElement>(
        "a, button, .interactive, [data-cursor-expand]",
      );
      const copyable = target.closest<HTMLElement>(
        "h1, h2, h3, h4, h5, h6, p, span",
      );

      if (interactive) {
        // 🎯 Режим "заполнения элемента"
        const rect = interactive.getBoundingClientRect();

        width.set(rect.width + 2 * elementPadding);
        height.set(rect.height + 2 * elementPadding);
        x.set(rect.left - elementPadding);
        y.set(rect.top - elementPadding);
        borderRadius.set(interactive.style.borderRadius || "0px");
        isHovering.set(1);
      } else if (copyable) {
        const elHeight = getComputedStyle(copyable);

        width.set(2);
        height.set(parseInt(elHeight.lineHeight));
        x.set(e.clientX - width.get() / 2);
        y.set(e.clientY - height.get() / 2);
      } else {
        // 🎯 Обычный режим: следование за мышью
        width.set(INITIAL_SIZE);
        height.set(INITIAL_SIZE);
        x.set(e.clientX - width.get() / 2);
        y.set(e.clientY - height.get() / 2);
        borderRadius.set("50%");
        isHovering.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!hasPrecisePointer) {
    return null;
  }

  return (
    <motion.div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        x: xSpring,
        y: ySpring,
        width: widthSpring,
        height: heightSpring,
        borderRadius: radiusSpring,
        backgroundColor,
        border: `${borderWidth}px solid ${borderColor}`,
        mixBlendMode: "difference",
      }}
    />
  );
}
