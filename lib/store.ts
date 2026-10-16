// DIKOR demo — in-memory store (Route Handlers only, no separate backend).
// NOTE: demo only. Data resets when the server restarts.

export type Role = "customer" | "admin";

export type Category = "Pets" | "Couples" | "Kids" | "Idols" | "Decor";

/** DIKOR v2 order flow — matches the real process from DIKOR's IG Q&A:
 *  photos (4–5) → 75% advance → print & paint → approval video → approved
 *  → 25% balance → shipped → delivered. */
export type OrderStatus =
  | "photos_received"
  | "advance_paid"
  | "in_production"
  | "approval_shared"
  | "approved"
  | "balance_paid"
  | "shipped"
  | "delivered";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // demo only — plain text, never do this in production
  role: Role;
  createdAt: string;
}

export interface OrderEvent {
  at: string;
  status: OrderStatus;
  note?: string;
  by?: string;
}

export interface Order {
  id: string;
  userId: string;
  title: string;
  category: Category;
  description: string;
  photos: string[]; // base64 data URLs (demo)
  size: string;
  material: string;
  city: string;
  status: OrderStatus;
  price: number | null;
  advancePct: number; // e.g. 40
  timelineDays: number | null;
  demoVideo: string | null; // base64 data URL (demo)
  demoNote: string;
  revisionCount: number;
  productionStage: string;
  advancePaid: boolean;
  balancePaid: boolean;
  events: OrderEvent[];
  createdAt: string;
  updatedAt: string;
}

/** Customer-facing 8-step pipeline (mirrors the real order flow). */
export const PIPELINE_STEPS: { key: string; label: string; statuses: OrderStatus[]; blurb: string }[] = [
  {
    key: "photos",
    label: "Photos received",
    statuses: ["photos_received"],
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
    statuses: ["approval_shared"],
    blurb: "We send photos or a video of the finished piece — you approve it before anything ships.",
  },
  {
    key: "approved",
    label: "You approved it",
    statuses: ["approved"],
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
  advance_paid: "Advance paid (75%)",
  in_production: "Printing & painting",
  approval_shared: "Approval video shared",
  approved: "Approved",
  balance_paid: "Balance paid (25%)",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const CATEGORIES: { key: Category; tagline: string; from: string }[] = [
  { key: "Pets", tagline: "Lifelike replicas of your furry family", from: "₹1,999" },
  { key: "Couples", tagline: "Miniature you-two, for anniversaries & weddings", from: "₹2,499" },
  { key: "Kids", tagline: "Adorable keepsakes of little moments", from: "₹1,999" },
  { key: "Idols", tagline: "Hand-finished deities like Radha Krishna", from: "₹2,999" },
  { key: "Decor", tagline: "Custom showpieces for warm homes", from: "₹1,499" },
];

const now = () => new Date().toISOString();
let seq = 0;
const uid = (p: string) => `${p}_${Date.now().toString(36)}_${(seq++).toString(36)}`;

interface DB {
  users: Map<string, User>;
  orders: Map<string, Order>;
  seeded: boolean;
}

function getDB(): DB {
  const g = globalThis as unknown as { __dikor_db?: DB };
  if (!g.__dikor_db) {
    g.__dikor_db = { users: new Map(), orders: new Map(), seeded: false };
  }
  const db = g.__dikor_db;
  if (!db.seeded) {
    seed(db);
    db.seeded = true;
  }
  return db;
}

const pawSvg = (bg: string, fg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="24" fill="${bg}"/><g fill="${fg}" opacity="0.9"><ellipse cx="100" cy="125" rx="26" ry="22"/><ellipse cx="62" cy="92" rx="12" ry="15"/><ellipse cx="86" cy="74" rx="12" ry="15"/><ellipse cx="114" cy="74" rx="12" ry="15"/><ellipse cx="138" cy="92" rx="12" ry="15"/></g></svg>`
  )}`;

const idolSvg = (bg: string, fg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="24" fill="${bg}"/><g fill="none" stroke="${fg}" stroke-width="7" stroke-linecap="round"><circle cx="100" cy="70" r="22"/><path d="M100 95 v55 M100 110 l-30 18 M100 110 l30 18 M100 150 l-24 30 M100 150 l24 30"/></g><circle cx="100" cy="38" r="10" fill="${fg}"/></svg>`
  )}`;

function seed(db: DB) {
  const customer: User = {
    id: "u_customer",
    name: "Demo Customer",
    email: "customer@demo.in",
    password: "demo123",
    role: "customer",
    createdAt: now(),
  };
  const admin: User = {
    id: "u_admin",
    name: "Studio Admin",
    email: "admin@demo.in",
    password: "admin123",
    role: "admin",
    createdAt: now(),
  };
  db.users.set(customer.id, customer);
  db.users.set(admin.id, admin);

  const t0 = new Date(Date.now() - 6 * 864e5).toISOString();
  const t1 = new Date(Date.now() - 4 * 864e5).toISOString();
  const t2 = new Date(Date.now() - 2 * 864e5).toISOString();

  const o1: Order = {
    id: "ord_demo_gappu",
    userId: customer.id,
    title: "Gappu — Golden Retriever replica",
    category: "Pets",
    description: "5-inch hand-painted replica of my golden retriever Gappu, sitting pose, with name base.",
    photos: [pawSvg("#F3EAD9", "#B76E79"), pawSvg("#F7E8E4", "#C9A227")],
    size: '5 inch · slim',
    material: "PLA + hand-painted finish",
    city: "Bengaluru",
    status: "approval_shared",
    price: 1500,
    advancePct: 75,
    timelineDays: 12,
    demoVideo: null,
    demoNote: "Fresh from the paint booth — turn your sound on!",
    revisionCount: 0,
    productionStage: "Painting",
    advancePaid: true,
    balancePaid: false,
    events: [
      { at: t0, status: "photos_received", note: "Order placed with 2 reference photos", by: "customer" },
      { at: t1, status: "advance_paid", note: "Advance of ₹1,125 received (demo)", by: "customer" },
      { at: t2, status: "in_production", note: "Printing & painting started", by: "admin" },
      { at: t2, status: "approval_shared", note: "Approval video shared for review", by: "admin" },
    ],
    createdAt: t0,
    updatedAt: t2,
  };

  const o2: Order = {
    id: "ord_demo_radha",
    userId: customer.id,
    title: "Radha Krishna idol — 6 inch",
    category: "Idols",
    description: "Radha Krishna idol in antique gold finish for the pooja room.",
    photos: [idolSvg("#FAF5EC", "#C9A227")],
    size: '6 inch',
    material: "Resin + antique gold finish",
    city: "Jalandhar",
    status: "in_production",
    price: 3499,
    advancePct: 75,
    timelineDays: 15,
    demoVideo: null,
    demoNote: "",
    revisionCount: 0,
    productionStage: "Painting",
    advancePaid: true,
    balancePaid: false,
    events: [
      { at: t0, status: "photos_received", note: "Order placed", by: "customer" },
      { at: t1, status: "advance_paid", note: "Advance of ₹2,624 received (demo)", by: "customer" },
      { at: t2, status: "in_production", note: "Printing & painting started", by: "admin" },
    ],
    createdAt: t0,
    updatedAt: t2,
  };

  db.orders.set(o1.id, o1);
  db.orders.set(o2.id, o2);
}

// ---- accessors ----
export const db = {
  findUserByEmail: (email: string): User | undefined => {
    const d = getDB();
    for (const u of d.users.values()) if (u.email.toLowerCase() === email.toLowerCase()) return u;
    return undefined;
  },
  getUser: (id: string) => getDB().users.get(id),
  createUser: (name: string, email: string, password: string): User => {
    const d = getDB();
    const u: User = { id: uid("u"), name, email, password, role: "customer", createdAt: now() };
    d.users.set(u.id, u);
    return u;
  },
  getOrders: (): Order[] => [...getDB().orders.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  getOrdersByUser: (userId: string): Order[] => db.getOrders().filter((o) => o.userId === userId),
  getOrder: (id: string) => getDB().orders.get(id),
  createOrder: (data: Omit<Order, "id" | "status" | "advancePct" | "timelineDays" | "demoVideo" | "demoNote" | "revisionCount" | "productionStage" | "advancePaid" | "balancePaid" | "events" | "createdAt" | "updatedAt">): Order => {
    const d = getDB();
    const t = now();
    const o: Order = {
      ...data, id: uid("ord"), status: "photos_received", price: data.price ?? null, advancePct: 75,
      timelineDays: 12, demoVideo: null, demoNote: "", revisionCount: 0,
      productionStage: "", advancePaid: false, balancePaid: false,
      events: [{ at: t, status: "photos_received", note: "Order placed with reference photos", by: "customer" }],
      createdAt: t, updatedAt: t,
    };
    d.orders.set(o.id, o);
    return o;
  },
  updateOrder: (id: string, patch: Partial<Order>, eventNote?: string, by?: string): Order | undefined => {
    const d = getDB();
    const o = d.orders.get(id);
    if (!o) return undefined;
    const prevStatus = o.status;
    Object.assign(o, patch, { updatedAt: now() });
    if (patch.status && patch.status !== prevStatus) {
      o.events.push({ at: now(), status: patch.status, note: eventNote, by });
    }
    return o;
  },
};

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const advanceAmount = (o: Order) => (o.price ? Math.round((o.price * o.advancePct) / 100) : 0);
export const balanceAmount = (o: Order) => (o.price ? o.price - advanceAmount(o) : 0);

/** Strip sensitive fields before sending to the client. */
export function publicUser(u: User) {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}
