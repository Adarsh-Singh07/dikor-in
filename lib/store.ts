import { dikorDB, type DBOrder, type DBUser, type OrderStatus, type Category, type Role } from "./db";

export type { Role, Category, OrderStatus };
export type Order = DBOrder;
export type User = DBUser;
export type OrderEvent = DBOrder["events"][number];

export const PIPELINE_STEPS: { key: string; label: string; statuses: OrderStatus[]; blurb: string }[] = [
  {
    key: "photos",
    label: "Photos received",
    statuses: ["photos_received", "advance_pending"],
    blurb: "Your 4–5 reference photos are in — our studio studies every detail.",
  },
  {
    key: "advance",
    label: "75% advance paid",
    statuses: ["advance_paid"],
    blurb: "The advance confirms your order and reserves your production slot.",
  },
  {
    key: "production",
    label: "Printing & painting",
    statuses: ["in_production"],
    blurb: "Your piece is 3D-printed layer by layer, then hand-painted by our artists. Takes 4–5 days.",
  },
  {
    key: "approval",
    label: "Approval video shared",
    statuses: ["approval_shared", "changes_requested"],
    blurb: "We send photos or a video of the finished piece — you approve it before anything ships.",
  },
  {
    key: "approved",
    label: "You approved it",
    statuses: ["approved", "balance_pending"],
    blurb: "Perfect — you love it. Just the balance and we're off to shipping.",
  },
  {
    key: "balance",
    label: "25% balance paid",
    statuses: ["balance_paid"],
    blurb: "Balance cleared. Your keepsake is packed with care.",
  },
  {
    key: "shipped",
    label: "Shipped",
    statuses: ["shipped"],
    blurb: "On its way to your doorstep, anywhere in India.",
  },
  {
    key: "delivered",
    label: "Delivered",
    statuses: ["delivered"],
    blurb: "Delivered — enjoy your keepsake!",
  },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  photos_received: "Photos received",
  advance_pending: "Advance pending (75%)",
  advance_paid: "Advance paid (75%)",
  in_production: "Printing & painting",
  approval_shared: "Approval video shared",
  changes_requested: "Changes requested",
  approved: "Approved by customer",
  balance_pending: "Balance pending (25%)",
  balance_paid: "Balance paid (25%)",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Order cancelled",
};

export const CATEGORIES: { key: Category; tagline: string; from: string }[] = [
  { key: "Pets", tagline: "Lifelike replicas of your furry family", from: "₹1,500" },
  { key: "Couples", tagline: "Miniature you-two, for anniversaries & weddings", from: "₹2,499" },
  { key: "Kids", tagline: "Adorable keepsakes of little moments", from: "₹1,999" },
  { key: "Idols", tagline: "Hand-finished deities like Radha Krishna", from: "₹2,999" },
  { key: "Decor", tagline: "Custom showpieces for warm homes", from: "₹1,499" },
];

export const db = {
  findUserByEmail: async (email: string) => {
    return await dikorDB.findUserByEmail(email);
  },
  findUserByPhone: async (phone: string) => {
    return await dikorDB.findUserByPhone(phone);
  },
  getUser: async (id: string) => {
    const user = (await dikorDB.findUserByEmail("admin@dikor.in")) || (await dikorDB.findUserByEmail("customer@demo.in"));
    return user;
  },
  createUser: async (name: string, email?: string, password?: string, phone?: string) => {
    return await dikorDB.createUser({ name, email, password, phone, role: "customer" });
  },
  getOrders: async () => {
    return await dikorDB.getOrders();
  },
  getOrdersByUser: async (userId: string, email?: string | null) => {
    return await dikorDB.getOrdersByUser(userId, email);
  },
  getOrder: async (id: string) => {
    return await dikorDB.getOrder(id);
  },
  createOrder: async (data: {
    userId?: string | null;
    customerName?: string;
    customerEmail?: string | null;
    customerPhone?: string | null;
    source?: "web" | "whatsapp" | "instagram" | "manual_admin";
    title: string;
    category: Category;
    subjectName?: string;
    tagText?: string;
    description?: string;
    photos?: string[];
    size: string;
    price?: number | null;
    city?: string;
  }) => {
    return await dikorDB.createOrder({
      userId: data.userId,
      customerName: data.customerName || "Customer",
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      source: data.source || "web",
      title: data.title,
      category: data.category,
      subjectName: data.subjectName,
      tagText: data.tagText,
      description: data.description,
      photos: data.photos,
      size: data.size,
      totalPrice: data.price || 1500,
      city: data.city,
    });
  },
  updateOrder: async (id: string, patch: Partial<DBOrder>, eventNote?: string, by?: string) => {
    return await dikorDB.updateOrder(id, patch, eventNote, by);
  },
  claimGuestOrders: async (userId: string, email?: string | null, phone?: string | null) => {
    return await dikorDB.claimGuestOrders(userId, email, phone);
  },
  recordPayment: async (data: {
    orderId: string;
    paymentType: "advance" | "balance" | "full";
    amount: number;
    gateway?: string;
    transactionId?: string;
  }) => {
    return await dikorDB.recordPayment(data);
  },
  createInvoice: async (order: DBOrder) => {
    return await dikorDB.createInvoice(order);
  },
  getInvoice: async (orderId: string) => {
    return await dikorDB.getInvoiceByOrder(orderId);
  },
};

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const advanceAmount = (o: Order) => (o.totalPrice ? Math.round((o.totalPrice * o.advancePct) / 100) : 0);
export const balanceAmount = (o: Order) => (o.totalPrice ? o.totalPrice - advanceAmount(o) : 0);

export function publicUser(u: User) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
}
