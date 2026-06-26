export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname !== "/api/schedule-request" || request.method !== "POST") {
      return new Response("Not found", { status: 404 });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ message: "Invalid JSON" }, 400);
    }

    const required = ["fullName", "propertyAddress", "phone", "email"];
    for (const field of required) {
      if (!data[field] || String(data[field]).trim().length < 2) {
        return json({ message: `Missing required field: ${field}` }, 400);
      }
    }

    const services = Array.isArray(data.services) ? data.services.join(", ") : "None selected";
    const submittedAt = new Date().toISOString();

    const body = [
      `New schedule request from Morton Lawn Co website`,
      ``,
      `Full Name: ${data.fullName}`,
      `Property Address: ${data.propertyAddress}`,
      `Phone Number: ${data.phone}`,
      `Email Address: ${data.email}`,
      `Services Needed: ${services}`,
      ``,
      `Additional Details / Message:`,
      `${data.message || "None provided"}`,
      ``,
      `Submitted At: ${submittedAt}`
    ].join("\n");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "Morton Lawn Co <website@mortonlawns.com>",
        to: ["schedule@mortonlawns.com"],
        reply_to: data.email,
        subject: `Schedule Request: ${data.fullName}`,
        text: body
      })
    });

    if (!resendResponse.ok) {
      const err = await resendResponse.text();
      console.error("Resend error", err);
      return json({ message: "Email send failed" }, 502);
    }

    return json({ ok: true }, 200);
  }
};

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
