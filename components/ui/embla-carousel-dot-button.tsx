"use client";

import { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";

export const useDotButton = (api: EmblaCarouselType | undefined) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  const onInit = useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    const onInitAndSelect = () => {
      onInit(api);
      onSelect(api);
    };

    onInitAndSelect();
    api.on("reInit", onInitAndSelect);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", onInitAndSelect);
      api.off("select", onSelect);
    };
  }, [api, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

type DotButtonProps = {
  selected: boolean;
  onClick: () => void;
  className?: string;
};

export const DotButton: React.FC<DotButtonProps> = (props) => {
  const { onClick, ...restProps } = props;
  return <button type="button" {...restProps} onClick={onClick} />;
};
