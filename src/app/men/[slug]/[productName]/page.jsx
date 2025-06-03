"use client";
import { useState, useEffect } from "react";
import { useCountdown } from "@/app/functions/timer";
import { MenTopwear } from "@/dummy/clothes";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react"
import Loading from "@/components/loading";
import Image from "next/image";
import { toast } from 'sonner';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    Heart,
    Users,
    Ruler,
    ShoppingCart,
    MoveHorizontal,
    MoveVertical,
    Truck,
    Timer,
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
import AnimatedGradientText from "@/components/ui/animated-text";


const ProductPage = () => {
    const { productName } = useParams();
    const refinedName = useRefineUrl(productName);
    const [product, setProduct] = useState(null);
    const timeLeft = useCountdown(product?.offerEndTime);

    const [isLoading, setIsLoading] = useState(false);
    const [activeImage, setActiveImage] = useState(product?.images[0]);
    const [selectedColor, setSelectedColor] = useState(product?.colors[0]);

    const router = useRouter();

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
        router.push("/cart");
        toast.success('Product has been added to cart.')
    }

    if (!product) return <Loading />;


    return (
        <motion.div className="container mx-auto py-6 px-2 sm:px-4">
            <motion.div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                {/* Images: full width on mobile, 2/3 on lg+ */}
                <div className="w-full lg:w-2/3 mb-6 lg:mb-0">
                    <ProductImageGrid product={product} setActiveImage={setActiveImage} />
                </div>
                {/* Details: full width on mobile, 1/3 on lg+ */}
                <motion.div className="flex flex-col gap-4 w-full lg:w-1/3">
                    <ProductHeader product={product} />
                    <PriceDisplay product={product} />
                    {timeLeft && <Offer timeLeft={timeLeft} />}
                    <ColorSelection
                        imageColorMap={imageColorMap}
                        activeImage={activeImage}
                        handleImageClick={handleImageClick}
                        selectedColor={selectedColor}
                    />
                    <SizeStocks product={product} />
                    <EMI price={product.discounted_price} />
                    <CheckDelivery />
                    <AddToCartButton isLoading={isLoading} handleAddToCart={handleAddToCart} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default ProductPage;

// Components starts from here !

const ProductImageGrid = ({ product, setActiveImage }) => {
    return (
        <motion.div
            className="
                grid
                grid-cols-2 grid-rows-2
                gap-2
                w-full
                sm:grid-cols-2 sm:grid-rows-2 sm:w-2/3
                md:grid-cols-2 md:grid-rows-2 md:w-2/3
                lg:grid-cols-2 lg:grid-rows-2 lg:w-2/3
                xl:grid-cols-2 xl:grid-rows-2 xl:w-2/3
                max-w-full
            "
        >
            {product?.images?.map((item, index) => (
                <motion.div
                    key={index}
                    className="border border-border rounded-none cursor-pointer aspect-square"
                    onClick={() => setActiveImage(item)}
                >
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
    );
};

const ProductHeader = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
        <motion.div>
            <motion.div className="flex flex-row items-center gap-2 sm:gap-4 justify-between w-full">
                <h1 className="text-subheading font-subheading text-base sm:text-lg md:text-xl lg:text-2xl break-words max-w-full">{product.name}</h1>
                <Button
                    size="icon"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="border border-border rounded-full w-9 h-9 p-2 hover:bg-primary-default/10 mt-2 sm:mt-0"
                >
                    <Heart
                        size={18}
                        className={`${isWishlisted ? "text-destructive-default fill-destructive-default" : "text-primary-default"}`}
                    />
                </Button>
            </motion.div>
            <motion.div className="flex items-center gap-2 mt-1 sm:mt-0">
                <Users className="w-3 h-3" />
                <p className="text-xs sm:text-sm">{product.totalBuyers} people bought this</p>
            </motion.div>
        </motion.div>
    );
};

const PriceDisplay = ({ product }) => {
    return (
        <motion.div className="flex flex-col gap-2">
            <motion.div className="flex flex-wrap gap-1 sm:gap-2 items-baseline">
                <p className="text-primary-default text-xs sm:text-sm">Price:</p>
                <p className="text-xs sm:text-sm text-muted-foreground line-through font-description">${product.original_price}</p>
                <p className="text-base sm:text-lg md:text-xl font-description px-1 sm:px-2 py-0.5 sm:py-1 -skew-x-12 text-primary-foreground bg-accent-default">
                    ${product.discounted_price}
                </p>
            </motion.div>
        </motion.div>
    );
};

const ColorSelection = ({ imageColorMap, activeImage, handleImageClick, selectedColor }) => {
    return (
        <motion.div className="gap-2 flex flex-col">
            <motion.div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-fit">
                <h3 className="text-small font-description">Color:</h3>
                {imageColorMap?.slice(0, 3).map((item) => (
                    <TooltipProvider key={item.image}>
                        <Tooltip>
                            <TooltipTrigger>
                                <motion.div
                                    className={`border ${activeImage === item.image ? "border-accent-default text-accent-default" : "border-border"
                                        } rounded-xs cursor-pointer`}
                                    onClick={() => handleImageClick(item)}
                                >
                                    <Image
                                        src={item.image}
                                        width={100}
                                        height={100}
                                        alt={`Thumbnail ${item.image}`}
                                        className="w-16 h-16 sm:w-[80px] sm:h-[80px] object-cover rounded-lg"
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
    );
};

const AddToCartButton = ({ isLoading, handleAddToCart }) => {
    return (
        <Button
            onClick={handleAddToCart}
            className="
                w-full
                h-10 sm:h-12
                bg-primary-default
                text-primary-foreground
                rounded-xs
                hover:bg-primary-default/80
                flex items-center justify-center
                text-sm sm:text-base
                px-2 sm:px-4
                gap-1 sm:gap-2
            "
        >
            {isLoading ? (
                <motion.div className="flex items-center gap-1 sm:gap-2 w-fit">
                    <span className="text-xs sm:text-base">loading ...</span>
                    <Spinner className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
            ) : (
                <motion.div className="flex items-center gap-1 sm:gap-2 w-fit">
                    <span className="text-xs sm:text-base">Add To Cart</span>
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
            )}
        </Button>
    );
};

const Offer = ({ timeLeft }) => {
    return (
        <motion.div className="flex flex-row gap-2 sm:gap-4 items-center">
            <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <h3 className="text-small">Limited Time Offer:</h3>
            </div>
            <motion.div
                className="flex justify-end items-center gap-2 sm:gap-3 my-2 sm:my-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <AnimatedGradientText
                    text={`${timeLeft?.days}D :${timeLeft?.hours}H :${timeLeft?.minutes}M :${timeLeft?.seconds}S`}
                    className="text-lg sm:text-2xl font-semibold"
                />
            </motion.div>
        </motion.div>
    )
}

const SizeStocks = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState("");

    return (
        <motion.div className="gap-2 flex flex-col">
            <motion.div className="flex flex-wrap gap-2 sm:gap-4 w-full">
                {product?.stock?.map(({ size, quantity }) => (
                    <motion.div
                        className="flex flex-col items-start gap-1 w-fit sm:w-auto min-w-[80px] max-w-[120px] sm:min-w-20"
                        key={size}
                    >
                        <Button
                            className={`rounded-xs outline ${selectedSize === size ? "bg-accent-default outline-accent-default" : "outline-border text-primary-default"} w-full min-w-[60px] sm:min-w-20 hover:bg-primary-default/10 transition-all font-heading ease-in-out select-none text-xs sm:text-base py-2 sm:py-2.5`}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </Button>
                        <span className="text-muted-foreground/70 text-xs">
                            {quantity} left
                        </span>
                    </motion.div>
                ))}
            </motion.div>
            <motion.div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 justify-between w-full">
                <h3 className="text-small flex items-center">
                    Sizes:
                    {selectedSize && (
                        <Badge className="mx-2 text-xs bg-primary-default">
                            {selectedSize}
                        </Badge>
                    )}
                </h3>
                <SizeGuide />
            </motion.div>
        </motion.div>
    );
};

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
        <motion.div className="flex flex-col gap-2 w-full">
            <h3 className="text-small flex items-center gap-2">Check Delivery</h3>
            <motion.div className="flex flex-col sm:flex-row gap-2 w-full">
                <Input
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={handleInputChange}
                    className={`
                        ${error ? "border-destructive-default" : "border-border outline-hidden focus-visible:bg-transparent"}
                        rounded-xs focus:border-accent-default
                        w-full sm:w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3
                        text-sm sm:text-base
                    `}
                    maxLength={6}
                    disabled={isLoading}
                />
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                {isLoading && <p className="text-muted-foreground text-sm">Checking...</p>}
                {error && <p className="text-destructive-default text-sm">{error}</p>}
                {deliveryEstimate && !isLoading && (
                    <p className="text-sm text-muted-foreground flex items-center w-fit gap-2">
                        Estimated delivery:
                        <Truck className="w-4 h-4" />
                        {deliveryEstimate} business days
                    </p>
                )}
            </div>
        </motion.div>
    );
};

const EMI = ({ price, interestRate = 16 }) => {
    const emiOptions = calculateEMI(price, [3, 6, 9, 12, 18, 24], interestRate);

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="emi">
                <AccordionTrigger className="hover:no-underline text-small">
                    <span className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        EMI & Pay Later Options
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png"
                            alt="UPI Logo"
                            className="max-w-10 w-10 sm:max-w-12 sm:w-12"
                            width={500}
                            height={500}
                        />
                    </span>
                </AccordionTrigger>
                <AccordionContent>
                    <p className="mb-2 text-xs sm:text-sm text-muted-foreground">
                        Pay in easy installments with <strong>{interestRate}%</strong> interest.
                    </p>
                    <div className="overflow-x-auto w-full">
                        <Table className="min-w-[400px] sm:min-w-0 w-full text-xs sm:text-sm">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="whitespace-nowrap">EMI Plan</TableHead>
                                    <TableHead className="whitespace-nowrap">Interest (pa)</TableHead>
                                    <TableHead className="whitespace-nowrap">Discount</TableHead>
                                    <TableHead className="whitespace-nowrap">Total Cost</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(emiOptions).map(([months, emiData]) => {
                                    const totalAfterInterest = emiData.emi * months;
                                    const discount = emiData.interest;

                                    return (
                                        <TableRow key={months}>
                                            <TableCell className="whitespace-nowrap">
                                                <strong>₹{emiData.emi}</strong> × {months}m
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                ₹{emiData.interest} ({interestRate}%)
                                            </TableCell>
                                            <TableCell className="text-destructive-default whitespace-nowrap">
                                                - ₹{discount}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">₹{price}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
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
        <motion.div className="flex items-center gap-2 text-xs flex-wrap">
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
                <DialogContent className="max-h-[80vh] overflow-y-auto w-full sm:w-[90vw] md:w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Size Guide</DialogTitle>
                        <DialogDescription>
                            Find your perfect fit with our size chart and measurement tips.
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <motion.div className="flex flex-col gap-6 sm:flex-row sm:gap-8 w-full">
                        <Tabs defaultValue="us" className="w-full sm:w-2/3">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5 } }}>
                                <TabsList className="flex flex-wrap sm:flex-nowrap justify-between gap-2">
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
                                        <div className="overflow-x-auto">
                                            <Table className="min-w-[350px] w-full text-xs sm:text-sm">
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
                                        </div>
                                    </motion.div>
                                </TabsContent>
                            ))}
                        </Tabs>
                        <motion.div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start">
                            <motion.div {...fadeInOut} className="w-full">
                                <h3 className="text-description font-semibold">How to Measure</h3>
                                <p className="text-xs text-gray-600">Use a measuring tape and follow these simple steps:</p>
                                <ul className="list-none space-y-2 text-xs my-4 text-gray-600">
                                    {measurements.map(({ label, icon, description }) => (
                                        <li key={label} className="flex items-center gap-2">
                                            <span className="shrink-0">{icon}</span>
                                            <span className="font-medium">{label}:</span>
                                            <span className="text-xs text-gray-500">{description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                            <motion.div {...fadeInOut} className="text-center mt-4 w-full">
                                <Image
                                    src="https://img.freepik.com/free-vector/women-waist-with-measuring-tape-weight-loss-diet-waistline-icon-line-art-graphic-elements_460848-11528.jpg?t=st=1740129812~exp=1740133412~hmac=047cbdfaecf09cc0da66bb0ef1b85aa1bbcb5279f7c294cf0ad7076c8a58ee88&w=826"
                                    alt="Size Guide"
                                    width={500}
                                    height={500}
                                    className="mx-auto w-full max-w-[250px] object-cover max-h-[200px] sm:max-h-[250px] rounded-xs border border-gray-300"
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
