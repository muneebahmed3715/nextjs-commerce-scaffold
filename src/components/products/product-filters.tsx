'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { VALID_CATEGORY_SLUGS } from '@/lib/product-categories';

interface ProductFiltersProps {
  filters: {
    category: string;
    priceRange: [number, number];
    inStock: boolean;
  };
  categoryCounts: Record<string, number>;
  onFiltersChange: (filters: any) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Electronics',
  clothing: 'Clothing',
  'home-garden': 'Home & Garden',
  'sports-outdoors': 'Sports & Outdoors',
};

export function ProductFilters({ filters, categoryCounts, onFiltersChange }: ProductFiltersProps) {
  const categories = VALID_CATEGORY_SLUGS.map((slug) => ({
    id: slug,
    name: CATEGORY_LABELS[slug] ?? slug,
    count: categoryCounts[slug] ?? 0,
  }));

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? categoryId : '',
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      priceRange: [0, 1000],
      inStock: true,
    });
  };

  const hasActiveFilters = filters.category || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 || !filters.inStock;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.category === category.id}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <label 
                htmlFor={category.id} 
                className="flex items-center justify-between flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={handlePriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stock Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={handleInStockChange}
            />
            <label 
              htmlFor="inStock" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              In Stock Only
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filters.category && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Category: {categories.find(c => c.id === filters.category)?.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCategoryChange(filters.category, false)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handlePriceRangeChange([0, 1000])}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {!filters.inStock && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Include out of stock</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleInStockChange(true)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}