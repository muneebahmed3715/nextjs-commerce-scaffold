'use client';

import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Building, 
  Send, 
  Users,
  Globe,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toaster';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  region: string;
  country: string;
  isActive: boolean;
  createdAt: string;
}

const regions = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Middle East',
  'South America',
  'Africa',
];

const countries = [
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Australia',
  'Germany',
  'China',
  'India',
  'Brazil',
  'Canada',
  'France',
  'Japan',
  'South Korea',
];

function SuppliersPageContent() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    region: '',
    country: '',
    message: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.region || !formData.country) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Supplier request submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          region: '',
          country: '',
          message: '',
        });
        fetchSuppliers(); // Refresh the suppliers list
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit request');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Connect with Global Suppliers
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Send requests to verified suppliers worldwide and get the best prices for your products
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{suppliers.length}+</div>
                <div className="text-blue-100">Active Suppliers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-100">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-blue-100">Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-blue-100">Verified</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Supplier Request Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Send Supplier Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company
                      </label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Region *
                      </label>
                      <Select 
                        value={formData.region} 
                        onValueChange={(value) => handleInputChange('region', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Country *
                      </label>
                      <Select 
                        value={formData.country} 
                        onValueChange={(value) => handleInputChange('country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your requirements..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Send Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Suppliers by Region */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Suppliers by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suppliers.slice(0, 8).map((supplier) => (
                      <div key={supplier.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {supplier.name}
                            </h4>
                            {supplier.company && (
                              <p className="text-sm text-gray-600">
                                {supplier.company}
                              </p>
                            )}
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {supplier.region}, {supplier.country}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {suppliers.length > 8 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        And {suppliers.length - 8} more suppliers...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Why Partner With Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Verified Suppliers</p>
                    <p className="text-sm text-gray-600">All suppliers are thoroughly vetted</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Best Prices</p>
                    <p className="text-sm text-gray-600">Competitive pricing from global sources</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Quality Assurance</p>
                    <p className="text-sm text-gray-600">High-quality products guaranteed</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">24/7 Support</p>
                    <p className="text-sm text-gray-600">Round-the-clock customer service</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl p-8 mb-12 h-64"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gray-200 rounded-lg h-96"></div>
              <div className="bg-gray-200 rounded-lg h-96"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SuppliersPageContent />
    </Suspense>
  );
}