'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Package,
  ShoppingBag,
  Users,
  Truck,
  Bell,
  RefreshCcw,
} from 'lucide-react';
import { toast } from 'sonner';

type DashboardData = {
  metrics: {
    usersCount: number;
    productsCount: number;
    ordersCount: number;
    suppliersCount: number;
    notificationsCount: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    itemCount: number;
    customerName: string;
  }>;
  recentProducts: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    category: {
      name: string;
      slug: string;
    };
  }>;
};

type SupplierNotificationItem = {
  id: string;
  type: 'CART_ADD' | 'NEW_ORDER';
  message: string;
  quantity: number | null;
  customerName: string | null;
  createdAt: string;
  supplier: {
    name: string;
    email: string;
  };
  product: {
    name: string;
  } | null;
};

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

function statusBadgeClass(status: string) {
  switch (status) {
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
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [setupForm, setSetupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState<string>('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [notifications, setNotifications] = useState<SupplierNotificationItem[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string>('');

  const metrics = useMemo(() => {
    if (!data) {
      return [
        { label: 'Users', value: 0, icon: Users },
        { label: 'Products', value: 0, icon: Package },
        { label: 'Orders', value: 0, icon: ShoppingBag },
        { label: 'Suppliers', value: 0, icon: Truck },
        { label: 'Notifications', value: 0, icon: Bell },
      ];
    }

    return [
      { label: 'Users', value: data.metrics.usersCount, icon: Users },
      { label: 'Products', value: data.metrics.productsCount, icon: Package },
      { label: 'Orders', value: data.metrics.ordersCount, icon: ShoppingBag },
      { label: 'Suppliers', value: data.metrics.suppliersCount, icon: Truck },
      {
        label: 'Notifications',
        value: data.metrics.notificationsCount,
        icon: Bell,
      },
    ];
  }, [data]);

  const loadAdminData = async (authToken: string) => {
    try {
      const [dashboardResponse, notificationsResponse] = await Promise.all([
        fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${authToken}` },
          cache: 'no-store',
        }),
        fetch('/api/admin/supplier-notifications', {
          headers: { Authorization: `Bearer ${authToken}` },
          cache: 'no-store',
        }),
      ]);

      if (dashboardResponse.status === 401 || dashboardResponse.status === 403) {
        toast.error('Admin access required');
        router.push('/');
        return;
      }

      if (!dashboardResponse.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const dashboardData = (await dashboardResponse.json()) as DashboardData;
      setData(dashboardData);

      if (notificationsResponse.ok) {
        setNotifications((await notificationsResponse.json()) as SupplierNotificationItem[]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load admin panel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAdminPage = async () => {
      try {
        const setupResponse = await fetch('/api/admin/setup', { cache: 'no-store' });
        const setupData = setupResponse.ok
          ? ((await setupResponse.json()) as { hasAdmin: boolean })
          : { hasAdmin: true };

        if (!setupData.hasAdmin) {
          setSetupMode(true);
          setLoading(false);
          return;
        }

        const authToken = sessionStorage.getItem('authToken') || '';
        const userDataRaw = sessionStorage.getItem('userData') || '';

        if (!authToken || !userDataRaw) {
          router.push('/auth/signin?return=/admin');
          return;
        }

        try {
          const userData = JSON.parse(userDataRaw) as { role?: string };
          if (userData.role !== 'ADMIN') {
            toast.error('Admin access required');
            router.push('/');
            return;
          }
        } catch {
          router.push('/auth/signin?return=/admin');
          return;
        }

        setToken(authToken);
        await loadAdminData(authToken);
      } catch (error) {
        console.error(error);
        toast.error('Failed to initialize admin page');
        setLoading(false);
      }
    };

    void initializeAdminPage();
  }, [router]);

  const handleCreateAdminAccount = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = setupForm.name.trim();
    const email = setupForm.email.trim();
    const password = setupForm.password;
    const confirmPassword = setupForm.confirmPassword;

    if (!name || !email || !password) {
      toast.error('Please fill all required fields');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setCreatingAdmin(true);
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create admin account');
      }

      toast.success('Admin account created successfully. Please sign in.');
      router.push('/auth/signin?return=/admin');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create admin account');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleRefresh = async () => {
    if (!token) return;
    setLoading(true);
    await loadAdminData(token);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    if (!token) return;
    setUpdatingOrderId(orderId);

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update status');
      }

      toast.success(`Order ${result.orderNumber} updated to ${result.status}`);
      await loadAdminData(token);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update order');
    } finally {
      setUpdatingOrderId('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-56 rounded bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-28 rounded bg-gray-200" />
              ))}
            </div>
            <div className="h-80 rounded bg-gray-200" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (setupMode) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Create Admin Account</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-600">
                  No admin account exists yet. Create one to access the admin panel.
                </p>
                <form className="space-y-4" onSubmit={handleCreateAdminAccount}>
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Name</Label>
                    <Input
                      id="admin-name"
                      value={setupForm.name}
                      onChange={(event) =>
                        setSetupForm((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Admin Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={setupForm.email}
                      onChange={(event) =>
                        setSetupForm((previous) => ({
                          ...previous,
                          email: event.target.value,
                        }))
                      }
                      placeholder="admin@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={setupForm.password}
                      onChange={(event) =>
                        setSetupForm((previous) => ({
                          ...previous,
                          password: event.target.value,
                        }))
                      }
                      placeholder="Minimum 8 characters"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-confirm-password">Confirm Password</Label>
                    <Input
                      id="admin-confirm-password"
                      type="password"
                      value={setupForm.confirmPassword}
                      onChange={(event) =>
                        setSetupForm((previous) => ({
                          ...previous,
                          confirmPassword: event.target.value,
                        }))
                      }
                      placeholder="Repeat your password"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={creatingAdmin}>
                    {creatingAdmin ? 'Creating Admin...' : 'Create Admin Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-600">Manage store operations and monitor activity</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-600">{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{item.value}</p>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data?.recentOrders || []).length === 0 ? (
                <p className="text-sm text-gray-500">No recent orders.</p>
              ) : (
                data?.recentOrders.map((order) => (
                  <div key={order.id} className="rounded border p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-xs text-gray-600">{order.customerName}</p>
                      </div>
                      <Badge className={statusBadgeClass(order.status)}>{order.status}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>${order.total.toFixed(2)} • {order.itemCount} items</span>
                      <span className="text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        className="h-8 rounded border px-2 text-sm"
                        defaultValue={order.status}
                        onChange={(event) =>
                          void handleUpdateOrderStatus(order.id, event.target.value)
                        }
                        disabled={updatingOrderId === order.id}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {updatingOrderId === order.id && (
                        <span className="text-xs text-gray-500">Updating...</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data?.recentProducts || []).length === 0 ? (
                <p className="text-sm text-gray-500">No recent products.</p>
              ) : (
                data?.recentProducts.map((product) => (
                  <div key={product.id} className="rounded border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{product.name}</p>
                      <Badge variant="secondary">{product.category.name}</Badge>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm text-gray-600">
                      <span>${product.price.toFixed(2)}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="rounded border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{notification.supplier.name}</p>
                      <p className="text-sm text-gray-700">{notification.message}</p>
                    </div>
                    <Badge variant="outline">{notification.type}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
