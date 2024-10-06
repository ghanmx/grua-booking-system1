import { useState, useEffect } from 'react';

export const useOptimizedImage = (src, options = {}) => {
  const [optimizedSrc, setOptimizedSrc] = useState(src);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const { width = img.width, height = img.height, quality = 0.8 } = options;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const optimized = canvas.toDataURL('image/jpeg', quality);
      setOptimizedSrc(optimized);
    };
  }, [src, options]);

  return optimizedSrc;
};