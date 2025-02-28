import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ScrollArea } from '../ui/scroll-area';
import { motion } from 'framer-motion';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';

const FilterSection = ({ title, items, searchTerm, setSearchTerm }) => {
  const filteredItems = items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AccordionItem value={title.toLowerCase()} className="border-none">
      <AccordionTrigger className="text-foreground text-small font-description hover:no-underline py-2">{title}</AccordionTrigger>
      <AccordionContent>
        {setSearchTerm && (
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${title}`}
            className="mb-2 py-0 rounded-xs h-8 border-none bg-primary-default/10"
          />
        )}
        {filteredItems.map((item) => (
          <div key={item} className="flex items-center space-x-2 my-2">
            <Checkbox id={item} className="border-primary-default/50 rounded-xs" />
            <Label htmlFor={item} className="text-foreground text-xs">{item}</Label>
          </div>
        ))}
        <Separator className="mt-4" />
      </AccordionContent>
    </AccordionItem>
  );
};

const FilterBar = () => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchColor, setSearchColor] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchSize, setSearchSize] = useState('');

  const filters = [
    { title: 'Gender', items: ['Men', 'Women', 'Unisex'] },
    { title: 'Category', items: ['T-Shirts', 'Jeans', 'Dresses', 'Shoes', 'Accessories'] },
    { title: 'Color', items: ['Red', 'Blue', 'Green', 'Black', 'White'], searchTerm: searchColor, setSearchTerm: setSearchColor },
    { title: 'Size', items: ['S', 'M', 'L', 'XL', 'XXL'], searchTerm: searchSize, setSearchTerm: setSearchSize },
    { title: 'Brand', items: ['Nike', 'Adidas', 'Puma', 'Reebok'], searchTerm: searchBrand, setSearchTerm: setSearchBrand }
  ];

  return (
    <ScrollArea className="h-fit w-1/6 rounded-xs border border-border bg-background">
      <motion.div className="p-4">
        <h2 className="text-description font-semibold text-primary-default">Filters</h2>
        <Separator className="my-2" />
        <Accordion type="multiple" defaultValue={filters.map(filter => filter.title.toLowerCase())} className="w-full">
          {filters.map(({ title, items, searchTerm, setSearchTerm }) => (
            <FilterSection key={title} title={title} items={items} searchTerm={searchTerm || ''} setSearchTerm={setSearchTerm} />
          ))}
          <AccordionItem value="price" className="border-none">
            <AccordionTrigger className="text-foreground text-small font-description hover:no-underline py-2">
              Price Range
            </AccordionTrigger>
            <AccordionContent>
              <Slider
                defaultValue={[0, 100]}
                value={priceRange}
                onValueChange={setPriceRange}
                max={100}
                step={1}
                className="w-full mt-2"
              />

              <motion.div className="flex justify-between text-xs text-foreground mt-2 select-none">
                <div className="relative w-24">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-small text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Math.max(0, Number(e.target.value)), priceRange[1]])}
                    className="w-full pl-6 pr-2 text-center h-8 select-none"
                  />
                </div>
                <div className="relative w-24">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-small text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Math.min(100, Number(e.target.value))])}
                    className="w-full pl-6 pr-2 text-center h-8 select-none"
                  />
                </div>
              </motion.div>

              <Separator className="mt-4" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </ScrollArea>
  );
};

export default FilterBar;
