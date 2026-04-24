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
import { SafeImage } from '@/components/ui/safe-image';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  addresses: Array<{
    id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    items: number;
  }>;
  wishlist: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
  }>;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem('authToken');
    const userData = sessionStorage.getItem('userData');
    
    if (!token || !userData) {
      router.push('/auth/signin?return=/account');
      return;
    }

    // Load user profile with live account data
    void loadAccountData(token, userData);
  }, [router]);

  const loadAccountData = async (token: string, rawUserData: string) => {
    setLoading(true);

    try {
      const parsedUser = JSON.parse(rawUserData) as Partial<UserProfile>;

      const [ordersResponse, addressesResponse] = await Promise.all([
        fetch('/api/account/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }),
        fetch('/api/account/addresses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }),
      ]);

      const ordersData = ordersResponse.ok ? await ordersResponse.json() : [];
      const addressesData = addressesResponse.ok ? await addressesResponse.json() : [];

      const mappedOrders = Array.isArray(ordersData)
        ? ordersData.map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: String(order.status || '').toUpperCase(),
            total: Number(order.total || 0),
            createdAt: order.createdAt,
            items: Array.isArray(order.items)
              ? order.items.reduce(
                  (total: number, item: { quantity?: number }) => total + Number(item.quantity || 0),
                  0
                )
              : 0,
          }))
        : [];

      const mappedAddresses = Array.isArray(addressesData)
        ? addressesData.map((address: any) => ({
            id: address.id,
            type: address.type || 'Address',
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
            isDefault: Boolean(address.isDefault),
          }))
        : [];

      setUser({
        id: parsedUser.id || '',
        name: parsedUser.name || 'Customer',
        email: parsedUser.email || '',
        phone: parsedUser.phone,
        createdAt: parsedUser.createdAt || new Date().toISOString(),
        orders: mappedOrders,
        addresses: mappedAddresses,
        wishlist: Array.isArray(parsedUser.wishlist) ? parsedUser.wishlist : [],
      });
    } catch (error) {
      console.error('Failed to load account data:', error);
      toast.error('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (response.ok) {
        toast.success('Password changed successfully');
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />;
      case 'PROCESSING':
        return <Clock className="w-4 h-4" />;
      case 'CANCELLED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile, orders, and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">Customer</Badge>
                </div>
                
                <Separator className="my-6" />
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'dashboard' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'orders' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Orders</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'wishlist' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'addresses' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Addresses</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </nav>
                
                <Separator className="my-6" />
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {user.orders?.length || 0}
                        </div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {user.wishlist?.length || 0}
                        </div>
                        <p className="text-sm text-gray-600">Wishlist Items</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {user.addresses?.length || 0}
                        </div>
                        <p className="text-sm text-gray-600">Saved Addresses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.orders && user.orders.length > 0 ? (
                      <div className="space-y-4">
                        {user.orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold">{order.orderNumber}</h4>
                                <Badge className={getStatusColor(order.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(order.status)}
                                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                  </div>
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {order.items} items • ${order.total.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/track-order?order=${order.orderNumber}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/account/orders">View All Orders</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-4">Start shopping to see your order history</p>
                        <Button asChild>
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {user.orders && user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{order.orderNumber}</h4>
                              <p className="text-sm text-gray-600">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(order.status)}
                                <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                              </div>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">{order.items} items</p>
                              <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/track-order?order=${order.orderNumber}`}>
                                  Track Order
                                </Link>
                              </Button>
                              <Button size="sm" asChild>
                                <Link href={`/account/orders/${order.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">Start shopping to see your order history</p>
                      <Button asChild>
                        <Link href="/products">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'wishlist' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  {user.wishlist && user.wishlist.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.wishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <SafeImage
                            src={item.image || '/placeholder-product.svg'}
                            alt={item.name}
                            width={320}
                            height={192}
                            sizes="(max-width: 768px) 100vw, 320px"
                            className="w-full h-48 object-cover rounded mb-4"
                            fallbackSrc="/placeholder-product.svg"
                          />
                          <h4 className="font-semibold mb-2 line-clamp-2">{item.name}</h4>
                          <p className="text-lg font-bold text-primary mb-4">${item.price.toFixed(2)}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-4">Save items you love to your wishlist</p>
                      <Button asChild>
                        <Link href="/products">Browse Products</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'addresses' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Shipping Addresses</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </CardHeader>
                <CardContent>
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {user.addresses.map((address) => (
                        <div key={address.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{address.type}</h4>
                                {address.isDefault && (
                                  <Badge variant="secondary">Default</Badge>
                                )}
                              </div>
                              <p className="text-gray-600">
                                {address.street}<br />
                                {address.city}, {address.state} {address.zip}<br />
                                {address.country}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                      <p className="text-gray-600 mb-4">Add your shipping addresses for faster checkout</p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={user.name}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={user.phone || ''}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!showPasswordForm ? (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPasswordForm(true)}
                      >
                        Change Password
                      </Button>
                    ) : (
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPasswords.current ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPasswords.new ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPasswords.confirm ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button type="submit">Update Password</Button>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive order updates and promotions</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Get text alerts for your orders</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-gray-600">Receive special offers and new product updates</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}