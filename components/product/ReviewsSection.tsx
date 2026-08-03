"use client";

import React, { useState, useMemo } from "react";
import {
  Star,
  Clock,
  ThumbsUp,
  X,
  ChevronRight,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Arjun Sharma",
    rating: 5,
    text: "Absolutely love this product! Build quality is top-notch and fits perfectly. Delivery was quick too.",
    date: "Jan 28, 2025",
    helpful: 24,
    verified: true,
    reply: {
      name: "Shade & Co Support",
      text: "Hi Arjun, so glad to hear you're loving the build quality! Enjoy and let us know if you need anything else.",
      date: "Jan 29, 2025",
    },
  },
  {
    id: 2,
    name: "Priya Mehta",
    rating: 4,
    text: "Great value for money. Looks exactly as shown. The only minor thing is sizing runs a little large.",
    date: "Feb 3, 2025",
    helpful: 11,
    verified: true,
  },
  {
    id: 3,
    name: "Rahul Gupta",
    rating: 3,
    text: "Decent product but the color is slightly different from the photos. Still happy with the purchase overall.",
    date: "Jan 15, 2025",
    helpful: 5,
    verified: false,
    reply: {
      name: "Shade & Co Support",
      text: "Hi Rahul, we appreciate your honesty. Lighting in product photography can sometimes alter the perceived shade. Feel free to contact support to initiate a return if you aren't completely satisfied!",
      date: "Jan 16, 2025",
    },
  },
  {
    id: 4,
    name: "Sara Patel",
    rating: 5,
    text: "Exceeded expectations! The material is premium and comfortable. Will definitely buy more from this brand.",
    date: "Feb 18, 2025",
    helpful: 38,
    verified: true,
  },
];

export function StarRating({
  rating,
  size = 4,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-${size} h-${size} ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  const [helpfulVotes, setHelpfulVotes] = useState<Set<number>>(new Set());
  const [sort, setSort] = useState("Highest Rating");
  const [starFilter, setStarFilter] = useState<Set<number>>(new Set());
  const [showAllDialog, setShowAllDialog] = useState(false);

  const distribution = [
    { stars: 5, count: 5168, pct: 60 },
    { stars: 4, count: 4726, pct: 45 },
    { stars: 3, count: 3234, pct: 25 },
    { stars: 2, count: 1842, pct: 10 },
    { stars: 1, count: 452, pct: 2 },
  ];

  const filteredReviews = useMemo(() => {
    let list = [...MOCK_REVIEWS];
    if (starFilter.size > 0)
      list = list.filter((r) => starFilter.has(r.rating));
    switch (sort) {
      case "Highest Rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "Recent":
        return list.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
      case "Most Helpful":
        return list.sort((a, b) => {
          const aH = a.helpful + (helpfulVotes.has(a.id) ? 1 : 0);
          const bH = b.helpful + (helpfulVotes.has(b.id) ? 1 : 0);
          return bH - aH;
        });
      default:
        return list;
    }
  }, [sort, starFilter, helpfulVotes]);

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Ratings & Reviews</h2>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40 h-8 text-xs border-border">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Highest Rating">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Highest Rating</span>
              </div>
            </SelectItem>
            <SelectItem value="Recent">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-blue-500" />
                <span>Most Recent</span>
              </div>
            </SelectItem>
            <SelectItem value="Most Helpful">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-3 h-3 text-emerald-500" />
                <span>Most Helpful</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Overview + Filter row ── */}
      <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
        {/* Summary score */}
        <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-1 sm:min-w-[120px]">
          <p className="text-5xl font-extrabold leading-none">{rating}</p>
          <div>
            <StarRating rating={rating} size={4} />
            <p className="text-xs text-muted-foreground mt-1">
              {reviewCount.toLocaleString()} ratings
            </p>
          </div>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 flex flex-col gap-1.5">
          {distribution.map(({ stars, count, pct }) => {
            const isActive = starFilter.has(stars);
            return (
              <Button
                key={stars}
                variant={isActive ? "secondary" : "ghost"}
                onClick={() =>
                  setStarFilter((prev) => {
                    const next = new Set(prev);
                    isActive ? next.delete(stars) : next.add(stars);
                    return next;
                  })
                }
                className="group w-full flex items-center gap-3 justify-start"
              >
                <span className="text-xs font-medium w-3 text-muted-foreground">
                  {stars}
                </span>
                <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
                <Progress
                  value={pct}
                  className={`flex-1 h-1.5 transition-all ${isActive ? "[&>div]:bg-amber-400" : "[&>div]:bg-muted-foreground/30 group-hover:[&>div]:bg-muted-foreground/50"}`}
                />
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {count.toLocaleString()}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* ── Active star filter pills ── */}
      <AnimatePresence>
        {starFilter.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            {Array.from(starFilter)
              .sort((a, b) => b - a)
              .map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="cursor-pointer gap-1 px-2 py-1 text-xs rounded-full hover:bg-secondary/80 transition-colors"
                  onClick={() =>
                    setStarFilter((prev) => {
                      const next = new Set(prev);
                      next.delete(s);
                      return next;
                    })
                  }
                >
                  {s} Star
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            <Button
              variant="secondary"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => setStarFilter(new Set())}
            >
              Clear
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4">
        <Separator className="flex-1" />
        {filteredReviews.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground shrink-0 h-8 gap-1 hover:text-primary transition-colors"
            onClick={() => setShowAllDialog(true)}
          >
            View all {filteredReviews.length} reviews
            <ChevronRight className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* ── Review cards ── */}
      {filteredReviews.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          No reviews for this rating yet.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {filteredReviews.slice(0, 3).map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              helpfulVotes={helpfulVotes}
              onToggleHelpful={(id) =>
                setHelpfulVotes((prev) => {
                  const s = new Set(prev);
                  s.has(id) ? s.delete(id) : s.add(id);
                  return s;
                })
              }
            />
          ))}
        </div>
      )}

      {/* ── All Reviews Dialog ── */}
      <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
        <DialogContent className="max-w-2xl w-[95vw] h-[85vh] p-0 gap-0 overflow-hidden flex flex-col sm:rounded-2xl">
          <DialogHeader className="px-6 py-4 border-b border-border shrink-0 flex-row items-center gap-3 space-y-0">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setShowAllDialog(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <DialogTitle className="text-base font-bold">
                All Reviews ({filteredReviews.length})
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Showing reviews based on current filters
              </p>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin">
            <div className="flex flex-col divide-y divide-border">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  helpfulVotes={helpfulVotes}
                  onToggleHelpful={(id) =>
                    setHelpfulVotes((prev) => {
                      const s = new Set(prev);
                      s.has(id) ? s.delete(id) : s.add(id);
                      return s;
                    })
                  }
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ReviewCard({
  review,
  helpfulVotes,
  onToggleHelpful,
}: {
  review: (typeof MOCK_REVIEWS)[number];
  helpfulVotes: Set<number>;
  onToggleHelpful: (id: number) => void;
}) {
  const isHelpful = helpfulVotes.has(review.id);

  return (
    <div className="py-6 first:pt-0 last:pb-0">
      {/* reviewer header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="text-sm font-bold text-primary bg-primary/10">
              {review.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-tight">{review.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {review.verified && (
                <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <BadgeCheck className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
              <span
                className="text-xs text-muted-foreground"
                title={format(new Date(review.date), "PPP")}
              >
                {formatDistanceToNow(new Date(review.date), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} size={3} />
      </div>

      {/* review text */}
      <p className="text-sm text-foreground/80 leading-relaxed">
        {review.text}
      </p>

      {/* helpful button */}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-muted-foreground">Was this helpful?</span>
        <Button
          size="sm"
          variant={isHelpful ? "outline" : "ghost"}
          className={`h-auto px-2.5 py-1 rounded-full text-xs gap-1.5 ${
            isHelpful
              ? "border-primary/30 text-primary bg-primary/5"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => onToggleHelpful(review.id)}
        >
          <ThumbsUp className={`w-3 h-3 ${isHelpful ? "fill-primary" : ""}`} />
          Yes ({review.helpful + (isHelpful ? 1 : 0)})
        </Button>
      </div>

      {/* Store reply */}
      {review.reply && (
        <div className="mt-4 ml-4 pl-4 border-l-2 border-primary/20 bg-muted/20 py-2 pr-4 rounded-r-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-tiny font-bold text-primary-foreground shrink-0">
              S
            </div>
            <span className="text-xs font-semibold text-primary">
              {review.reply.name}
            </span>
            <span
              className="text-xs text-muted-foreground"
              title={format(new Date(review.reply.date), "PPP")}
            >
              {formatDistanceToNow(new Date(review.reply.date), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            "{review.reply.text}"
          </p>
        </div>
      )}
    </div>
  );
}
