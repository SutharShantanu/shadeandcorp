"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Heart, Router, ShoppingCart, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image";
import Link from "next/link";
import { usePathSegments } from "@/app/functions/pathname";

const ProductCard = ({ product }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const pathSegments = usePathSegments();
  const formattedPath = pathSegments.join("/");

  return (
    <motion.div
      key={product.id}
      className="border border-border border-separate border-dashed hover:bg-muted-default/20 hover:shadow-md rounded-lg h-fit">
      <Card className="w-full border-none h-fit">
        <CardHeader className="p-0 w-full overflow-hidden relative rounded-t-md">
          {/* {product.images.map((image, index) => (
            <Image
              key={index}
              width={500}
              height={500}
              src={image}
              alt={`${product.name} image ${index + 1}`}
              className="h-64 w-full object-cover rounded-t-md transition-transform duration-[1500] ease-in-out group-hover:scale-105"
            />
          ))} */}
          {product.discount && (
            <Badge className="absolute top-0 left-2 text-xs bg-accent-default text-primary-foreground px-2 py-[2px] text-nowrap">
              {product.discount}% OFF
            </Badge>
          )}
          <Heart
            onClick={() => setIsFavourite((prev) => !prev)}
            absoluteStrokeWidth="1px"
            className={`absolute top-0 right-2 bg-transparent rounded-full p-0 transition-all ease-in-out ${isFavourite ? "text-accent-default fill-accent-default" : "text-primary-default"}`} />
        </CardHeader>
        <CardContent className="p-4 hover:cursor-pointer group">
          <Link href={`/${formattedPath}/${product.id}`} passHref>
            <div className="flex items-center gap-2 justify-between">
              <CardTitle className="text-description font-description truncate group-hover:underline underline-offset-2 group-hover:text-accent-default">{product.name}</CardTitle>
            </div>
            <CardDescription className="text-xs font-description my-2 text-muted-foreground/80 line-clamp-2 text-wrap truncate">
              {product.description}
            </CardDescription>
            <Separator className="my-2" />
            {product.colors && (
              <motion.div className="flex i</div>tems-center gap-2">
                <span className="text-small">Colors:</span>
                {product.colors.map((color, index) => (
                  <TooltipProvider key={color || index}>
                    <Tooltip>
                      <TooltipTrigger>
                        <p key={color || index} style={{ backgroundColor: color }} className="w-5 h-5 rounded-full border-2 p-0" />
                      </TooltipTrigger>
                      <TooltipContent className="px-2 py-1 text-xs">
                        <p>{color}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </motion.div>
            )}
            <motion.div className="flex items-center gap-2 my-2">
              {product.discounted_price ? (
                <motion.div className="flex items-center gap-2">
                  <span className="text-small">Price:</span>
                  <span className="text-xs line-through text-gray-400">${product.original_price}</span>
                  <span className="text-small font-subheading text-destructive-default">${product.discounted_price}</span>
                </motion.div>
              ) : (
                <motion.div className="flex items-center gap-2">
                  <span className="text-small">Price:</span>
                  <span className="text-small text-primary-default font-heading">${product.original_price}</span>
                </motion.div>
              )}
            </motion.div>
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-0 sm:flex-row sm:justify-between divide-x divide-border">
          <Button className="w-full bg-primary-default text-primary-foreground rounded-none rounded-bl-md hover:bg-primary-default/80">
            <ShoppingCart
              className="w-5 h-5 text-primary-foreground cursor-pointer"
              aria-label="add to cart"
            />
            Add to Cart
          </Button>
          <Button className="w-full bg-primary-default text-primary-foreground rounded-none rounded-br-md hover:bg-primary-default/80">
            <Sparkles
              className="w-5 h-5 text-primary-foreground cursor-pointer"
              aria-label="buy now" />
            Buy Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;