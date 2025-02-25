import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Slider } from "../ui/slider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { ScrollArea } from '../ui/scroll-area';
import { motion } from "framer-motion"
import { Separator } from '../ui/separator';
import { Input } from "../ui/input"; // Assuming you're using Chakra UI or a custom Input component

const FilterBar = () => {
  const genders = ['Men', 'Women', 'Unisex'];
  const categories = ['T-Shirts', 'Jeans', 'Dresses', 'Shoes', 'Accessories'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const [brands, setBrands] = useState(['Nike', 'Adidas', 'Puma', 'Reebok']);

  // State for price range slider
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchColor, setSearchColor] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchSize, setSearchSize] = useState('');

  // Handler for slider value change
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const filteredColors = colors.filter(color => color.toLowerCase().includes(searchColor.toLowerCase()));
  const filteredSizes = sizes.filter(size => size.toLowerCase().includes(searchSize.toLowerCase()));
  const filteredBrands = brands.filter(brand => brand.toLowerCase().includes(searchBrand.toLowerCase()));

  return (
    <ScrollArea className="h-fit w-1/6 rounded-xs border border-border bg-background">
      <motion.div className="p-4">
        <h2 className="text-subheading font-semibold text-foreground">Filters</h2>
        <Separator className="my-2" />

        <Accordion type="multiple" defaultValue={['gender', 'category', 'price', 'color', 'size']} className="w-full">
          <AccordionItem value="gender" className="border-none">
            <AccordionTrigger className="text-foreground text-small font-description hover:no-underline py-2">Gender</AccordionTrigger>
            <AccordionContent>
              {genders.map((gender) => (
                <motion.div key={gender} className="flex items-center space-x-2 my-2">
                  <Checkbox id={gender} className="border-primary-default/50 rounded-xs" />
                  <Label htmlFor={gender} className="text-foreground text-xs">{gender}</Label>
                </motion.div>
              ))}
              <Separator className="mt-4" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="category" className="border-none">
            <AccordionTrigger className="text-foreground text-small font-description hover:no-underline py-2">Category</AccordionTrigger>
            <AccordionContent>
              {categories.map((category) => (
                <motion.div key={category} className="flex items-center space-x-2 my-2">
                  <Checkbox id={category} className="border-primary-default/50 rounded-xs" />
                  <Label htmlFor={category} className="text-foreground text-xs">{category}</Label>
                </motion.div>
              ))}
              <Separator className="mt-4" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price" className="border-none">
            <AccordionTrigger className="text-foreground text-small font-description hover:no-underline py-2">Price Range</AccordionTrigger>
            <AccordionContent>
              <Slider
                defaultValue={[0, 100]}
                value={priceRange}
                onValueChange={handlePriceChange}
                max={100}
                step={1}
                className="w-full mt-2"
              />
              <motion.div className="flex justify-between text-xs text-foreground mt-2 select-none">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </motion.div>
              <Separator className="mt-4" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="color" className="border-none">
            <AccordionTrigger className="text-foreground text-small font-description hover:no-underline py-2">Color</AccordionTrigger>
            <AccordionContent>
              <Input
                value={searchColor}
                onChange={(e) => setSearchColor(e.target.value)}
                placeholder="Search Color"
                className="mb-2 py-0 rounded-xs h-8 border-none bg-primary-default/10"
              />
              {filteredColors.map((color) => (
                <div key={color} className="flex items-center space-x-2 mb-2">
                  <Checkbox id={color} className="border-primary-default/50 rounded-xs" />
                  <Label htmlFor={color} className="text-foreground">{color}</Label>
                </div>
              ))}
              <Separator className="mt-4" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="size" className="border-none">
            <AccordionTrigger className="text-foreground text-small font-description hover:no-underline py-1">Size</AccordionTrigger>
            <AccordionContent>
              <Input
                value={searchSize}
                onChange={(e) => setSearchSize(e.target.value)}
                placeholder="Search Size"
                className="mb-2 py-0 rounded-xs h-8 border-none bg-primary-default/10"
              />
              {filteredSizes.map((size) => (
                <div key={size} className="flex items-center space-x-2 my-2 cursor-pointer w-full">
                  <Checkbox id={size} className="border-primary-default/50 rounded-xs" />
                  <Label htmlFor={size} className="text-foreground w-full ">{size}</Label>
                </div>
              ))}
              <Separator className="mt-4" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand" className="border-none">
            <AccordionTrigger className="text-foreground text-small font-description hover:no-underline py-2">Brand</AccordionTrigger>
            <AccordionContent>
              <Input
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                placeholder="Search Brand"
                className="mb-2 py-0 rounded-xs h-8 border-none bg-primary-default/10"
              />
              {filteredBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2 mb-2">
                  <Checkbox id={brand} className="border-primary-default/50 rounded-xs" />
                  <Label htmlFor={brand} className="text-foreground">{brand}</Label>
                </div>
              ))}
              <Separator className="mt-4" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </ScrollArea>
  );
};

export default FilterBar;
