import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, subject, message, contactPreference, contactHandle } = body;

    // Check if fields are present
    if (!name || !message || !contactPreference || !contactHandle) {
      return NextResponse.json(
        { error: "Faltam campos obrigatórios." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "465");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    // CONTACT_EMAIL is where owner notifications are sent; defaults to SMTP_USER
    const ownerEmail = process.env.CONTACT_EMAIL || user || "ziilaserloja@gmail.com";

    const preferenceMap: Record<string, string> = {
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      facebook: "Facebook",
      email: "Email"
    };

    const friendlyPreference = preferenceMap[contactPreference.toLowerCase()] || contactPreference;
    const email = contactPreference.toLowerCase() === "email" ? contactHandle : null;

    // Format owner notification email content
    const ownerMailHtml = `
      <h2>Novo Contacto da Loja Online</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Assunto:</strong> ${subject || "Sem assunto"}</p>
      <p><strong>Preferência de Contacto:</strong> ${friendlyPreference} (${contactHandle})</p>
      <p><strong>Mensagem:</strong></p>
      <p style="white-space: pre-wrap; background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</p>
    `;

    // Format customer auto-reply email content
    const customerMailHtml = `
      <div style="font-family: sans-serif; color: #272727; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #815438;">Olá ${name},</h2>
        <p>Agradecemos o seu contacto na Zii Laser!</p>
        <p>Confirmamos que a sua mensagem foi recebida com sucesso. A nossa equipa irá responder o mais breve possível.</p>
        <p><strong>Por favor, aguarde uma resposta via a opção que escolheu na sua preferência de contacto:</strong></p>
        <div style="background-color: #F5EDE3; padding: 15px; border-radius: 8px; margin: 15px 0; font-weight: bold; border-left: 4px solid #B9844F;">
          ${friendlyPreference}: ${contactHandle}
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Zii Laser - Coimbra, Portugal | ziilaserloja@gmail.com</p>
      </div>
    `;

    if (!user || !pass) {
      console.warn("SMTP_USER e/ou SMTP_PASS não configurados em .env.local. Simulação do envio de email:");
      console.log("Email para Proprietário:", {
        to: ownerEmail,
        subject: `Novo Contacto: ${subject}`,
        html: ownerMailHtml
      });
      if (email) {
        console.log("Email para Cliente:", {
          to: email,
          subject: "Contacto Recebido - Zii Laser",
          html: customerMailHtml
        });
      }

      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Email simulado com sucesso (configuração SMTP em falta)."
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify SMTP connection before sending
    await transporter.verify();

    // 1. Send email to owner
    await transporter.sendMail({
      from: `"Loja Zii Laser" <${user}>`,
      to: ownerEmail,
      replyTo: email || undefined,
      subject: `[Contacto Loja] ${subject || "Nova mensagem"} - de ${name}`,
      html: ownerMailHtml,
    });

    // 2. Send auto-reply to customer (only if customer has an email address)
    if (email) {
      await transporter.sendMail({
        from: `"Zii Laser" <${user}>`,
        to: email,
        subject: "Recebemos o seu contacto - Zii Laser",
        html: customerMailHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error?.message || error);
    return NextResponse.json(
      { error: "Erro interno ao processar e enviar emails.", detail: error?.message },
      { status: 500 }
    );
  }
}
