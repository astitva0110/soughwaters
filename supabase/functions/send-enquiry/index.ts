import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, phone, email, city, state } = await req.json();

    if (!name || !phone || !email || !city || !state) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const submittedOn = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    }) + " IST";

    // Save to database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("distributor_enquiries").insert({ name, phone, email, city, state });

    // Send email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY") ?? "re_iGnBXhGv_DpnKK2sawAxBjC8c6XMrMDiP";
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sough Waters <onboarding@resend.dev>",
          to: ["soughwaters@gmail.com"],
          subject: `New Distributor Enquiry – ${state}`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f4f7fb; margin: 0; padding: 32px 0; }
  .wrap { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
  .header { background: linear-gradient(135deg, #003D8F, #1FAEFF); padding: 36px 40px; }
  .header h1 { color: #fff; font-size: 22px; font-weight: 700; margin: 0 0 6px; letter-spacing: -0.3px; }
  .header p { color: rgba(255,255,255,0.7); font-size: 13px; margin: 0; }
  .body { padding: 36px 40px; }
  .divider { border: none; border-top: 1px solid #eef2f8; margin: 0; }
  .field { padding: 14px 0; border-bottom: 1px solid #f0f4fa; display: flex; align-items: flex-start; gap: 16px; }
  .field:last-child { border-bottom: none; }
  .label { color: #8899bb; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; min-width: 100px; padding-top: 1px; }
  .value { color: #1a2a4a; font-size: 14px; font-weight: 500; }
  .badge { display: inline-block; background: #e8f4ff; color: #1FAEFF; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-bottom: 20px; }
  .footer { padding: 20px 40px; background: #f8faff; border-top: 1px solid #eef2f8; }
  .footer p { color: #aab8cc; font-size: 11px; margin: 0; }
</style></head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>New Distributor Enquiry</h1>
      <p>Submitted via soughwaters.com</p>
    </div>
    <div class="body">
      <span class="badge">${state}</span>
      <hr class="divider">
      <div class="field"><span class="label">State</span><span class="value">${state}</span></div>
      <div class="field"><span class="label">Name</span><span class="value">${name}</span></div>
      <div class="field"><span class="label">Phone</span><span class="value">${phone}</span></div>
      <div class="field"><span class="label">Email</span><span class="value">${email}</span></div>
      <div class="field"><span class="label">City</span><span class="value">${city}</span></div>
      <div class="field"><span class="label">Submitted on</span><span class="value">${submittedOn}</span></div>
      <div class="field"><span class="label">Website</span><span class="value">soughwaters.com</span></div>
    </div>
    <div class="footer">
      <p>This enquiry was submitted through the Sough Waters distributor form. Reply directly to ${email} to get in touch with the applicant.</p>
    </div>
  </div>
</body>
</html>
          `,
          text: `New Distributor Enquiry\n\nState: ${state}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nSubmitted on: ${submittedOn}\nWebsite: soughwaters.com`,
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
