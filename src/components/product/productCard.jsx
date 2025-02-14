import React from "react";
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

const ProductCard = ({ product }) => {
  return (
    <motion.div>
      <Card className="w-full md:w-60 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105">
        <CardHeader>
          <Image
            width={500}
            height={500}
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-cover rounded-t-xl"
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold mb-2">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 mb-4">
            {product.description}
          </CardDescription>
          <motion.div className="flex items-center justify-between">
            <span className="text-xl font-bold">${product.price}</span>
          </motion.div>
        </CardContent>
        <CardFooter>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
