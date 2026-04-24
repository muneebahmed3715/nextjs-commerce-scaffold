'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import { SafeImage } from '@/components/ui/safe-image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  sku: string;
}

interface ShippingAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface GuestCheckoutDetails {
  name: string;
  email: string;
  phone: string;
}

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const [activeTab, setActiveTab] = useState('cart');
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [guestDetails, setGuestDetails] = useState<GuestCheckoutDetails>({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem('authToken');
    const userData = sessionStorage.getItem('userData');
    
    if (userData) {
      setUser(JSON.parse(userData));
      // Load user addresses
      loadAddresses();
    }

    // If cart is empty, redirect to products
    if (items.length === 0) {
      router.push('/products');
    }
  }, [items.length, router]);

  const loadAddresses = async () => {
    try {
      const response = await fetch('/api/account/addresses', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const addresses = await response.json();
        setShippingAddresses(addresses);
        // Set default address as selected
        const defaultAddr = addresses.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr.id);
        }
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };

  const calculateShipping = () => {
    const subtotal = getTotalPrice();
    if (subtotal >= 50) return 0;
    
    switch (shippingMethod) {
      case 'standard':
        return 5.99;
      case 'express':
        return 12.99;
      case 'overnight':
        return 24.99;
      default:
        return 5.99;
    }
  };

  const calculateTax = () => {
    return getTotalPrice() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return getTotalPrice() + calculateShipping() + calculateTax();
  };

  const handleCheckout = async () => {
    if (user && !selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    if (!user) {
      const trimmedName = guestDetails.name.trim();
      const trimmedEmail = guestDetails.email.trim();
      const trimmedPhone = guestDetails.phone.trim();

      if (!trimmedName || !trimmedEmail || !trimmedPhone) {
        toast.error('Please enter your name, email, and phone number');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const resolvedShippingAddress = user
        ? shippingAddresses.find((addr) => addr.id === selectedAddress)
        : {
            name: guestDetails.name.trim(),
            street: 'Guest checkout',
            city: 'N/A',
            state: 'N/A',
            zip: 'N/A',
            country: 'N/A',
            email: guestDetails.email.trim(),
            phone: guestDetails.phone.trim(),
          };

      const orderData = {
        items: items,
        shippingAddress: resolvedShippingAddress,
        shippingMethod,
        paymentMethod,
        subtotal: getTotalPrice(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        total: calculateTotal(),
        guestInfo: !user
          ? {
              name: guestDetails.name.trim(),
              email: guestDetails.email.trim(),
              phone: guestDetails.phone.trim(),
            }
          : undefined,
      };

      const authToken = sessionStorage.getItem('authToken');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        clearCart();
        window.alert('Your order has been placed successfully.');
        toast.success('Order placed successfully!');
        router.push(`/order-confirmation?order=${data.orderNumber}`);
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedAddressData = shippingAddresses.find(addr => addr.id === selectedAddress);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Shopping Cart ({getTotalItems()} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <SafeImage
                        src={item.image || '/placeholder-product.svg'}
                        alt={item.name}
                        width={80}
                        height={80}
                        sizes="80px"
                        className="w-20 h-20 object-cover rounded"
                        fallbackSrc="/placeholder-product.svg"
                      />
                      
                      <div className="flex-1">
                        <Link href={`/products/${item.slug}`}>
                          <h4 className="font-semibold hover:text-primary cursor-pointer">
                            {item.name}
                          </h4>
                        </Link>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/products">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>
                  <Button onClick={() => setActiveTab('checkout')}>
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {getTotalPrice() >= 50 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                </div>
                
                {getTotalPrice() >= 50 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Free shipping applied!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {activeTab === 'checkout' && (
              <>
                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user ? (
                      <>
                        {shippingAddresses.length > 0 ? (
                          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                            {shippingAddresses.map((address) => (
                              <div key={address.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                <RadioGroupItem value={address.id} id={address.id} />
                                <div className="flex-1">
                                  <Label htmlFor={address.id} className="cursor-pointer">
                                    <div className="font-medium">{address.name}</div>
                                    <div className="text-sm text-gray-600">
                                      {address.street}<br />
                                      {address.city}, {address.state} {address.zip}<br />
                                      {address.country}
                                    </div>
                                  </Label>
                                  {address.isDefault && (
                                    <Badge variant="secondary" className="mt-1">Default</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-600 mb-4">No shipping addresses saved</p>
                            <Button variant="outline" asChild>
                              <Link href="/account?tab=addresses">Add Address</Link>
                            </Button>
                          </div>
                        )}
                        
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/account?tab=addresses">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Address
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-lg border bg-blue-50 p-3 text-sm text-blue-800">
                          Guest checkout: please provide your name, email, and phone number.
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guest-name">Full Name</Label>
                          <Input
                            id="guest-name"
                            value={guestDetails.name}
                            onChange={(e) =>
                              setGuestDetails((previous) => ({
                                ...previous,
                                name: e.target.value,
                              }))
                            }
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guest-email">Email</Label>
                          <Input
                            id="guest-email"
                            type="email"
                            value={guestDetails.email}
                            onChange={(e) =>
                              setGuestDetails((previous) => ({
                                ...previous,
                                email: e.target.value,
                              }))
                            }
                            placeholder="john@example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guest-phone">Phone Number</Label>
                          <Input
                            id="guest-phone"
                            value={guestDetails.phone}
                            onChange={(e) =>
                              setGuestDetails((previous) => ({
                                ...previous,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="+1 555 123 4567"
                          />
                        </div>

                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/auth/signin?return=/cart">Sign In Instead</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="w-5 h-5 mr-2" />
                      Shipping Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Standard Shipping</div>
                                <div className="text-sm text-gray-600">5-7 business days</div>
                              </div>
                            </Label>
                          </div>
                          <span className="font-semibold">$5.99</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="express" id="express" />
                            <Label htmlFor="express" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Express Shipping</div>
                                <div className="text-sm text-gray-600">2-3 business days</div>
                              </div>
                            </Label>
                          </div>
                          <span className="font-semibold">$12.99</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="overnight" id="overnight" />
                            <Label htmlFor="overnight" className="cursor-pointer">
                              <div>
                                <div className="font-medium">Overnight Shipping</div>
                                <div className="text-sm text-gray-600">Next business day</div>
                              </div>
                            </Label>
                          </div>
                          <span className="font-semibold">$24.99</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="cursor-pointer">
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-gray-600">Visa, Mastercard, Amex, Discover</div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="cursor-pointer">
                            <div className="font-medium">PayPal</div>
                            <div className="text-sm text-gray-600">Fast, secure payment</div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="apple" id="apple" />
                          <Label htmlFor="apple" className="cursor-pointer">
                            <div className="font-medium">Apple Pay</div>
                            <div className="text-sm text-gray-600">Quick and easy</div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="google" id="google" />
                          <Label htmlFor="google" className="cursor-pointer">
                            <div className="font-medium">Google Pay</div>
                            <div className="text-sm text-gray-600">Simple checkout</div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Place Order Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={
                    isProcessing ||
                    (user
                      ? !selectedAddress
                      : !guestDetails.name.trim() ||
                        !guestDetails.email.trim() ||
                        !guestDetails.phone.trim())
                  }
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Place Order • ${calculateTotal().toFixed(2)}
                    </>
                  )}
                </Button>
                
                <div className="text-center text-xs text-gray-500 mt-4">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}