import { query } from "./pg";

export type Role = "customer" | "admin";
export type Category = "Pets" | "Couples" | "Kids" | "Idols" | "Decor";

export type OrderStatus =
  | "photos_received"
  | "advance_pending"
  | "advance_paid"
  | "in_production"
  | "approval_shared"
  | "changes_requested"
  | "approved"
  | "balance_pending"
  | "balance_paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface DBUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  password?: string;
  role: Role;
  createdAt: string;
}

export interface DBProductSize {
  id: string;
  label: string;
  price: number | null;
  popular?: boolean;
}

export interface DBProduct {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  advancePct: number;
  isActive: boolean;
  sizes: DBProductSize[];
  craftingDays: number;
  shippingDays: number;
}

export interface DBOrderEvent {
  at: string;
  status: OrderStatus;
  note?: string;
  by?: string;
}

export interface DBOrder {
  id: string;
  trackingToken: string;
  userId: string | null;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  source: "web" | "whatsapp" | "instagram" | "manual_admin";
  title: string;
  category: Category;
  subjectName?: string;
  tagText?: string;
  description: string;
  photos: string[];
  size: string;
  material: string;
  city: string;
  status: OrderStatus;
  totalPrice: number;
  advancePct: number;
  advanceAmount: number;
  balanceAmount: number;
  advancePaid: boolean;
  balancePaid: boolean;
  timelineDays: number;
  approvalVideoUrl: string | null;
  approvalPhotos: string[];
  studioNotes: string;
  revisionCount: number;
  trackingNumber: string | null;
  courierPartner: string | null;
  events: DBOrderEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface DBPayment {
  id: string;
  orderId: string;
  paymentType: "advance" | "balance" | "full";
  amount: number;
  gateway: string;
  status: "pending" | "success" | "failed" | "refunded";
  transactionId?: string;
  createdAt: string;
}

export interface DBInvoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  amount: number;
  advancePaid: number;
  balancePaid: number;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  htmlContent: string;
  sentToEmail: string | null;
  sentAt: string | null;
  createdAt: string;
}

// In-memory fallback cache when offline or local testing
const localCache = {
  users: new Map<string, DBUser>(),
  orders: new Map<string, DBOrder>(),
  products: new Map<string, DBProduct>(),
  payments: new Map<string, DBPayment>(),
  invoices: new Map<string, DBInvoice>(),
  seeded: false,
};

function seedFallbackData() {
  if (localCache.seeded) return;
  localCache.seeded = true;

  const admin: DBUser = {
    id: "usr_admin_001",
    name: "DIKOR Studio Admin",
    email: "admin@dikor.in",
    phone: "919878070123",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  };
  const demoCustomer: DBUser = {
    id: "usr_cust_001",
    name: "Demo Customer",
    email: "customer@demo.in",
    phone: "9876543210",
    password: "demo123",
    role: "customer",
    createdAt: new Date().toISOString(),
  };
  localCache.users.set(admin.id, admin);
  localCache.users.set(demoCustomer.id, demoCustomer);
}

seedFallbackData();

export const dikorDB = {
  // ---- PRODUCTS ----
  async getProducts(): Promise<DBProduct[]> {
    const res = await query(
      `SELECT id, slug, name, category, tagline, description, image, price, sizes, photo_hint, active 
       FROM products 
       WHERE active = true 
       ORDER BY sort ASC, created_at ASC`
    );
    if (res && res.rows.length > 0) {
      return res.rows.map(mapRowToProduct);
    }
    return Array.from(localCache.products.values());
  },

  async updateProduct(id: string, patch: Partial<DBProduct>): Promise<boolean> {
    const sets: string[] = [];
    const vals: any[] = [];
    let idx = 1;

    if (patch.title !== undefined) {
      sets.push(`name = $${idx++}`);
      vals.push(patch.title);
    }
    if (patch.basePrice !== undefined) {
      sets.push(`price = $${idx++}`);
      vals.push(patch.basePrice);
    }
    if (patch.sizes !== undefined) {
      sets.push(`sizes = $${idx++}`);
      vals.push(JSON.stringify(patch.sizes));
    }
    if (patch.isActive !== undefined) {
      sets.push(`active = $${idx++}`);
      vals.push(patch.isActive);
    }

    if (sets.length > 0) {
      vals.push(id);
      const res = await query(`UPDATE products SET ${sets.join(", ")} WHERE id = $${idx}`, vals);
      if (res && res.rowCount && res.rowCount > 0) return true;
    }

    const p = localCache.products.get(id);
    if (p) Object.assign(p, patch);
    return true;
  },

  // ---- USERS ----
  async findUserByEmail(email: string): Promise<DBUser | null> {
    const clean = email.trim().toLowerCase();
    const res = await query(
      `SELECT id, name, email, phone, role, password_hash, created_at 
       FROM users 
       WHERE email ILIKE $1 
       LIMIT 1`,
      [clean]
    );
    if (res && res.rows.length > 0) {
      return mapRowToUser(res.rows[0]);
    }

    for (const u of localCache.users.values()) {
      if (u.email && u.email.toLowerCase() === clean) return u;
    }
    return null;
  },

  async findUserByPhone(phone: string): Promise<DBUser | null> {
    const clean = phone.replace(/\D/g, "");
    const res = await query(
      `SELECT id, name, email, phone, role, password_hash, created_at 
       FROM users 
       WHERE phone = $1 
       LIMIT 1`,
      [clean]
    );
    if (res && res.rows.length > 0) {
      return mapRowToUser(res.rows[0]);
    }

    for (const u of localCache.users.values()) {
      if (u.phone && u.phone.replace(/\D/g, "") === clean) return u;
    }
    return null;
  },

  async getUser(id: string): Promise<DBUser | null> {
    const res = await query(
      `SELECT id, name, email, phone, role, password_hash, created_at 
       FROM users 
       WHERE id = $1 
       LIMIT 1`,
      [id]
    );
    if (res && res.rows.length > 0) {
      return mapRowToUser(res.rows[0]);
    }
    for (const u of localCache.users.values()) {
      if (u.id === id) return u;
    }
    return null;
  },

  async createUser(
    arg: string | { name: string; email?: string; phone?: string; password?: string; role?: Role },
    emailArg?: string,
    passwordArg?: string,
    phoneArg?: string
  ): Promise<DBUser> {
    const user =
      typeof arg === "string"
        ? { name: arg, email: emailArg, password: passwordArg, phone: phoneArg, role: "customer" as Role }
        : arg;

    const id = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const email = user.email ? user.email.toLowerCase() : null;
    const phone = user.phone || null;
    const password = user.password || "";
    const role = user.role || "customer";

    const res = await query(
      `INSERT INTO users (id, name, email, phone, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, name, email, phone, role, password_hash, created_at`,
      [id, user.name, email, phone, password, role]
    );

    if (res && res.rows.length > 0) {
      return mapRowToUser(res.rows[0]);
    }

    const newUser: DBUser = {
      id,
      name: user.name,
      email,
      phone,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    localCache.users.set(newUser.id, newUser);
    return newUser;
  },

  // ---- ORDERS ----
  async getOrders(): Promise<DBOrder[]> {
    const res = await query(`SELECT * FROM orders ORDER BY created_at DESC`);
    if (res && res.rows.length > 0) {
      return res.rows.map(mapRowToOrder);
    }
    return Array.from(localCache.orders.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getOrdersByUser(userId: string, email?: string | null, phone?: string | null): Promise<DBOrder[]> {
    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanPhone = phone ? phone.replace(/\D/g, "") : null;

    const res = await query(
      `SELECT * FROM orders 
       WHERE user_id = $1 
          OR ($2::text IS NOT NULL AND (customer_email ILIKE $2 OR user_id IN (SELECT id FROM users WHERE email ILIKE $2)))
          OR ($3::text IS NOT NULL AND (phone = $3 OR user_id IN (SELECT id FROM users WHERE phone = $3)))
       ORDER BY created_at DESC`,
      [userId, cleanEmail, cleanPhone]
    );

    if (res && res.rows.length > 0) {
      return res.rows.map(mapRowToOrder);
    }

    return Array.from(localCache.orders.values())
      .filter((o) => o.userId === userId || (cleanEmail && o.customerEmail?.toLowerCase() === cleanEmail))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getOrder(idOrToken: string): Promise<DBOrder | null> {
    const res = await query(
      `SELECT * FROM orders WHERE id = $1 OR tracking_token = $1 LIMIT 1`,
      [idOrToken]
    );
    if (res && res.rows.length > 0) {
      return mapRowToOrder(res.rows[0]);
    }

    for (const o of localCache.orders.values()) {
      if (o.id === idOrToken || o.trackingToken === idOrToken) return o;
    }
    return null;
  },

  async createOrder(data: {
    userId?: string | null;
    customerName: string;
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
    totalPrice?: number;
    advancePct?: number;
    city?: string;
  }): Promise<DBOrder> {
    const timestamp = Date.now().toString().slice(-4);
    const orderId = `DKR-${new Date().getFullYear()}-${timestamp}${Math.floor(Math.random() * 90 + 10)}`;
    const trackingToken = `tk_${Math.random().toString(36).substring(2, 10)}`;
    const finalPrice = data.totalPrice || data.price || 1500;
    const advancePct = data.advancePct || 75;
    const advanceAmount = Math.round((finalPrice * advancePct) / 100);
    const balanceAmount = finalPrice - advanceAmount;
    const now = new Date().toISOString();

    const initialEvent: DBOrderEvent = {
      at: now,
      status: "photos_received",
      note: `Order ${orderId} initiated (${data.source || "web"}). Reference photos registered.`,
      by: data.customerName,
    };

    const res = await query(
      `INSERT INTO orders (
        id, user_id, title, category, description, photos, size, material, city, 
        pincode, address, phone, source, status, price, advance_pct, timeline_days, 
        demo_video, demo_note, revision_count, production_stage, advance_paid, balance_paid, 
        courier, tracking_id, invoice_no, events, tracking_token, customer_name, customer_email, 
        subject_name, tag_text, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, NOW(), NOW()
      ) RETURNING *`,
      [
        orderId,
        data.userId || "u_guest",
        data.title,
        data.category,
        data.description || "",
        JSON.stringify(data.photos || []),
        data.size,
        "Precision SLA Resin + Hand-Paint",
        data.city || "Pan India",
        "",
        "",
        data.customerPhone || "",
        data.source || "web",
        "photos_received",
        finalPrice,
        advancePct,
        12,
        null,
        "",
        0,
        "Pending Advance",
        false,
        false,
        "BlueDart Express",
        "",
        null,
        JSON.stringify([initialEvent]),
        trackingToken,
        data.customerName,
        data.customerEmail || null,
        data.subjectName || "",
        data.tagText || "",
      ]
    );

    if (res && res.rows.length > 0) {
      return mapRowToOrder(res.rows[0]);
    }

    const order: DBOrder = {
      id: orderId,
      trackingToken,
      userId: data.userId || null,
      customerName: data.customerName,
      customerEmail: data.customerEmail || null,
      customerPhone: data.customerPhone || null,
      source: data.source || "web",
      title: data.title,
      category: data.category,
      subjectName: data.subjectName || "",
      tagText: data.tagText || "",
      description: data.description || "",
      photos: data.photos || [],
      size: data.size,
      material: "Precision SLA Resin + Hand-Paint",
      city: data.city || "Pan India",
      status: "photos_received",
      totalPrice: finalPrice,
      advancePct,
      advanceAmount,
      balanceAmount,
      advancePaid: false,
      balancePaid: false,
      timelineDays: 12,
      approvalVideoUrl: null,
      approvalPhotos: [],
      studioNotes: "",
      revisionCount: 0,
      trackingNumber: null,
      courierPartner: "BlueDart Express",
      events: [initialEvent],
      createdAt: now,
      updatedAt: now,
    };

    localCache.orders.set(order.id, order);
    return order;
  },

  async updateOrder(
    id: string,
    patch: Partial<DBOrder>,
    eventNote?: string,
    by?: string
  ): Promise<DBOrder | null> {
    const existing = await this.getOrder(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    let events = existing.events || [];

    if (patch.status && patch.status !== existing.status) {
      const ev: DBOrderEvent = {
        at: now,
        status: patch.status,
        note: eventNote || `Status updated to ${patch.status}`,
        by: by || "admin",
      };
      events = [...events, ev];
    }

    const sets: string[] = ["updated_at = NOW()"];
    const vals: any[] = [];
    let idx = 1;

    if (patch.status !== undefined) {
      sets.push(`status = $${idx++}`);
      vals.push(patch.status);
      sets.push(`events = $${idx++}`);
      vals.push(JSON.stringify(events));
    }
    if (patch.totalPrice !== undefined) {
      sets.push(`price = $${idx++}`);
      vals.push(patch.totalPrice);
    }
    if (patch.advancePct !== undefined) {
      sets.push(`advance_pct = $${idx++}`);
      vals.push(patch.advancePct);
    }
    if (patch.advancePaid !== undefined) {
      sets.push(`advance_paid = $${idx++}`);
      vals.push(patch.advancePaid);
    }
    if (patch.balancePaid !== undefined) {
      sets.push(`balance_paid = $${idx++}`);
      vals.push(patch.balancePaid);
    }
    if (patch.trackingNumber !== undefined) {
      sets.push(`tracking_id = $${idx++}`);
      vals.push(patch.trackingNumber);
    }
    if (patch.courierPartner !== undefined) {
      sets.push(`courier = $${idx++}`);
      vals.push(patch.courierPartner);
    }
    if (patch.approvalVideoUrl !== undefined) {
      sets.push(`demo_video = $${idx++}`);
      vals.push(patch.approvalVideoUrl);
    }
    if (patch.studioNotes !== undefined) {
      sets.push(`demo_note = $${idx++}`);
      vals.push(patch.studioNotes);
    }
    if (patch.userId !== undefined) {
      sets.push(`user_id = $${idx++}`);
      vals.push(patch.userId);
    }

    vals.push(id);
    const res = await query(
      `UPDATE orders SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`,
      vals
    );

    if (res && res.rows.length > 0) {
      return mapRowToOrder(res.rows[0]);
    }

    const updated = { ...existing, ...patch, events, updatedAt: now };
    localCache.orders.set(id, updated);
    return updated;
  },

  // ---- CLAIM GUEST ORDERS ----
  async claimGuestOrders(userId: string, email?: string | null, phone?: string | null): Promise<number> {
    if (!email && !phone) return 0;
    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanPhone = phone ? phone.replace(/\D/g, "") : null;

    const res = await query(
      `UPDATE orders 
       SET user_id = $1 
       WHERE (user_id IS NULL OR user_id = 'u_guest' OR user_id LIKE 'usr_%') 
         AND (
           ($2::text IS NOT NULL AND customer_email ILIKE $2) 
           OR ($3::text IS NOT NULL AND phone = $3)
         )
       RETURNING id`,
      [userId, cleanEmail, cleanPhone]
    );

    if (res && res.rowCount !== null) {
      return res.rowCount;
    }
    return 0;
  },

  // ---- PAYMENTS ----
  async recordPayment(p: {
    orderId: string;
    paymentType: "advance" | "balance" | "full";
    amount: number;
    gateway?: string;
    transactionId?: string;
  }): Promise<DBPayment> {
    const payId = `PAY-${Date.now().toString(36).toUpperCase()}`;
    const txn = p.transactionId || `EBZ_${Date.now()}`;
    const gateway = p.gateway || "easebuzz";

    await query(
      `INSERT INTO payments (txnid, order_id, part, amount, status, mode, easepayid, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT (txnid) DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()`,
      [txn, p.orderId, p.paymentType, String(p.amount), "success", gateway, txn]
    );

    const payment: DBPayment = {
      id: payId,
      orderId: p.orderId,
      paymentType: p.paymentType,
      amount: p.amount,
      gateway,
      status: "success",
      transactionId: txn,
      createdAt: new Date().toISOString(),
    };
    localCache.payments.set(payment.id, payment);
    return payment;
  },

  // ---- INVOICES ----
  async createInvoice(order: DBOrder): Promise<DBInvoice> {
    const invNumber = `INV-${new Date().getFullYear()}-${order.id.slice(-4)}`;
    const invId = `inv_${order.id}`;
    const now = new Date().toISOString();

    await query(
      `INSERT INTO invoices (
        id, order_id, invoice_number, amount, advance_paid, balance_paid, 
        customer_name, customer_email, customer_phone, html_content, sent_to_email, sent_at, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET 
        amount = EXCLUDED.amount, 
        advance_paid = EXCLUDED.advance_paid, 
        balance_paid = EXCLUDED.balance_paid`,
      [
        invId,
        order.id,
        invNumber,
        order.totalPrice,
        order.advanceAmount,
        order.balanceAmount,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        "",
        order.customerEmail,
      ]
    );

    // Also update invoice_no on orders table
    await query(`UPDATE orders SET invoice_no = $1 WHERE id = $2`, [invNumber, order.id]);

    const invoice: DBInvoice = {
      id: invId,
      orderId: order.id,
      invoiceNumber: invNumber,
      amount: order.totalPrice,
      advancePaid: order.advanceAmount,
      balancePaid: order.balanceAmount,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      htmlContent: "",
      sentToEmail: order.customerEmail,
      sentAt: now,
      createdAt: now,
    };
    localCache.invoices.set(invoice.id, invoice);
    return invoice;
  },

  async getInvoiceByOrder(orderId: string): Promise<DBInvoice | null> {
    const res = await query(`SELECT * FROM invoices WHERE order_id = $1 LIMIT 1`, [orderId]);
    if (res && res.rows.length > 0) {
      return mapRowToInvoice(res.rows[0]);
    }
    for (const inv of localCache.invoices.values()) {
      if (inv.orderId === orderId) return inv;
    }
    return null;
  },
};

function mapRowToProduct(r: Record<string, any>): DBProduct {
  const basePrice = Number(r.price) || 1500;
  let parsedSizes: DBProductSize[] = [];
  try {
    if (typeof r.sizes === "string") {
      parsedSizes = JSON.parse(r.sizes);
    } else if (Array.isArray(r.sizes)) {
      parsedSizes = r.sizes;
    }
  } catch {
    parsedSizes = [];
  }

  if (parsedSizes.length === 0) {
    parsedSizes = [
      { id: "4in", label: "4 inch · Compact Keepsake", price: basePrice },
      { id: "5in", label: "5 inch · Studio Favorite", price: Math.round(basePrice * 1.3), popular: true },
      { id: "6in", label: "6 inch · Premium Atelier", price: Math.round(basePrice * 1.6) },
      { id: "7in", label: "7 inch · Centerpiece Heirloom", price: Math.round(basePrice * 2.1) },
      { id: "8in", label: "8 inch · Grand Monumental", price: Math.round(basePrice * 2.7) },
    ];
  }

  return {
    id: r.id,
    title: r.name || r.title || "Custom 3D Figurine",
    category: r.category || "Pets",
    tagline: r.tagline || "",
    description: r.description || "",
    imageUrl: r.image || "/images/cat-figurine.jpg",
    basePrice,
    advancePct: 75,
    isActive: r.active !== false,
    sizes: parsedSizes,
    craftingDays: 5,
    shippingDays: 3,
  };
}

function mapRowToOrder(r: Record<string, any>): DBOrder {
  const tot = Number(r.price) || Number(r.total_price) || 1500;
  const advPct = Number(r.advance_pct) || 75;
  const advAmt = Math.round((tot * advPct) / 100);
  const balAmt = tot - advAmt;

  let parsedPhotos: string[] = [];
  try {
    if (typeof r.photos === "string") parsedPhotos = JSON.parse(r.photos);
    else if (Array.isArray(r.photos)) parsedPhotos = r.photos;
  } catch {
    parsedPhotos = [];
  }

  let parsedEvents: DBOrderEvent[] = [];
  try {
    if (typeof r.events === "string") parsedEvents = JSON.parse(r.events);
    else if (Array.isArray(r.events)) parsedEvents = r.events;
  } catch {
    parsedEvents = [];
  }

  return {
    id: r.id,
    trackingToken: r.tracking_token || r.id,
    userId: r.user_id,
    customerName: r.customer_name || "Customer",
    customerEmail: r.customer_email || null,
    customerPhone: r.phone || r.customer_phone || null,
    source: r.source || "web",
    title: r.title || "Custom 3D Figurine",
    category: r.category as Category,
    subjectName: r.subject_name || "",
    tagText: r.tag_text || "",
    description: r.description || r.notes || "",
    photos: parsedPhotos,
    size: r.size || "Standard",
    material: r.material || "Precision SLA Resin + Hand-Paint",
    city: r.city || "Pan India",
    status: (r.status as OrderStatus) || "photos_received",
    totalPrice: tot,
    advancePct: advPct,
    advanceAmount: advAmt,
    balanceAmount: balAmt,
    advancePaid: Boolean(r.advance_paid),
    balancePaid: Boolean(r.balance_paid),
    timelineDays: Number(r.timeline_days) || 12,
    approvalVideoUrl: r.demo_video || null,
    approvalPhotos: Array.isArray(r.approval_photos) ? r.approval_photos : [],
    studioNotes: r.demo_note || r.studio_notes || "",
    revisionCount: Number(r.revision_count) || 0,
    trackingNumber: r.tracking_id || null,
    courierPartner: r.courier || "BlueDart Express",
    events: parsedEvents,
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
  };
}

function mapRowToUser(r: Record<string, any>): DBUser {
  return {
    id: r.id,
    name: r.name || "Customer",
    email: r.email || null,
    phone: r.phone || null,
    password: r.password_hash || r.password || "",
    role: (r.role as Role) || "customer",
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
  };
}

function mapRowToInvoice(r: Record<string, any>): DBInvoice {
  return {
    id: r.id,
    orderId: r.order_id,
    invoiceNumber: r.invoice_number,
    amount: Number(r.amount) || 0,
    advancePaid: Number(r.advance_paid) || 0,
    balancePaid: Number(r.balance_paid) || 0,
    customerName: r.customer_name || "Customer",
    customerEmail: r.customer_email || null,
    customerPhone: r.customer_phone || null,
    htmlContent: r.html_content || "",
    sentToEmail: r.sent_to_email || null,
    sentAt: r.sent_at ? new Date(r.sent_at).toISOString() : null,
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
  };
}
