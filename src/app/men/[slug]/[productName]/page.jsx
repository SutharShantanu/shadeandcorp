"use client";
import { useState, useEffect } from "react";
import { useCountdown } from "@/app/functions/timer";
import { MenTopwear } from "@/dummy/clothes";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react"
import Loading from "@/components/loading";
import Image from "next/image";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    Heart,
    Clock,
    Users,
    Ruler,
    ShoppingCart,
    MoveHorizontal,
    MoveVertical,
    Truck
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator";
import { useRefineUrl } from "@/app/functions/pathname";
import { calculateEMI } from "@/app/functions/emiCalculate";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { z } from "zod";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";


const ProductPage = () => {
    const { productName } = useParams();
    const refinedName = useRefineUrl(productName);
    const [product, setProduct] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const timeLeft = useCountdown(product?.offerEndTime);
    const [isLoading, setIsLoading] = useState(false);
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
        const foundProduct = MenTopwear.find(
            (item) => item.name.toLowerCase() === refinedName.toLowerCase()
        );

        setProduct(foundProduct);
    }, [refinedName]);

    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(``);
            if (response.status === 200 || response.ok) {
                // add functionaly to add product to cart
            }
        } catch (error) {
            console.log(`error`, error)
        } finally {
            setIsLoading(false);
        }
    }

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
                <motion.div className="flex flex-col gap-7 w-1/3">
                    <motion.div className="">
                        <motion.div className="flex items-center gap-2 justify-between" >
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
                            <p className="text-primary-default text-small">Price:</p>
                            <p className="text-small text-muted-foreground line-through font-description">${product.original_price}</p>
                            <p className="text-subheading font-description px-2 py-1 -skew-x-12 text-primary-foreground bg-accent-default">${product.discounted_price}</p>
                        </motion.div>
                    </motion.div>
                    <motion.div className="gap-2 flex flex-col">
                        <motion.div className="flex gap-2 w-fit">
                            <h3 className="text-small font-description">Color:</h3>
                            {imageColorMap?.slice(0, 3).map((item) => (
                                <TooltipProvider key={item.image}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <motion.div
                                                className={`border ${activeImage === item.image ? "border-accent-default text-accent-default" : "border-border"
                                                    } rounded-md cursor-pointer`}
                                                onClick={() => handleImageClick(item)}
                                            >
                                                <Image
                                                    src={item.image}
                                                    width={100}
                                                    height={100}
                                                    alt={`Thumbnail ${item.image}`}
                                                    className="w-[80px] object-cover rounded-lg"
                                                />
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            {selectedColor} this is tooltip
                                            <TooltipArrow />
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </motion.div>
                    </motion.div>
                    <SizeStocks product={product} />
                    <EMI price={product.discounted_price} />
                    <CheckDelivery />
                    <Offer timeLeft={timeLeft} />
                    <Button
                        onClick={handleAddToCart}
                        className="w-full h-12 bg-primary-default text-primary-foreground rounded-md hover:bg-primary-default/80">
                        {isLoading ? (
                            <motion.div className="flex items-center gap-2 w-fit">
                                <span>loading ...</span>
                                <Spinner className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <motion.div className="flex items-center gap-2 w-fit">
                                Add To Cart
                                <ShoppingCart className="w-5 h-5" />
                            </motion.div>
                        )}
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default ProductPage;

const Offer = ({ timeLeft }) => {

    return (
        <motion.div >
            <h3 className="text-small flex items-center gap-2">
                Offer Ends In
            </h3>
            <motion.div
                className="flex items-center gap-2 my-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <Clock className="w-5 h-5 text-primary-default" />
                <p className="text-description bg-gradient-to-r from-accent-default to-destructive-default text-transparent bg-clip-text drop-shadow-md">
                    {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                </p>
            </motion.div>
        </motion.div >
    )
}

const SizeStocks = ({ product }) => {

    const [selectedSize, setSelectedSize] = useState("");

    return (
        <motion.div className="gap-2 flex flex-col">
            <motion.div className="flex gap-4">
                {product?.stock?.map(({ size, quantity }) => (
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
                <SizeGuide />
            </motion.div>
        </motion.div>
    )
}

const CheckDelivery = () => {
    const pincodeSchema = z.string().regex(/^\d{6}$/, "Pincode must be a 6-digit number");
    const { data: session } = useSession();
    const [pincode, setPincode] = useState("");
    const [deliveryEstimate, setDeliveryEstimate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedPincode = sessionStorage.getItem("userPincode") || session?.user?.pincode;
        if (storedPincode) {
            setPincode(storedPincode);
        }
    }, []);

    useEffect(() => {
        if (pincode.length === 6) {
            checkDeliveryTime(pincode);
        } else {
            setDeliveryEstimate(null);
        }
    }, [pincode]);

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setPincode(value);
        setError("");
    };

    const checkDeliveryTime = (pin) => {
        const result = pincodeSchema.safeParse(pin);
        if (!result.success) {
            setError(result.error.errors[0].message);
            setDeliveryEstimate(null);
            return;
        }

        setIsLoading(true);
        setError("");

        setTimeout(() => {
            const estimate = "3-5";
            setDeliveryEstimate(estimate);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <motion.div className="gap-2 flex flex-col">
            <h3 className="text-small flex items-center gap-2">
                Check Delivery
            </h3>
            <motion.div className="flex gap-2">
                <Input
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={handleInputChange}
                    className={`${error ? "border-destructive-default" : "border-border outline-none focus-visible:bg-transparent"} rounded-md focus:border-accent-default`}
                    maxLength={6}
                    disabled={isLoading}
                />
            </motion.div>
            {isLoading && <p className="text-muted-foreground text-sm">Checking...</p>}
            {error && <p className="text-destructive-default text-sm">{error}</p>}
            {deliveryEstimate && !isLoading && (
                <p className="text-sm text-muted-foreground flex items-center w-fit gap-2">
                    Estimated delivery:
                    <Truck className="w-4 h-4" />
                    {deliveryEstimate} business days
                </p>
            )}
        </motion.div>
    );
};

const EMI = ({ price, interestRate = 16 }) => {
    const emiOptions = calculateEMI(price, [3, 6, 9, 12, 18, 24], interestRate);

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="emi">
                <AccordionTrigger className="hover:no-underline text-small">
                    <span className="flex items-center gap-2 ">
                        EMI & Pay Later Options
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png"
                            alt="UPI Logo"
                            className="max-w-10 w-10"
                            width={50}
                            height={50}
                        />
                    </span>
                </AccordionTrigger>
                <AccordionContent>
                    <p className="mb-2 text-sm text-muted-foreground">
                        Pay in easy installments with <strong>{interestRate}%</strong> interest.
                    </p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>EMI Plan</TableHead>
                                <TableHead>Interest (pa)</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Total Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(emiOptions).map(([months, emiData]) => {
                                const totalAfterInterest = emiData.emi * months;
                                const discount = emiData.interest;

                                return (
                                    <TableRow key={months}>
                                        <TableCell>
                                            <strong>₹{emiData.emi}</strong> × {months}m
                                        </TableCell>
                                        <TableCell>
                                            ₹{emiData.interest} ({interestRate}%)
                                        </TableCell>
                                        <TableCell className="text-destructive-default">
                                            - ₹{discount}
                                        </TableCell>
                                        <TableCell>₹{price}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const SizeGuide = () => {

    const sizeCharts = {
        asia: [
            { size: "XS", chest: "76-81", waist: "61-66", hip: "76-81" },
            { size: "S", chest: "86-91", waist: "71-76", hip: "86-91" },
            { size: "M", chest: "97-102", waist: "81-86", hip: "97-102" },
            { size: "L", chest: "107-112", waist: "91-97", hip: "107-112" },
            { size: "XL", chest: "117-122", waist: "102-107", hip: "117-122" },
        ],
        europe: [
            { size: "XS", chest: "80-85", waist: "65-70", hip: "80-85" },
            { size: "S", chest: "90-95", waist: "75-80", hip: "90-95" },
            { size: "M", chest: "100-105", waist: "85-90", hip: "100-105" },
            { size: "L", chest: "110-115", waist: "95-100", hip: "110-115" },
            { size: "XL", chest: "120-125", waist: "105-110", hip: "120-125" },
        ],
        us: [
            { size: "XS", chest: "30-32", waist: "24-26", hip: "30-32" },
            { size: "S", chest: "34-36", waist: "28-30", hip: "34-36" },
            { size: "M", chest: "38-40", waist: "32-34", hip: "38-40" },
            { size: "L", chest: "42-44", waist: "36-38", hip: "42-44" },
            { size: "XL", chest: "46-48", waist: "40-42", hip: "46-48" },
        ],
        uk: [
            { size: "XS", chest: "76-81", waist: "61-66", hip: "76-81" },
            { size: "S", chest: "86-91", waist: "71-76", hip: "86-91" },
            { size: "M", chest: "97-102", waist: "81-86", hip: "97-102" },
            { size: "L", chest: "107-112", waist: "91-97", hip: "107-112" },
            { size: "XL", chest: "117-122", waist: "102-107", hip: "117-122" },
        ]
    };

    const measurements = [
        { label: "Chest", icon: <MoveHorizontal className="w-4 h-4 text-gray-500" />, description: "Measure around the fullest part of your chest." },
        { label: "Waist", icon: <Ruler className="w-4 h-4 text-gray-500" />, description: "Measure around your natural waistline." },
        { label: "Hips", icon: <MoveVertical className="w-4 h-4 text-gray-500" />, description: "Measure around the widest part of your hips." }
    ];

    const fadeInOut = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } }
    };

    return (
        <motion.div className="flex items-center gap-2 text-xs">
            Need Help? Check our size guide
            <Dialog>
                <DialogTrigger>
                    <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 my-4 hover:underline underline-offset-2"
                    >
                        <Ruler className="w-4 h-4" />
                        Size Guide
                    </motion.span>
                </DialogTrigger>
                <DialogContent className=" max-h-[70vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Size Guide</DialogTitle>
                        <DialogDescription>
                            Find your perfect fit with our size chart and measurement tips.
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <motion.div className="flex items-start gap-4">
                        <Tabs defaultValue="us" className="w-full">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5 } }}>
                                <TabsList className="flex justify-between gap-2">
                                    {Object.keys(sizeCharts).map(region => (
                                        <TabsTrigger key={region} value={region} className="uppercase">
                                            {region}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </motion.div>

                            {Object.entries(sizeCharts).map(([region, sizes]) => (
                                <TabsContent key={region} value={region}>
                                    <motion.div {...fadeInOut}>
                                        <Table>
                                            <TableCaption className="bg-primary-foreground text-xs">
                                                Reference this chart to select the perfect fit.
                                            </TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Size</TableHead>
                                                    <TableHead>Chest (in)</TableHead>
                                                    <TableHead>Waist (in)</TableHead>
                                                    <TableHead>Hip (in)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {sizes.map(({ size, chest, waist, hip }) => (
                                                    <TableRow key={size}>
                                                        <TableCell>{size}</TableCell>
                                                        <TableCell>{chest}</TableCell>
                                                        <TableCell>{waist}</TableCell>
                                                        <TableCell>{hip}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </motion.div>
                                </TabsContent>
                            ))}
                        </Tabs>
                        <motion.div>
                            <motion.div {...fadeInOut} className="">
                                <h3 className="text-description font-semibold">How to Measure</h3>
                                <p className="text-xs text-gray-600 text-nowrap">Use a measuring tape and follow these simple steps:</p>
                                <ul className="list-none space-y-2 text-xs my-4 text-gray-600 text-nowrap">
                                    {measurements.map(({ label, icon, description }) => (
                                        <li key={label} className="flex items-center gap-2">
                                            <span className="flex-shrink-0">{icon}</span>
                                            <span className="font-medium">{label}:</span>
                                            <span className="text-xs text-gray-500">{description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                            <motion.div {...fadeInOut} className="text-center mt-4">
                                <Image
                                    src="https://img.freepik.com/free-vector/women-waist-with-measuring-tape-weight-loss-diet-waistline-icon-line-art-graphic-elements_460848-11528.jpg?t=st=1740129812~exp=1740133412~hmac=047cbdfaecf09cc0da66bb0ef1b85aa1bbcb5279f7c294cf0ad7076c8a58ee88&w=826"
                                    alt="Size Guide"
                                    width={500}
                                    height={500}
                                    className="mx-auto w-full object-cover max-h-[250px] rounded-md border border-gray-300"
                                />
                                <p className="text-xs text-gray-500 mt-2">Reference this guide for accurate sizing.</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

