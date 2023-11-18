import { useEffect, useState } from "react";

export const useProgressiveImg = (
  highQualitySrc: string,
  lowQualitySrc: string,
) => {
  const [src, setSrc] = useState(lowQualitySrc);
  const blur: boolean = src === lowQualitySrc;

  useEffect(() => {
    setSrc(lowQualitySrc);
    const img = new Image();
    img.src = highQualitySrc;
    img.onload = () => {
      setSrc(highQualitySrc);
    };
  }, [lowQualitySrc, highQualitySrc]);

  return { src, blur };
};
