import { supabase, isSupabaseConfigured } from "./supabase";

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

  const o1: DBOrder = {
    id: "DKR-2026-1001",
    trackingToken: "tk_gappu_demo_982",
    userId: demoCustomer.id,
    customerName: "Demo Customer",
    customerEmail: "customer@demo.in",
    customerPhone: "9876543210",
    source: "web",
    title: "Gappu — Golden Retriever replica",
    category: "Pets",
    subjectName: "Gappu",
    tagText: "Gappu 2026",
    description: "5-inch hand-painted replica of my golden retriever Gappu, sitting pose, with name base.",
    photos: ["/images/hero-dog.webp"],
    size: '5" · Bulky breeds',
    material: "High-precision resin + acrylic hand-paint",
    city: "Bengaluru",
    status: "approval_shared",
    totalPrice: 2000,
    advancePct: 75,
    advanceAmount: 1500,
    balanceAmount: 500,
    advancePaid: true,
    balancePaid: false,
    timelineDays: 12,
    approvalVideoUrl: null,
    approvalPhotos: ["/images/hero-dog.webp"],
    studioNotes: "Finished paint booth inspection. Ready for customer approval video.",
    revisionCount: 0,
    trackingNumber: null,
    courierPartner: "BlueDart Express",
    events: [
      { at: new Date(Date.now() - 4 * 864e5).toISOString(), status: "photos_received", note: "Order placed with reference photos", by: "customer" },
      { at: new Date(Date.now() - 3 * 864e5).toISOString(), status: "advance_paid", note: "75% Advance (₹1,500) received via Easebuzz", by: "customer" },
      { at: new Date(Date.now() - 2 * 864e5).toISOString(), status: "in_production", note: "3D CAD modeling completed, SLA printing in progress", by: "admin" },
      { at: new Date(Date.now() - 1 * 864e5).toISOString(), status: "approval_shared", note: "360° craft video uploaded for client review", by: "admin" },
    ],
    createdAt: new Date(Date.now() - 4 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 864e5).toISOString(),
  };
  localCache.orders.set(o1.id, o1);
}

seedFallbackData();

export const dikorDB = {
  // ---- PRODUCTS ----
  async getProducts(): Promise<DBProduct[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from("dikor_products").select("*").eq("is_active", true);
        if (!error && data && data.length > 0) {
          return data.map((r) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            tagline: r.tagline,
            description: r.description,
            imageUrl: r.image_url,
            basePrice: r.base_price,
            advancePct: r.advance_pct,
            isActive: r.is_active,
            sizes: r.sizes_json || [],
            craftingDays: r.crafting_days,
            shippingDays: r.shipping_days,
          }));
        }
      } catch (err) {
        console.warn("Supabase products fetch fallback:", err);
      }
    }
    return Array.from(localCache.products.values());
  },

  async updateProduct(id: string, patch: Partial<DBProduct>): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const updateData: Record<string, unknown> = {};
        if (patch.title !== undefined) updateData.title = patch.title;
        if (patch.basePrice !== undefined) updateData.base_price = patch.basePrice;
        if (patch.advancePct !== undefined) updateData.advance_pct = patch.advancePct;
        if (patch.sizes !== undefined) updateData.sizes_json = patch.sizes;
        if (patch.isActive !== undefined) updateData.is_active = patch.isActive;
        if (patch.craftingDays !== undefined) updateData.crafting_days = patch.craftingDays;
        if (patch.shippingDays !== undefined) updateData.shipping_days = patch.shippingDays;
        updateData.updated_at = new Date().toISOString();

        const { error } = await supabase.from("dikor_products").update(updateData).eq("id", id);
        return !error;
      } catch (err) {
        console.error("Error updating product in Supabase:", err);
      }
    }
    const p = localCache.products.get(id);
    if (p) Object.assign(p, patch);
    return true;
  },

  // ---- USERS ----
  async findUserByEmail(email: string): Promise<DBUser | null> {
    const clean = email.trim().toLowerCase();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from("dikor_users").select("*").ilike("email", clean).maybeSingle();
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password_hash,
            role: data.role as Role,
            createdAt: data.created_at,
          };
        }
      } catch (err) {
        console.warn("Supabase user email lookup fallback:", err);
      }
    }
    for (const u of localCache.users.values()) {
      if (u.email && u.email.toLowerCase() === clean) return u;
    }
    return null;
  },

  async findUserByPhone(phone: string): Promise<DBUser | null> {
    const clean = phone.replace(/\D/g, "");
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from("dikor_users").select("*").eq("phone", clean).maybeSingle();
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password_hash,
            role: data.role as Role,
            createdAt: data.created_at,
          };
        }
      } catch (err) {
        console.warn("Supabase user phone lookup fallback:", err);
      }
    }
    for (const u of localCache.users.values()) {
      if (u.phone && u.phone.replace(/\D/g, "") === clean) return u;
    }
    return null;
  },

  async createUser(user: { name: string; email?: string; phone?: string; password?: string; role?: Role }): Promise<DBUser> {
    const id = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const newUser: DBUser = {
      id,
      name: user.name,
      email: user.email ? user.email.toLowerCase() : null,
      phone: user.phone || null,
      password: user.password || "",
      role: user.role || "customer",
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("dikor_users").insert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          password_hash: newUser.password,
          role: newUser.role,
        });
      } catch (err) {
        console.error("Supabase createUser error:", err);
      }
    }
    localCache.users.set(newUser.id, newUser);
    return newUser;
  },

  // ---- ORDERS ----
  async getOrders(): Promise<DBOrder[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from("dikor_orders").select("*").order("created_at", { ascending: false });
        if (!error && data) {
          return data.map(mapRowToOrder);
        }
      } catch (err) {
        console.warn("Supabase getOrders error, using local fallback:", err);
      }
    }
    return Array.from(localCache.orders.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getOrdersByUser(userId: string, email?: string | null, phone?: string | null): Promise<DBOrder[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from("dikor_orders").select("*");
        if (email && phone) {
          query = query.or(`user_id.eq.${userId},customer_email.ilike.${email},customer_phone.eq.${phone}`);
        } else if (email) {
          query = query.or(`user_id.eq.${userId},customer_email.ilike.${email}`);
        } else {
          query = query.eq("user_id", userId);
        }
        const { data, error } = await query.order("created_at", { ascending: false });
        if (!error && data) {
          return data.map(mapRowToOrder);
        }
      } catch (err) {
        console.warn("Supabase getOrdersByUser error:", err);
      }
    }
    return Array.from(localCache.orders.values())
      .filter((o) => o.userId === userId || (email && o.customerEmail?.toLowerCase() === email.toLowerCase()))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getOrder(idOrToken: string): Promise<DBOrder | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("dikor_orders")
          .select("*")
          .or(`id.eq.${idOrToken},tracking_token.eq.${idOrToken}`)
          .maybeSingle();
        if (!error && data) {
          return mapRowToOrder(data);
        }
      } catch (err) {
        console.warn("Supabase getOrder error:", err);
      }
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
    totalPrice: number;
    advancePct?: number;
    city?: string;
  }): Promise<DBOrder> {
    const timestamp = Date.now().toString().slice(-4);
    const orderId = `DKR-${new Date().getFullYear()}-${timestamp}${Math.floor(Math.random() * 90 + 10)}`;
    const trackingToken = `tk_${Math.random().toString(36).substring(2, 10)}`;
    const advancePct = data.advancePct || 75;
    const advanceAmount = Math.round((data.totalPrice * advancePct) / 100);
    const balanceAmount = data.totalPrice - advanceAmount;
    const now = new Date().toISOString();

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
      material: "Precision SLA Resin + Studio Hand-Paint",
      city: data.city || "Pan India",
      status: "photos_received",
      totalPrice: data.totalPrice,
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
      events: [
        {
          at: now,
          status: "photos_received",
          note: `Order ${orderId} initiated (${data.source || "web"}). 4-5 reference photos registered.`,
          by: data.customerName,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("dikor_orders").insert({
          id: order.id,
          tracking_token: order.trackingToken,
          user_id: order.userId,
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_phone: order.customerPhone,
          source: order.source,
          category: order.category,
          title: order.title,
          subject_name: order.subjectName,
          tag_text: order.tagText,
          size: order.size,
          notes: order.description,
          photos: order.photos,
          status: order.status,
          total_price: order.totalPrice,
          advance_pct: order.advancePct,
          advance_amount: order.advanceAmount,
          balance_amount: order.balanceAmount,
          advance_paid: order.advancePaid,
          balance_paid: order.balancePaid,
          city: order.city,
        });

        await supabase.from("dikor_order_events").insert({
          order_id: order.id,
          status: order.status,
          note: order.events[0].note,
          by: order.events[0].by,
        });
      } catch (err) {
        console.error("Supabase createOrder error:", err);
      }
    }

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
    const updated = { ...existing, ...patch, updatedAt: now };

    if (patch.totalPrice !== undefined || patch.advancePct !== undefined) {
      const tot = updated.totalPrice;
      const advPct = updated.advancePct;
      updated.advanceAmount = Math.round((tot * advPct) / 100);
      updated.balanceAmount = tot - updated.advanceAmount;
    }

    if (patch.status && patch.status !== existing.status) {
      const ev: DBOrderEvent = {
        at: now,
        status: patch.status,
        note: eventNote || `Status updated to ${patch.status}`,
        by: by || "admin",
      };
      updated.events = [...(existing.events || []), ev];

      if (isSupabaseConfigured()) {
        try {
          await supabase.from("dikor_order_events").insert({
            order_id: id,
            status: patch.status,
            note: ev.note,
            by: ev.by,
          });
        } catch (err) {
          console.error("Error logging order event:", err);
        }
      }
    }

    if (isSupabaseConfigured()) {
      try {
        const dbPatch: Record<string, unknown> = { updated_at: now };
        if (patch.status !== undefined) dbPatch.status = patch.status;
        if (patch.totalPrice !== undefined) dbPatch.total_price = patch.totalPrice;
        if (patch.advancePct !== undefined) dbPatch.advance_pct = patch.advancePct;
        if (patch.advancePaid !== undefined) dbPatch.advance_paid = patch.advancePaid;
        if (patch.balancePaid !== undefined) dbPatch.balance_paid = patch.balancePaid;
        if (patch.trackingNumber !== undefined) dbPatch.tracking_number = patch.trackingNumber;
        if (patch.courierPartner !== undefined) dbPatch.courier_partner = patch.courierPartner;
        if (patch.approvalVideoUrl !== undefined) dbPatch.approval_video_url = patch.approvalVideoUrl;
        if (patch.studioNotes !== undefined) dbPatch.studio_notes = patch.studioNotes;
        if (patch.photos !== undefined) dbPatch.photos = patch.photos;
        if (patch.userId !== undefined) dbPatch.user_id = patch.userId;

        await supabase.from("dikor_orders").update(dbPatch).eq("id", id);
      } catch (err) {
        console.error("Supabase updateOrder error:", err);
      }
    }

    localCache.orders.set(id, updated);
    return updated;
  },

  // ---- CLAIM GUEST ORDERS ----
  async claimGuestOrders(userId: string, email?: string | null, phone?: string | null): Promise<number> {
    if (!email && !phone) return 0;
    let claimed = 0;

    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from("dikor_orders").update({ user_id: userId }).is("user_id", null);
        if (email && phone) {
          query = query.or(`customer_email.ilike.${email},customer_phone.eq.${phone}`);
        } else if (email) {
          query = query.ilike("customer_email", email);
        } else if (phone) {
          query = query.eq("customer_phone", phone);
        }
        const { data, error } = await query.select("id");
        if (!error && data) claimed = data.length;
      } catch (err) {
        console.warn("Supabase claimGuestOrders error:", err);
      }
    }

    for (const [id, o] of localCache.orders.entries()) {
      if (!o.userId) {
        const emailMatch = email && o.customerEmail?.toLowerCase() === email.toLowerCase();
        const phoneMatch = phone && o.customerPhone === phone;
        if (emailMatch || phoneMatch) {
          o.userId = userId;
          localCache.orders.set(id, o);
          claimed++;
        }
      }
    }
    return claimed;
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
    const payment: DBPayment = {
      id: payId,
      orderId: p.orderId,
      paymentType: p.paymentType,
      amount: p.amount,
      gateway: p.gateway || "easebuzz",
      status: "success",
      transactionId: p.transactionId || `EBZ_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("dikor_payments").insert({
          id: payment.id,
          order_id: payment.orderId,
          payment_type: payment.paymentType,
          amount: payment.amount,
          gateway: payment.gateway,
          status: payment.status,
          transaction_id: payment.transactionId,
        });
      } catch (err) {
        console.error("Supabase recordPayment error:", err);
      }
    }
    localCache.payments.set(payment.id, payment);
    return payment;
  },

  // ---- INVOICES ----
  async createInvoice(order: DBOrder): Promise<DBInvoice> {
    const invNumber = `INV-${new Date().getFullYear()}-${order.id.slice(-4)}`;
    const invId = `inv_${order.id}`;
    const now = new Date().toISOString();

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

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("dikor_invoices").upsert({
          id: invoice.id,
          order_id: invoice.orderId,
          invoice_number: invoice.invoiceNumber,
          amount: invoice.amount,
          advance_paid: invoice.advancePaid,
          balance_paid: invoice.balancePaid,
          customer_name: invoice.customerName,
          customer_email: invoice.customerEmail,
          customer_phone: invoice.customerPhone,
          sent_to_email: invoice.sentToEmail,
          sent_at: invoice.sentAt,
        });
      } catch (err) {
        console.error("Supabase createInvoice error:", err);
      }
    }
    localCache.invoices.set(invoice.id, invoice);
    return invoice;
  },

  async getInvoiceByOrder(orderId: string): Promise<DBInvoice | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from("dikor_invoices").select("*").eq("order_id", orderId).maybeSingle();
        if (!error && data) {
          return {
            id: data.id,
            orderId: data.order_id,
            invoiceNumber: data.invoice_number,
            amount: data.amount,
            advancePaid: data.advance_paid,
            balancePaid: data.balance_paid,
            customerName: data.customer_name,
            customerEmail: data.customer_email,
            customerPhone: data.customer_phone,
            htmlContent: data.html_content || "",
            sentToEmail: data.sent_to_email,
            sentAt: data.sent_at,
            createdAt: data.created_at,
          };
        }
      } catch (err) {
        console.warn("Supabase getInvoice error:", err);
      }
    }
    for (const inv of localCache.invoices.values()) {
      if (inv.orderId === orderId) return inv;
    }
    return null;
  },
};

function mapRowToOrder(r: Record<string, any>): DBOrder {
  return {
    id: r.id,
    trackingToken: r.tracking_token || r.id,
    userId: r.user_id,
    customerName: r.customer_name || "Customer",
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    source: r.source || "web",
    title: r.title || "Custom 3D Figurine",
    category: r.category as Category,
    subjectName: r.subject_name || "",
    tagText: r.tag_text || "",
    description: r.notes || "",
    photos: Array.isArray(r.photos) ? r.photos : [],
    size: r.size || "Standard",
    material: "Precision SLA Resin + Hand-Paint",
    city: r.city || "Pan India",
    status: r.status as OrderStatus,
    totalPrice: r.total_price || 0,
    advancePct: r.advance_pct || 75,
    advanceAmount: r.advance_amount || 0,
    balanceAmount: r.balance_amount || 0,
    advancePaid: Boolean(r.advance_paid),
    balancePaid: Boolean(r.balance_paid),
    timelineDays: 12,
    approvalVideoUrl: r.approval_video_url || null,
    approvalPhotos: Array.isArray(r.approval_photos) ? r.approval_photos : [],
    studioNotes: r.studio_notes || "",
    revisionCount: 0,
    trackingNumber: r.tracking_number,
    courierPartner: r.courier_partner || "BlueDart Express",
    events: [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
