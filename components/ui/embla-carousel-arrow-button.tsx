"use client";

import { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const usePrevNextButtons = (api: EmblaCarouselType | undefined) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!api) return;
    api.scrollPrev();
  }, [api]);

  const onNextButtonClick = useCallback(() => {
    if (!api) return;
    api.scrollNext();
  }, [api]);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setPrevBtnDisabled(!api.canScrollPrev());
    setNextBtnDisabled(!api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;

    const updateButtons = () => onSelect(api);

    updateButtons();
    api.on("reInit", updateButtons);
    api.on("select", updateButtons);

    return () => {
      api.off("reInit", updateButtons);
      api.off("select", updateButtons);
    };
  }, [api, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type ArrowButtonProps = {
  enabled: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
};

export const ArrowButton: React.FC<ArrowButtonProps> = ({
  enabled,
  onClick,
  className = "",
  disabled,
  children,
}) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      className={`absolute top-1/2 rounded-full -translate-y-1/2 ${className} ${
        !enabled || disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={!enabled || disabled}
    >
      {children}
    </Button>
  );
};

export const PrevButton: React.FC<
  Omit<ArrowButtonProps, "children" | "className"> & { disabled?: boolean }
> = (props) => (
  <ArrowButton {...props} className="left-4">
    <ChevronLeft className="size-5" />
  </ArrowButton>
);

export const NextButton: React.FC<
  Omit<ArrowButtonProps, "children" | "className"> & { disabled?: boolean }
> = (props) => (
  <ArrowButton {...props} className="right-4">
    <ChevronRight className="size-5" />
  </ArrowButton>
);
