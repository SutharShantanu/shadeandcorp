"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { usePathSegments } from "@/app/functions/pathname";
import { NumberInput, NumberInputButton, NumberInputField, NumberInputRoot } from "../ui/number-input";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

const ProductImageCarousel = ({ images }) => (
  <Carousel>
    <CarouselContent>
      {images.map((image, index) => (
        <CarouselItem key={index}>
          <Image
            width={500}
            height={500}
            src={image}
            alt={`Product image ${index + 1}`}
            className="h-64 w-full object-cover rounded-t-xs transition-transform duration-1500 ease-in-out group-hover:scale-105"
          />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselDots />
  </Carousel>
);

const FavoriteIcon = ({ isFavourite, toggleFavourite }) => (
  <Heart
    onClick={toggleFavourite}
    absoluteStrokeWidth="1px"
    className={`absolute cursor-pointer top-2 right-2 bg-transparent rounded-full p-0 transition-all ease-in-out ${isFavourite ? "text-accent-default fill-accent-default" : "text-primary-default"}`}
  />
);

const ProductDetails = ({ product, formattedPath }) => (
  <Link href={`/${formattedPath}/${product.name}`} passHref>
    <div className="flex items-center gap-2 justify-between">
      <CardTitle className="text-description font-description truncate group-hover:underline underline-offset-2">{product.name}</CardTitle>
    </div>
    <CardDescription className="text-xs font-description my-2 text-muted-foreground/80 line-clamp-2 truncate">
      {product.description}
    </CardDescription>
    <Separator className="my-2" />
  </Link>
);

const ProductColors = ({ colors }) => (
  colors && (
    <motion.div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground/80">Colors:</span>
      {colors.map((color, index) => (
        <TooltipProvider key={color || index}>
          <Tooltip>
            <TooltipTrigger>
              <p style={{ backgroundColor: color }} className="w-5 h-5 rounded-full border-2 p-0" />
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              <p>{color}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </motion.div>
  )
);

const ProductPrice = ({ product }) => (
  <motion.div className="flex items-center gap-2 my-2">
    <span className="text-xs text-muted-foreground/80">Price:</span>
    {product.discounted_price ? (
      <motion.div className="flex items-center gap-2">
        <span className="text-xs line-through text-muted-foreground/80">${product.original_price}</span>
        <span className="text-small font-subheading text-primary-default">${product.discounted_price}</span>
      </motion.div>
    ) : (
      <span className="text-small text-primary-default font-heading">${product.original_price}</span>
    )}
  </motion.div>
);

const ProductActions = ({ item, setCart, min = 1, max = 10 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const handleQuantity = (id, value) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === id ? { ...cartItem, quantity: Math.max(min, value) } : cartItem
      )
    );
  };

  const handlePointerDown = (id, diff) => (event) => {
    event.preventDefault();
    inputRef.current?.focus();

    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + 1) }
          : cartItem
      )
    );

  };

  // const handleCart = async () => {
  //   setIsLoading(true);
  //   try {
  //     // const response = await axios.post("/api/cart", { itemId: item.id, quantity: item.quantity });
  //     // if (response.status === 200 || response.status === 201) {
  //     toast.success("Product added to cart");
  //     setCart((prevCart) =>
  //       prevCart.map((cartItem) =>
  //         cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error adding to cart:", error);
  //     toast.error("Failed to add product to cart");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleCart = async () => {
    setIsLoading(true);
    try {
      toast.success("Product added to cart");
      setCart((prevCart) => {
        console.log("Previous Cart:", prevCart);
        return prevCart.map((cartItem) => {
          if (cartItem.id === item.id) {
            console.log("Updating quantity to:", cartItem.quantity + 1);
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          }
          return cartItem;
        });
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardFooter className="flex items-center w-full p-0 flex-row sm:justify-between divide-x divide-border">
      {item?.quantity && item?.quantity > 0 ? (
        <NumberInputRoot className="">
          <NumberInputButton
            onClick={handlePointerDown(item.id, -1)}
            disabled={item.quantity <= min}
            icon="minus"
          />
          <NumberInputField
            ref={inputRef}
            value={item.quantity}
            onInput={(newValue) => handleQuantity(item.id, newValue)}
            min={min}
            max={max}
          />
          <NumberInputButton
            onClick={handlePointerDown(item.id, 1)}
            disabled={item.quantity >= max}
            icon="plus"
          />
        </NumberInputRoot>
      ) : (
        <Button
          onClick={handleCart}
          className="w-1/2 bg-primary-default text-primary-foreground rounded-none rounded-bl-xs hover:bg-primary-default/80"
        >
          <ShoppingCart className="w-5 h-5 text-primary-foreground cursor-pointer" />
          {isLoading ? (
            <motion.div className="flex items-center gap-2">
              Adding <Spinner />
            </motion.div>
          ) : (
            "Add to Cart"
          )}
        </Button>
      )}
      <Button className="w-1/2 bg-primary-default text-primary-foreground rounded-none rounded-br-xs hover:bg-primary-default/80">
        <Sparkles className="w-5 h-5 text-primary-foreground cursor-pointer" />
        Buy Now
      </Button>
    </CardFooter>
  );
};

const ProductCard = ({ product }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const pathSegments = usePathSegments();
  const formattedPath = pathSegments.join("/");
  const [cart, setCart] = useState([]);

  return (
    <motion.div key={product.id} className="border border-border border-separate border-dashed rounded-xs hover:bg-muted-default/20 hover:shadow-md h-fit">
      <Card className="w-full border-none h-fit">
        <CardHeader className="p-0 w-full overflow-hidden relative rounded-t-xs">
          <ProductImageCarousel images={product.images} />
          {product.discount && (
            <Badge className="absolute top-2 left-2 text-xs bg-accent-default text-primary-foreground px-2 py-[2px] text-nowrap">
              {product.discount}% OFF
            </Badge>
          )}
          <FavoriteIcon isFavourite={isFavourite} toggleFavourite={() => setIsFavourite((prev) => !prev)} />
        </CardHeader>
        <CardContent className="p-4 hover:cursor-pointer group">
          <ProductDetails product={product} formattedPath={formattedPath} />
          <ProductColors colors={product.colors} />
          <ProductPrice product={product} />
        </CardContent>
        <ProductActions key={product.id} item={product} setCart={setCart} />
      </Card>
    </motion.div>
  );
};

export default ProductCard;
