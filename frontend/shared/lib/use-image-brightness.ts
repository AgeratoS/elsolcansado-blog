"use client";

import { FastAverageColor } from "fast-average-color";
import { useCallback, useEffect, useRef, useState } from "react";

const SAMPLE_HEIGHT_RATIO = 0.35;

export function useImageBrightness() {
  const facRef = useRef<FastAverageColor | null>(null);
  const [isLightImage, setIsLightImage] = useState(false);

  useEffect(() => {
    return () => {
      facRef.current?.destroy();
      facRef.current = null;
    };
  }, []);

  const handleImageLoad = useCallback(
    async (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;

      if (!img.naturalWidth || !img.naturalHeight) {
        return;
      }

      if (!facRef.current) {
        facRef.current = new FastAverageColor();
      }

      const sampleHeight = Math.round(
        img.naturalHeight * SAMPLE_HEIGHT_RATIO,
      );

      try {
        const result = await facRef.current.getColorAsync(img, {
          left: 0,
          top: img.naturalHeight - sampleHeight,
          width: img.naturalWidth,
          height: sampleHeight,
        });

        if (result.error) {
          return;
        }

        setIsLightImage(result.isLight);
      } catch {
        // CORS or canvas security errors — keep overlay for readability
      }
    },
    [],
  );

  return { isLightImage, handleImageLoad };
}
