const http = require("http");

const boundary = "----FormBoundaryTest123";
const CRLF = "\r\n";

function buildFormField(name, value) {
  return (
    `--${boundary}${CRLF}` +
    `Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}` +
    `${value}${CRLF}`
  );
}

const bodyParts = [
  buildFormField("orderId", "VG-TEST001"),
  buildFormField("customerName", "Teste Cliente"),
  buildFormField("customerEmail", "ziilaserloja@gmail.com"),
  buildFormField("customerPhone", "912345678"),
  buildFormField("contactPreference", "email"),
  buildFormField("contactHandle", "ziilaserloja@gmail.com"),
  buildFormField("address", "Rua Teste 123, 3000-000 Coimbra, Portugal"),
  buildFormField("orderDetails", "1x Produto Teste - 10.00€"),
  buildFormField("orderNotes", "Nenhuma"),
  buildFormField("totalAmount", "10.00€"),
  `--${boundary}--${CRLF}`,
];

const body = bodyParts.join("");
const bodyBuffer = Buffer.from(body, "utf-8");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/order",
  method: "POST",
  headers: {
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    "Content-Length": bodyBuffer.length,
  },
};

console.log("A enviar pedido de teste para /api/order...\n");

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("Status HTTP:", res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log("Resposta:", JSON.stringify(json, null, 2));
      if (json.success) {
        console.log("\n✅ API funcionou! Email enviado (ou simulado).");
        if (json.simulated) {
          console.log("⚠️  Foi simulado — as credenciais SMTP não foram usadas.");
        } else {
          console.log("📧 Email real enviado via SMTP!");
        }
      } else {
        console.log("\n❌ Erro:", json.error);
        if (json.detail) console.log("Detalhe:", json.detail);
      }
    } catch {
      console.log("Resposta raw:", data);
    }
  });
});

req.on("error", (e) => {
  console.error("❌ Erro de ligação:", e.message);
  console.log("Garante que o servidor Next.js está a correr em localhost:3000");
});

req.write(bodyBuffer);
req.end();
