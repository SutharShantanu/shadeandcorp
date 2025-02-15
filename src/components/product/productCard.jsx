import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const ProductCard = ({ product }) => {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <motion.div
      className="border border-border border-separate border-dashed m-2 cursor-pointer group group hover:bg-muted-default/20 hover:shadow-md rounded-lg">
      <Card className="w-full border-none">
        <CardHeader className="p-0 w-full overflow-hidden relative rounded-t-md">
          <Image
            width={500}
            height={500}
            src={product.image}
            alt={product.name}
            className="h-64 w-full object-cover rounded-t-md transition-transform ease-in-out group-hover:scale-105"
          />
          <Heart
            onClick={() => { }}
            absoluteStrokeWidth="1px"
            className={`absolute top-0 right-2 bg-transparent rounded-full p-0 transition-all ease-in-out ${isFavourite ? "text-accent-default fill-accent-default" : "text-primary-default"}`} />
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 justify-between">
            <CardTitle className="text-description font-normal truncate">{product.name}</CardTitle>
            {product.discount && (
              <Badge className="text-xs bg-accent-default text-primary-foreground px-2 py-[2px]">
                {product.discount}% OFF
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs font-light my-2 text-muted-foreground/80 line-clamp-2 text-wrap truncate">
            {product.description}
          </CardDescription>
          <Separator className="my-2" />
          {product.colors && (
            <div className="flex items-center gap-2">
              <span className="text-small">Colors:</span>
              {product.colors.map((color, index) => (
                <button key={index} style={{ backgroundColor: color }} className="w-5 h-5 rounded-full border-2" />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 my-2">
            {product.discounted_price ? (
              <>
                <span className="text-small">Price:</span>

                <span className="text-lg font-bold text-destructive-default">${product.discounted_price}</span>
                <span className="text-sm line-through text-gray-400">${product.original_price}</span>
              </>
            ) : (
              <>
                <span className="text-small">Price:</span>
                <span className="text-lg text-primary-default font-bold">${product.original_price}</span>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-0 sm:flex-row sm:justify-between divide-x divide-border">
          <Button className="w-full bg-primary-default text-primary-foreground rounded-none hover:bg-primary-default/80">
            <ShoppingCart
              className="w-5 h-5 text-primary-foreground cursor-pointer"
              aria-label="add to cart"
            />
            Add to Cart
          </Button>
          <Button className="w-full bg-primary-default text-primary-foreground rounded-none hover:bg-primary-default/80">
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
