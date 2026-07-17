import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // ── Extract text fields ──────────────────────────────────────────────────
    const orderId            = formData.get("orderId")            as string;
    const customerName       = formData.get("customerName")       as string;
    const customerEmail      = formData.get("customerEmail")      as string;
    const customerPhone      = formData.get("customerPhone")      as string;
    const contactPreference  = formData.get("contactPreference")  as string;
    const contactHandle      = formData.get("contactHandle")      as string;
    const address            = formData.get("address")            as string;
    const orderDetails       = formData.get("orderDetails")       as string;
    const orderNotes         = formData.get("orderNotes")         as string;
    const totalAmount        = formData.get("totalAmount")        as string;

    // ── Extract optional image file ──────────────────────────────────────────
    const imageFile = formData.get("referenceImage") as File | null;

    // ── Build nodemailer attachment if image was provided ────────────────────
    const attachments: nodemailer.SendMailOptions["attachments"] = [];
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      attachments.push({
        filename: imageFile.name,
        content: Buffer.from(arrayBuffer),
        contentType: imageFile.type || "application/octet-stream",
      });
    }

    // ── SMTP config ──────────────────────────────────────────────────────────
    const host       = process.env.SMTP_HOST || "smtp.gmail.com";
    const port       = parseInt(process.env.SMTP_PORT || "465");
    const smtpUser   = process.env.SMTP_USER;
    const smtpPass   = process.env.SMTP_PASS;
    const ownerEmail = process.env.CONTACT_EMAIL || smtpUser || "ziilaserloja@gmail.com";

    const preferenceMap: Record<string, string> = {
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      facebook: "Facebook",
      email: "Email",
    };
    const friendlyPreference =
      preferenceMap[contactPreference?.toLowerCase()] || contactPreference;

    // ── Owner notification email (HTML) ──────────────────────────────────────
    const imageNote = imageFile && imageFile.size > 0
      ? `<p><strong>🖼️ Imagem de Referência:</strong> ${imageFile.name} <em>(ver anexo)</em></p>`
      : `<p><strong>🖼️ Imagem de Referência:</strong> Nenhuma</p>`;

    const ownerMailHtml = `
      <div style="font-family: sans-serif; color: #272727; max-width: 640px; margin: 0 auto; border: 1px solid #eee; padding: 24px; border-radius: 10px;">
        <h2 style="color: #815438; border-bottom: 2px solid #F2C879; padding-bottom: 8px;">
          🛒 Nova Encomenda — ${orderId}
        </h2>

        <h3 style="color: #555; margin-top: 20px;">👤 Dados do Cliente</h3>
        <p><strong>Nome:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Telefone:</strong> ${customerPhone}</p>
        <p><strong>Morada:</strong> ${address}</p>
        <p><strong>Contacto Preferido:</strong> ${friendlyPreference} — ${contactHandle}</p>

        <h3 style="color: #555; margin-top: 20px;">📦 Produtos</h3>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; white-space: pre-wrap; font-size: 13px;">${orderDetails}</pre>

        ${imageNote}

        <h3 style="color: #555; margin-top: 20px;">📝 Notas Adicionais</h3>
        <p style="background: #f9f9f9; padding: 10px; border-radius: 6px;">${orderNotes || "Nenhuma"}</p>

        <div style="background: #F5EDE3; border-left: 4px solid #B9844F; padding: 12px 16px; border-radius: 6px; margin-top: 20px;">
          <strong style="font-size: 18px;">💰 Total a Pagar: ${totalAmount}</strong>
        </div>

        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 11px; color: #aaa;">Zii Laser — Coimbra, Portugal</p>
      </div>
    `;

    // ── Simulate if SMTP is not configured ───────────────────────────────────
    if (!smtpUser || !smtpPass) {
      console.warn("SMTP não configurado. Simulação do envio de email de encomenda:");
      console.log({ orderId, customerName, customerEmail, totalAmount, hasImage: attachments.length > 0 });
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Email simulado com sucesso (SMTP não configurado).",
      });
    }

    // ── Send via nodemailer ──────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Loja Zii Laser" <${smtpUser}>`,
      to: ownerEmail,
      replyTo: customerEmail || undefined,
      subject: `[Nova Encomenda] ${orderId} — ${customerName}`,
      html: ownerMailHtml,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao processar encomenda:", error?.message || error);
    return NextResponse.json(
      { error: "Erro interno ao processar a encomenda.", detail: error?.message },
      { status: 500 }
    );
  }
}
