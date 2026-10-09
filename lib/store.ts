// DIKOR demo — in-memory store (Route Handlers only, no separate backend).
// NOTE: demo only. Data resets when the server restarts.

export type Role = "customer" | "admin";

export type Category = "Pets" | "Couples" | "Kids" | "Idols" | "Decor";

export type OrderStatus =
  | "submitted"
  | "quoted"
  | "advance_paid"
  | "demo_shared"
  | "approved"
  | "in_production"
  | "ready_for_balance"
  | "completed";

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

/** Customer-facing 5-step pipeline (mirrors the order flow). */
export const PIPELINE_STEPS: { key: string; label: string; statuses: OrderStatus[]; blurb: string }[] = [
  {
    key: "share",
    label: "Tell us what you need",
    statuses: ["submitted"],
    blurb: "Share reference photos and describe your keepsake — pet, couple, idol or decor.",
  },
  {
    key: "quote",
    label: "Clear quotation",
    statuses: ["quoted"],
    blurb: "You get a transparent quote with price and delivery timeline. No hidden costs.",
  },
  {
    key: "advance",
    label: "Advance green-lights it",
    statuses: ["advance_paid"],
    blurb: "A small advance confirms your slot and we begin crafting.",
  },
  {
    key: "review",
    label: "Review before it ships",
    statuses: ["demo_shared", "approved", "in_production"],
    blurb: "Watch a video demo of your piece. Revisions included — we ship only when you love it.",
  },
  {
    key: "deliver",
    label: "Balance & delivery",
    statuses: ["ready_for_balance", "completed"],
    blurb: "Clear the balance and your keepsake ships pan-India, packed with care.",
  },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  submitted: "Order placed",
  quoted: "Quote ready",
  advance_paid: "Advance paid",
  demo_shared: "Demo video shared",
  approved: "Approved",
  in_production: "In production",
  ready_for_balance: "Balance due",
  completed: "Delivered",
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
    description: "4-inch hand-painted replica of my golden retriever Gappu, sitting pose, with name base.",
    photos: [pawSvg("#F3EAD9", "#B76E79"), pawSvg("#F7E8E4", "#C9A227")],
    size: '4 inch',
    material: "PLA + hand-painted finish",
    city: "Bengaluru",
    status: "demo_shared",
    price: 2499,
    advancePct: 40,
    timelineDays: 12,
    demoVideo: null,
    demoNote: "Fresh from the paint booth — turn your sound on!",
    revisionCount: 0,
    productionStage: "Painting",
    advancePaid: true,
    balancePaid: false,
    events: [
      { at: t0, status: "submitted", note: "Order placed with 2 reference photos", by: "customer" },
      { at: t1, status: "quoted", note: "Quote shared: ₹2,499 · 12 days", by: "admin" },
      { at: t1, status: "advance_paid", note: "Advance of ₹1,000 received (demo)", by: "customer" },
      { at: t2, status: "demo_shared", note: "Demo video shared for review", by: "admin" },
    ],
    createdAt: t0,
    updatedAt: t2,
  };

  const o2: Order = {
    id: "ord_demo_radha",
    userId: customer.id,
    title: "Radha Krishna idol — 6 inch",
    category: "Idols",
    description: "6-inch Radha Krishna idol in antique gold finish for the pooja room.",
    photos: [idolSvg("#FAF5EC", "#C9A227")],
    size: '6 inch',
    material: "Resin + antique gold finish",
    city: "Jalandhar",
    status: "in_production",
    price: 3499,
    advancePct: 40,
    timelineDays: 15,
    demoVideo: null,
    demoNote: "",
    revisionCount: 1,
    productionStage: "Printing",
    advancePaid: true,
    balancePaid: false,
    events: [
      { at: t0, status: "submitted", note: "Order placed", by: "customer" },
      { at: t1, status: "quoted", note: "Quote shared: ₹3,499 · 15 days", by: "admin" },
      { at: t1, status: "advance_paid", note: "Advance of ₹1,400 received (demo)", by: "customer" },
      { at: t2, status: "demo_shared", note: "Demo video shared", by: "admin" },
      { at: t2, status: "approved", note: "Approved after 1 revision", by: "customer" },
      { at: t2, status: "in_production", note: "Printing started", by: "admin" },
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
  createOrder: (data: Omit<Order, "id" | "status" | "price" | "advancePct" | "timelineDays" | "demoVideo" | "demoNote" | "revisionCount" | "productionStage" | "advancePaid" | "balancePaid" | "events" | "createdAt" | "updatedAt">): Order => {
    const d = getDB();
    const t = now();
    const o: Order = {
      ...data, id: uid("ord"), status: "submitted", price: null, advancePct: 40,
      timelineDays: null, demoVideo: null, demoNote: "", revisionCount: 0,
      productionStage: "", advancePaid: false, balancePaid: false,
      events: [{ at: t, status: "submitted", note: "Order placed", by: "customer" }],
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
