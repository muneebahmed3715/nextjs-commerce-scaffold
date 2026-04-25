import { ShieldCheck, Truck, Headset, Leaf } from 'lucide-react';

const highlights = [
  {
    title: 'Verified Suppliers',
    description: 'Every vendor is screened for quality, reliability, and transparent pricing.',
    icon: ShieldCheck,
  },
  {
    title: 'Global Logistics',
    description: 'Ship from trusted regions with clear ETAs and order tracking from checkout to delivery.',
    icon: Truck,
  },
  {
    title: 'Dedicated Support',
    description: 'Get fast help for sourcing, order updates, and returns with human-first support.',
    icon: Headset,
  },
  {
    title: 'Sustainable Choices',
    description: 'Find products from suppliers focused on lower-impact materials and packaging.',
    icon: Leaf,
  },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-slate-50 py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">About ShopHub</p>
            <h2 className="text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
              A modern sourcing platform built for speed, trust, and better buying decisions.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
              ShopHub helps businesses and individuals compare products, connect with reliable suppliers,
              and place orders confidently. We focus on practical tools, transparent pricing, and a smooth
              shopping experience on every device.
            </p>
          </div>

          {/* Grid-based feature cards keep hierarchy clear from mobile to desktop. */}
          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-slate-100 p-2.5 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
