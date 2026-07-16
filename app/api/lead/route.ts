import { NextResponse } from "next/server";

const legacyForm = {
  element: "e_3600728_1_178170657146918253",
  fields: ["input_3600728_1_178170657146918253-nome", "input_3600728_1_1781706571469182531-e-mail", "input_1781706635", "input_1781706652", "input_1781706666", "input_1781706739", "input_1782426132", "input_1782426164", "input_1782426251"],
};

export async function POST(request: Request) {
  const lead = await request.json();
  if (!lead.name || !lead.company || !lead.cnpj || !lead.whatsapp) return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  const values = [lead.name, lead.company, lead.cnpj, lead.segment ?? "", lead.whatsapp, lead.sellsOnCredit ?? "", lead.utm_campaign ?? "", lead.utm_content ?? "", lead.utm_medium ?? ""];
  const titles = ["Nome completo", "Empresa", "CNPJ", "Segmento", "WhatsApp", "Você vende a prazo ou emite boletos?", "utm_campaign", "utm_content", "utm_medium"];
  const campos: Record<number, object> = Object.fromEntries(values.map((value, i) => [i, { id: legacyForm.fields[i], titulo: titles[i], valor: value, ...(i === 4 ? { tipo: "telefone" } : {}) }]));
  campos[9] = { id: "input_referral_source", titulo: "Referral source", valor: lead.referrer ?? "Acesso direto" };
  campos[10] = { id: "input_mobile", titulo: "Dispositivo", valor: "Não informado" };
  campos[11] = { id: "input_uri", titulo: "URL", valor: lead.url ?? "" };
  const response = await fetch(process.env.LEGACY_CONVERSION_URL ?? "https://lp.hipercheck.com.br/conversion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ campos, elemento: legacyForm.element, eid: `LP.${Date.now()}`, enav: "", eclid: "", euser: "" }) });
  if (!response.ok) return NextResponse.json({ error: "Falha ao encaminhar o lead." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
