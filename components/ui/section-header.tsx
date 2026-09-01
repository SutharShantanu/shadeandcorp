"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps
  extends Omit<HTMLMotionProps<"div">, "title"> {
  /**
   * Title text or custom React element
   */
  title: React.ReactNode;
  /**
   * Heading element tag to render (h1, h2, h3, h4, h5, h6).
   * @default "h2"
   */
  titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /**
   * Additional classes for the title element
   */
  titleClassName?: string;
  /**
   * Direct HTML attributes for the title element
   */
  titleProps?: React.HTMLAttributes<HTMLHeadingElement>;

  /**
   * Description/Subtitle text or custom element
   */
  description?: React.ReactNode;
  /**
   * Alias for description
   */
  subtitle?: React.ReactNode;
  /**
   * Additional classes for the description element
   */
  descriptionClassName?: string;
  /**
   * Maximum width utility class for description
   * @default "max-w-2xl"
   */
  maxDescriptionWidth?: string;

  /**
   * Badge content string or custom React element
   */
  badgeText?: React.ReactNode;
  /**
   * Badge icon component or element (e.g. <Sparkles className="size-3.5 text-primary" />)
   */
  badgeIcon?: React.ReactNode;
  /**
   * Badge variant from UI Badge component
   * @default "outline"
   */
  badgeVariant?: React.ComponentPropsWithoutRef<typeof Badge>["variant"];
  /**
   * Custom badge element (completely replaces default Badge)
   */
  badge?: React.ReactNode;
  /**
   * Additional classes for the badge element
   */
  badgeClassName?: string;
  /**
   * Direct props passed to the Badge component
   */
  badgeProps?: React.ComponentPropsWithoutRef<typeof Badge>;

  /**
   * Alignment of header text and elements ("left" | "center" | "right")
   * @default "center"
   */
  align?: "left" | "center" | "right";

  /**
   * Optional action element slot (e.g., "View All" button or category select)
   */
  action?: React.ReactNode;

  /**
   * Disable framer-motion animations
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * Custom children rendered inside the section header container
   */
  children?: React.ReactNode;
}

export const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      title,
      titleAs: TitleTag = "h2",
      titleClassName,
      titleProps,
      description,
      subtitle,
      descriptionClassName,
      maxDescriptionWidth = "max-w-2xl",
      badgeText,
      badgeIcon,
      badgeVariant = "outline",
      badge,
      badgeClassName,
      badgeProps,
      align = "center",
      action,
      disableAnimation = false,
      initial = { opacity: 0, y: 30 },
      whileInView = { opacity: 1, y: 0 },
      transition = { duration: 0.6 },
      viewport = { once: true },
      className,
      children,
      ...restProps
    },
    ref
  ) => {
    const finalDescription = description ?? subtitle;

    // Determine alignment utility classes
    const alignmentClasses = {
      center: "text-center items-center justify-center mx-auto",
      left: "text-left items-start justify-start mr-auto",
      right: "text-right items-end justify-end ml-auto",
    }[align];

    const descriptionAlignClasses = {
      center: "mx-auto",
      left: "mr-auto ml-0",
      right: "ml-auto mr-0",
    }[align];

    const renderBadge = () => {
      if (badge) return badge;
      if (!badgeText && !badgeIcon) return null;

      const { className: badgeCustomClass, ...restBadgeProps } = badgeProps || {};

      return (
        <Badge
          variant={badgeVariant}
          className={cn(
            "text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3",
            badgeClassName,
            badgeCustomClass
          )}
          {...restBadgeProps}
        >
          {badgeIcon}
          {badgeText && (typeof badgeText === "string" ? <span>{badgeText}</span> : badgeText)}
        </Badge>
      );
    };

    const headerContent = (
      <>
        {renderBadge()}

        <div className={cn("w-full", alignmentClasses)}>
          {action ? (
            <div
              className={cn(
                "flex flex-col sm:flex-row items-start justify-between gap-4 w-full",
                align === "center" && "sm:items-center",
                align === "right" && "sm:items-end"
              )}
            >
              <div className="flex-1">
                <TitleTag
                  className={cn(
                    "text-3xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight",
                    titleClassName
                  )}
                  {...titleProps}
                >
                  {title}
                </TitleTag>
                {finalDescription && (
                  <p
                    className={cn(
                      "text-base sm:text-lg text-muted-foreground mt-3 leading-relaxed",
                      maxDescriptionWidth,
                      descriptionAlignClasses,
                      descriptionClassName
                    )}
                  >
                    {finalDescription}
                  </p>
                )}
              </div>
              <div className="shrink-0">{action}</div>
            </div>
          ) : (
            <>
              <TitleTag
                className={cn(
                  "text-3xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight",
                  titleClassName
                )}
                {...titleProps}
              >
                {title}
              </TitleTag>

              {finalDescription && (
                <p
                  className={cn(
                    "text-base sm:text-lg text-muted-foreground mt-3 leading-relaxed",
                    maxDescriptionWidth,
                    descriptionAlignClasses,
                    descriptionClassName
                  )}
                >
                  {finalDescription}
                </p>
              )}
            </>
          )}
        </div>

        {children}
      </>
    );

    const containerClasses = cn(
      "flex flex-col mb-10 w-full",
      alignmentClasses,
      className
    );

    if (disableAnimation) {
      return (
        <div
          ref={ref}
          className={containerClasses}
          {...(restProps as React.HTMLAttributes<HTMLDivElement>)}
        >
          {headerContent}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        initial={initial}
        whileInView={whileInView}
        transition={transition}
        viewport={viewport}
        {...restProps}
      >
        {headerContent}
      </motion.div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
