"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Clock, Users } from "lucide-react";
import { MenTopwear } from "@/dummy/clothes";
import Loading from "@/components/loading";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";

const ProductPage = () => {
    const { productId } = useParams();
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [pincode, setPincode] = useState("");
    const [isZoomed, setIsZoomed] = useState(false);
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(product?.images?.[0]);

    useEffect(() => {
        // Fetch product based on productId from dummy data
        const foundProduct = MenTopwear.find((item) => item.id === parseInt(productId));
        setProduct(foundProduct);
    }, [productId]);

    if (!product) return <Loading />;

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-start justify-between gap-6">
                <motion.div className="flex items-start justify-between gap-2 h-fit w-[45%]">
                    <div className="relative">
                        {/* <AspectRatio ratio={16 / 9}> */}
                        <Image
                            src={activeImage}
                            width={500}
                            height={500}
                            alt="Active product image"
                            className="object-cover w-[500px] rounded-md border border-border"
                        />
                        {/* </AspectRatio> */}
                    </div>

                    <div className="flex flex-col gap-2 items-center justify-around w-fit">
                        {product?.images?.slice(0, 3).map((item, index) => (
                            <div
                                key={index}
                                className={`p-1 border ${activeImage === item ? "border-primary-default/50" : "border-border"} rounded-md cursor-pointer`}
                                onClick={() => setActiveImage(item)}
                            >
                                <Image
                                    src={item}
                                    width={100}
                                    height={100}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-[100px] object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>
                <Separator orientation="vertical" className="mx-4" />
                <motion.div className="w-[55%]">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-semibold mb-4">${product.price}</p>

                    {/* Sizes */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Select Size</h3>
                        <div className="flex gap-2">
                            {product.sizes.map((size) => (
                                <Button key={size} variant={selectedSize === size ? "default" : "outline"} onClick={() => setSelectedSize(size)}>
                                    {size}
                                </Button>
                            ))}
                        </div>
                        {/* <p className="text-sm text-gray-500 mt-2">{product.stock} items left</p> */}
                    </div>

                    {/* Colors */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Select Color</h3>
                        <div className="flex gap-2">
                            {product.colors.map((color) => (
                                <div
                                    key={color}
                                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor === color ? "border-black" : "border-transparent"}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* EMI Options */}
                    <div className="mb-6">
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
                    </div>

                    {/* Pincode Check */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Check Delivery</h3>
                        <div className="flex gap-2">
                            <Input placeholder="Enter Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                            <Button>Check</Button>
                        </div>
                    </div>

                    {/* Offer Timer */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Offer Ends In</h3>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <p className="text-sm">{product.offerEndTime}</p>
                        </div>
                    </div>

                    {/* Total Buyers */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Total Buyers</h3>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <p className="text-sm">{product.totalBuyers} people bought this</p>
                        </div>
                    </div>

                    {/* Wishlist */}
                    <div className="mb-6">
                        <Button variant="outline" onClick={() => setIsWishlisted(!isWishlisted)}>
                            <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
                            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        </Button>
                    </div>

                    {/* Add to Cart */}
                    <Button className="w-full">Add to Cart</Button>
                </motion.div>
            </div>
        </div >
    );
};

export default ProductPage;
