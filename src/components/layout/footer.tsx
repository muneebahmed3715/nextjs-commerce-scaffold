import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/ui/safe-image';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  MapPin,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <SafeImage
                    src="/logo.svg"
                    alt="ShopHub Logo"
                    fill
                    sizes="32px"
                    className="object-contain filter brightness-0 invert"
                    fallbackSrc="/logo.svg"
                  />
                </div>
                <span className="font-bold text-xl text-white">ShopHub</span>
              </div>
              
              <p className="text-gray-400">
                Your trusted marketplace for quality products from verified suppliers worldwide.
              </p>
              
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/deals" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Special Deals
                  </Link>
                </li>
                <li>
                  <Link href="/suppliers" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Become a Supplier
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-white font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-gray-400 shrink-0" />
                  <span className="text-gray-400">
                    123 Commerce Street<br />
                    New York, NY 10001<br />
                    United States
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-400">support@shophub.com</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">We Accept</h4>
                <div className="flex space-x-2">
                  <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
                    AMEX
                  </div>
                  <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
                    PP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suppliers by Region */}
        <div className="border-t border-gray-800 py-8">
          <div className="text-center mb-6">
            <h3 className="text-white font-semibold mb-2">Suppliers by Region</h3>
            <p className="text-gray-400">Connect with suppliers from around the world</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
            <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              <div className="font-medium">UAE</div>
              <div className="text-xs">Dubai</div>
            </div>
            <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              <div className="font-medium">USA</div>
              <div className="text-xs">New York</div>
            </div>
            <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              <div className="font-medium">UK</div>
              <div className="text-xs">London</div>
            </div>
            <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              <div className="font-medium">Australia</div>
              <div className="text-xs">Sydney</div>
            </div>
            <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              <div className="font-medium">Germany</div>
              <div className="text-xs">Berlin</div>
            </div>
            <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              <div className="font-medium">China</div>
              <div className="text-xs">Shanghai</div>
            </div>
            <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              <div className="font-medium">India</div>
              <div className="text-xs">Mumbai</div>
            </div>
            <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              <div className="font-medium">Brazil</div>
              <div className="text-xs">São Paulo</div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} ShopHub. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}