'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        toast.success('Successfully subscribed to newsletter!');
        setEmail('');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-foreground/20 p-4 rounded-full">
              <Mail className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Stay Updated with Latest Deals
          </h2>
          
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, 
            exclusive deals, and special offers.
          </p>

          <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
            <CardContent className="p-8">
              {isSubscribed ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h3 className="text-2xl font-semibold mb-2">Thank You for Subscribing!</h3>
                  <p className="text-primary-foreground/80">
                    Check your email for a confirmation message.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-background border-primary-foreground/20 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-background text-primary hover:bg-background/90"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
              )}
              
              <p className="text-xs text-primary-foreground/60 mt-6 text-center">
                By subscribing, you agree to receive marketing emails from us. 
                We respect your privacy and you can unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}