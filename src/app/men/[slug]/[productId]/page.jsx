"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Clock, Users, Ruler, ShoppingBag, ShoppingCart } from "lucide-react";
import { MenTopwear } from "@/dummy/clothes";
import Loading from "@/components/loading";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCountdown } from "@/app/functions/timer";

const ProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [pincode, setPincode] = useState("");
    const timeLeft = useCountdown(product?.offerEndTime);
    const [isZoomed, setIsZoomed] = useState(false);
    const [activeImage, setActiveImage] = useState(product?.images[0]);
    const [selectedColor, setSelectedColor] = useState(product?.colors[0]);

    const imageColorMap = product?.images?.map((image, index) => ({
        image,
        color: product?.colors[index],
    }));

    const handleImageClick = (item) => {
        setActiveImage(item.image);
        setSelectedColor(item.color);
    };

    useEffect(() => {
        const foundProduct = MenTopwear.find((item) => item.id === parseInt(productId));
        setProduct(foundProduct);
    }, [productId]);

    if (!product) return <Loading />;

    return (
        <motion.div className="container mx-auto py-6">
            <motion.div className="flex items-start justify-between gap-6">
                <motion.div className="grid grid-cols-2 grid-rows-4 h-fit w-2/3">
                    {product?.images?.map((item, index) => (
                        <motion.div
                            key={index}
                            className="border border-border -m-[.5px] rounded-none"
                            onClick={() => setActiveImage(item)}>
                            <Image
                                src={item}
                                width={1000}
                                height={1000}
                                alt={`Thumbnail ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div className="flex flex-col gap-4 w-1/3">
                    <motion.div className="">
                        <motion.div div className="flex items-center gap-2 justify-between" >
                            <h1 className="text-subheading font-subheading">{product.name}</h1>
                            <Button size="icon" onClick={() => setIsWishlisted(!isWishlisted)} className="border border-border rounded-full w-fit h-fit p-2 hover:bg-primary-default/10">
                                <Heart size={18} className={` ${isWishlisted ? "text-destructive-default fill-destructive-default" : "text-primary-default"}`} />
                            </Button>
                        </motion.div >
                        <motion.div className="flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            <p className="text-xs">{product.totalBuyers} people bought this</p>
                        </motion.div>
                    </motion.div>
                    <motion.div className="flex flex-col gap-2 ">
                        <motion.div className="flex flex-wrap gap-2 items-baseline">
                            <p className="text-primary-default text-description">Price:</p>
                            <p className="text-small text-muted-foreground line-through font-description">${product.original_price}</p>
                            <p className="text-subheading font-description px-2 py-1 -skew-x-12 bg-accent-default">${product.discounted_price}</p>
                        </motion.div>
                    </motion.div>

                    <motion.div className="gap-2 flex flex-col">
                        <motion.div className="flex gap-4 w-fit">
                            <h3 className="text-small font-description">Color:</h3>
                            {imageColorMap?.slice(0, 3).map((item, index) => (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <motion.div
                                                key={index}
                                                className={`border ${activeImage === item.image ? "border-accent-default text-accent-default" : "border-border"
                                                    } rounded-md cursor-pointer`}
                                                onClick={() => handleImageClick(item)}>
                                                <Image
                                                    src={item.image}
                                                    width={100}
                                                    height={100}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-[80px] object-cover rounded-lg"
                                                />
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" >
                                            {selectedColor} this is tooltip
                                            <TooltipArrow />
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </motion.div>
                    </motion.div>
                    <motion.div className="gap-2 flex flex-col">
                        <motion.div className="flex gap-4">
                            {product.stock.map(({ size, quantity }) => (
                                <motion.div className="flex flex-col items-start gap-2" key={size}>
                                    <Button
                                        className={`rounded-md outline outline-1 ${selectedSize === size ? "bg-accent-default outline-accent-default" : "outline-border text-primary-default"} min-w-20 w-full hover:bg-primary-default/10 transition-all font-heading ease-in-out select-none`}
                                        onClick={() => setSelectedSize(size)}>
                                        {size}
                                    </Button>
                                    <span className="text-muted-foreground/70 text-xs">
                                        {quantity} left
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.div className="flex items-center gap-2 justify-between">
                            <h3 className="text-small">Sizes:
                                {selectedSize && <Badge className="mx-2 text-xs bg-primary-default">
                                    {selectedSize}
                                </Badge>}
                            </h3>
                            <p className="flex items-center gap-2 text-xs">
                                Need Help? Check our size guide
                                <Link href={"#"} className="flex items-center gap-1 my-4 hover:underline underline-offset-2">
                                    <Ruler className="w-4 h-4" />
                                    Size Guide
                                </Link>
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* EMI Options */}
                    <motion.div div className="gap-2 flex flex-col" >
                        <h3 className="text-lg font-medium mb-2">EMI Options</h3>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select EMI Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(product.emiOptions).map(([key, option]) => (
                                    <SelectItem key={key} value={key}>
                                        {`${option.size} - ${option.quantity} months`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div >
                    {/* Pincode Check */}
                    <motion.div div className="gap-2 flex flex-col" >
                        <h3 className="text-lg font-medium mb-2">Check Delivery</h3>
                        <motion.div className="flex gap-2">
                            <Input placeholder="Enter Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                            <Button>Check</Button>
                        </motion.div>
                    </motion.div >

                    {/* Offer Timer */}
                    <motion.div className="gap-2 flex flex-col">
                        <h3 className="text-lg font-medium mb-2">Offer Ends In</h3>
                        <motion.div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <p className="text-sm">
                                {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Total Buyers */}
                    <motion.div div className="mb-6" >
                        <h3 className="text-lg font-medium mb-2">Total Buyers</h3>

                    </motion.div >

                    <span className="text-small text-primary-default line-through">${product.discount} off</span>
                    <Button className="w-full bg-primary-default font-extralight" >
                        Add To Cart
                        <ShoppingCart className="w-5 h-5" />
                    </Button >
                </motion.div >
            </motion.div >
        </motion.div >
    );
};

export default ProductPage;
