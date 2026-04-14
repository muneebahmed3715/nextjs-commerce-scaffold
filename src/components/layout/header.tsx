'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, User, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/safe-image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/stores/cart-store';

interface StoredUser {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const router = useRouter();
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const hydrateFromServer = useCartStore((state) => state.hydrateFromServer);

  useEffect(() => {
    void hydrateFromServer();
  }, [hydrateFromServer]);

  useEffect(() => {
    const getInitial = (user: StoredUser | null) => {
      const rawValue = user?.name?.trim() || user?.email?.trim() || '';
      return rawValue ? rawValue.charAt(0).toUpperCase() : '';
    };

    const refreshAuthState = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (!token || !userData) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserInitial('');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData) as StoredUser;
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setUserInitial(getInitial(parsedUser));
      } catch {
        setIsAuthenticated(true);
        setIsAdmin(false);
        setUserInitial('A');
      }
    };

    refreshAuthState();
    window.addEventListener('storage', refreshAuthState);
    window.addEventListener('auth-state-changed', refreshAuthState);

    return () => {
      window.removeEventListener('storage', refreshAuthState);
      window.removeEventListener('auth-state-changed', refreshAuthState);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.dispatchEvent(new Event('auth-state-changed'));
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserInitial('');
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <SafeImage
                src="/logo.svg"
                alt="ECommerce Logo"
                fill
                sizes="32px"
                className="object-contain"
                fallbackSrc="/logo.svg"
              />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              ShopHub
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=electronics">Electronics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=clothing">Clothing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=home-garden">Home & Garden</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?category=sports-outdoors">Sports & Outdoors</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/deals" className="text-sm font-medium hover:text-primary">
              Deals
            </Link>
            
            <Link href="/suppliers" className="text-sm font-medium hover:text-primary">
              Suppliers
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {isAuthenticated ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-primary text-sm font-semibold text-primary-foreground">
                      {userInitial || 'A'}
                    </span>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}