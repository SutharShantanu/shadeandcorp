import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, ZoomIn, Clock, Users } from "lucide-react";

const ProductPage = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);

  const product = {
    name: "Premium Leather Jacket",
    price: 199.99,
    images: ["/image1.jpg", "/image2.jpg", "/image3.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000000", "#FF0000", "#00FF00", "#0000FF"],
    emiOptions: ["3 Months", "6 Months", "12 Months"],
    offerEndTime: "2023-12-31T23:59:59",
    totalBuyers: 1234,
    stock: 10,
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="relative">
          <motion.div
            className="cursor-zoom-in"
            whileHover={{ scale: isZoomed ? 1.1 : 1 }}
            onHoverStart={handleZoom}
            onHoverEnd={handleZoom}
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </motion.div>
          <div className="flex gap-2 mt-4">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-16 h-16 rounded-lg cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">${product.price}</p>

          {/* Sizes */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Select Size</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">{product.stock} items left</p>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Select Color</h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                    selectedColor === color ? "border-black" : "border-transparent"
                  }`}
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
                {product.emiOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pincode Check */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Check Delivery</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
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
            <Button variant="outline" onClick={handleWishlist}>
              <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>

          {/* Add to Cart */}
          <Button className="w-full">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;