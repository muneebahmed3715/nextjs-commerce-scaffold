import { db } from '@/lib/db';

const prisma = db as any;

type SupplierNotificationInput = {
  productId: string;
  quantity: number;
  customerName?: string | null;
};

const includeCustomerName =
  process.env.SUPPLIER_NOTIFICATION_INCLUDE_CUSTOMER_NAME !== 'false';

function sanitizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }
  return Math.max(1, Math.floor(quantity));
}

export async function notifySupplierItemAddedToCart({
  productId,
  quantity,
  customerName,
}: SupplierNotificationInput) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      supplier: true,
    },
  });

  if (!product || !product.supplierId || !product.supplier) {
    return null;
  }

  const qty = sanitizeQuantity(quantity);
  const timestamp = new Date().toISOString();
  const actor =
    includeCustomerName && customerName?.trim()
      ? customerName.trim()
      : 'A customer';

  const message = `${actor} has added your product '${product.name}' (Qty: ${qty}) to their cart at ${timestamp}.`;

  return prisma.supplierNotification.create({
    data: {
      supplierId: product.supplierId,
      productId: product.id,
      type: 'CART_ADD',
      quantity: qty,
      customerName: includeCustomerName ? customerName?.trim() || null : null,
      message,
    },
  });
}

export async function notifySupplierNewOrder({
  productId,
  quantity,
  customerName,
}: SupplierNotificationInput) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      supplier: true,
    },
  });

  if (!product || !product.supplierId || !product.supplier) {
    return null;
  }

  const qty = sanitizeQuantity(quantity);
  const message = `You have received a new order for ${product.name}.`;

  return prisma.supplierNotification.create({
    data: {
      supplierId: product.supplierId,
      productId: product.id,
      type: 'NEW_ORDER',
      quantity: qty,
      customerName: includeCustomerName ? customerName?.trim() || null : null,
      message,
    },
  });
}
