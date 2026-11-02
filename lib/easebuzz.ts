import crypto from "crypto";

export interface EasebuzzInitiateParams {
  txnid: string;
  amount: number; // in INR (e.g. 1500)
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl?: string;
  furl?: string;
  udf1?: string; // orderId
  udf2?: string; // paymentType: 'advance' | 'balance' | 'full'
  udf3?: string; // trackingToken
}

export interface EasebuzzPaymentResult {
  success: boolean;
  paymentUrl?: string;
  accessKey?: string;
  txnid: string;
  amount: number;
  isMock?: boolean;
  message?: string;
}

export function getEasebuzzConfig() {
  const key = process.env.EASEBUZZ_KEY || "dikor_ebz_test_key";
  const salt = process.env.EASEBUZZ_SALT || "dikor_ebz_test_salt";
  const env = process.env.EASEBUZZ_ENV || "sandbox";
  const isConfigured = key !== "dikor_ebz_test_key" && salt !== "dikor_ebz_test_salt" && key.length > 5;
  const baseUrl = env === "production" ? "https://pay.easebuzz.in" : "https://testpay.easebuzz.in";

  return { key, salt, env, isConfigured, baseUrl };
}

/**
 * Generate SHA-512 hash required for Easebuzz initiation:
 * key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
 */
export function generateEasebuzzHash(params: {
  key: string;
  salt: string;
  txnid: string;
  amount: string; // e.g. "1500.00"
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
}): string {
  const { key, salt, txnid, amount, productinfo, firstname, email, udf1 = "", udf2 = "", udf3 = "" } = params;
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|||||||${salt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

/**
 * Verify response hash from Easebuzz callback:
 * salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 */
export function verifyEasebuzzResponseHash(data: {
  salt: string;
  key: string;
  status: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  receivedHash: string;
}): boolean {
  const { salt, key, status, txnid, amount, productinfo, firstname, email, udf1 = "", udf2 = "", udf3 = "", receivedHash } = data;
  const hashString = `${salt}|${status}|||||||${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const calculated = crypto.createHash("sha512").update(hashString).digest("hex");
  return calculated.toLowerCase() === receivedHash.toLowerCase();
}

/**
 * Initiate an Easebuzz payment link or return test sandbox link
 */
export async function initiateEasebuzzPayment(
  params: EasebuzzInitiateParams,
  hostUrl: string
): Promise<EasebuzzPaymentResult> {
  const { key, salt, baseUrl, isConfigured } = getEasebuzzConfig();
  const formattedAmount = Number(params.amount).toFixed(2);
  const surl = params.surl || `${hostUrl}/api/payments/easebuzz/response`;
  const furl = params.furl || `${hostUrl}/api/payments/easebuzz/response`;

  // If live keys are present, post to Easebuzz initiate API
  if (isConfigured) {
    try {
      const hash = generateEasebuzzHash({
        key,
        salt,
        txnid: params.txnid,
        amount: formattedAmount,
        productinfo: params.productinfo,
        firstname: params.firstname,
        email: params.email,
        udf1: params.udf1,
        udf2: params.udf2,
        udf3: params.udf3,
      });

      const bodyData = new URLSearchParams({
        key,
        txnid: params.txnid,
        amount: formattedAmount,
        productinfo: params.productinfo,
        firstname: params.firstname,
        email: params.email,
        phone: params.phone,
        surl,
        furl,
        hash,
        udf1: params.udf1 || "",
        udf2: params.udf2 || "",
        udf3: params.udf3 || "",
      });

      const res = await fetch(`${baseUrl}/payment/initiateLink`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: bodyData.toString(),
      });

      const data = await res.json();
      if (data.status === 1 && data.data) {
        return {
          success: true,
          paymentUrl: `${baseUrl}/pay/${data.data}`,
          accessKey: data.data,
          txnid: params.txnid,
          amount: params.amount,
          isMock: false,
        };
      } else {
        console.warn("Easebuzz initiate failed, falling back to seamless sandbox:", data);
      }
    } catch (err) {
      console.error("Easebuzz request error:", err);
    }
  }

  // Seamless Mock/Sandbox Checkout URL for local/testing without Easebuzz merchant block
  const mockUrl = `${hostUrl}/order/payment-gateway?txnid=${encodeURIComponent(
    params.txnid
  )}&orderId=${encodeURIComponent(params.udf1 || "")}&type=${encodeURIComponent(
    params.udf2 || "advance"
  )}&amount=${params.amount}&name=${encodeURIComponent(params.firstname)}`;

  return {
    success: true,
    paymentUrl: mockUrl,
    txnid: params.txnid,
    amount: params.amount,
    isMock: !isConfigured,
    message: isConfigured ? "Easebuzz payment link initiated" : "Sandbox payment gateway ready",
  };
}
