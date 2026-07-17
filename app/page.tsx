"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Calendar,
  ChatBubble,
  CheckCircle,
  CodeBrackets,
  Cookie,
  CreditCard,
  Database,
  Headset,
  Lock,
  Mail,
  PageSearch,
  Phone,
  Plus,
  Settings,
  ShieldCheck,
  UserBag,
  Xmark,
  XmarkCircle,
} from "iconoir-react";
import styles from "./page.module.css";

const faqs = [
  ["Qual a diferença entre Serasa e SPC?", "São birôs de crédito distintos. A Serasa consolida dados de bancos, financeiras, varejo e múltiplos setores em abrangência nacional; o SPC tem origem regional ligada a lojistas e CDL."],
  ["Existe contrato de fidelidade?", "Não. Você pode ajustar, reduzir ou cancelar o seu plano a qualquer momento, sem multa ou burocracia."],
  ["Preciso pagar por cada carta enviada ao devedor?", "Não há taxa por carta nem por baixa. A sua empresa tem previsibilidade para organizar a cobrança."],
  ["Quanto tempo leva para a negativação entrar na base Serasa?", "O devedor recebe uma comunicação e tem prazo para regularizar antes do registro. Em geral, são 10 dias corridos."],
  ["A Hiper Check atende pessoa física?", "Não. A Hiper Check atende exclusivamente empresas com CNPJ e soluções para gestão de crédito."],
  ["Como funciona a integração com o meu sistema?", "A API gratuita permite integrar consultas e negativações ao seu sistema. A equipe orienta todo o onboarding."],
];

const comparisonRows = [
  ["Fidelidade", "Sem fidelidade", "12 meses"],
  ["Carta Comunicando", "Gratuita", "Cobrado por envio"],
  ["Baixa de Negativação", "Gratuita", "Cobrado por baixa"],
  ["Base de dados", "Nacional (Serasa)", "Regional ou limitada"],
  ["Suporte", "Consultivo", "Básico ou inexistente"],
  ["API de Integração", "Gratuita", "Paga ou indisponível"],
  ["Flexibilidade de plano", "Alta", "Contrato fixo"],
];

const audience = [
  [CreditCard, "Vende a prazo", "Proteja cada venda antes que o prejuízo aconteça."],
  [Calendar, "Emite boletos", "Tenha uma cobrança mais forte e organizada."],
  [Settings, "Cobra mensalidades", "Automatize o processo sem perder o controle."],
  [UserBag, "Tem inadimplentes", "Recupere valores com consequência real."],
] as const;

const features = [
  [Database, "Relatórios de Dados", "Análises claras para decisões mais seguras."],
  [CodeBrackets, "API Gratuita", "Integre consultas e negativações ao seu sistema."],
  [ShieldCheck, "Negativação Serasa", "Registre pendências no canal de maior alcance."],
  [PageSearch, "Consulta de Crédito", "Conheça o risco antes de liberar crédito."],
  [ChatBubble, "Cobrança eficiente", "Mais força para recuperar sua carteira."],
] as const;

const benefits = [
  [Lock, "Sem fidelidade", "Cancele quando quiser, sem amarras."],
  [Mail, "Carta comunicando gratuita", "Sem cobranças extras no processo."],
  [CheckCircle, "Baixa de negativação gratuita", "Nada de taxa para finalizar."],
  [Headset, "Suporte consultivo", "Equipe ao seu lado em cada etapa."],
  [Settings, "Planos flexíveis", "Escolha o formato ideal para você."],
  [UserBag, "Treinamento online incluso", "Seu time pronto para começar."],
] as const;

function Logo() { return <img className="logo" src="/logo-hipercheck.png" alt="Hiper Check do Brasil" />; }
function LeadForm({ formId = "hero" }: { formId?: "hero" | "closing" }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(false); setSending(true);
    const form = new FormData(e.currentTarget); const utms = new URLSearchParams(window.location.search);
    try {
      const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ formId, name: form.get("name"), company: form.get("company"), cnpj: form.get("cnpj"), segment: form.get("segment"), whatsapp: form.get("whatsapp"), sellsOnCredit: form.get("sellsOnCredit"), utm_campaign: utms.get("utm_campaign") ?? "", utm_content: utms.get("utm_content") ?? "", utm_medium: utms.get("utm_medium") ?? "", referrer: document.referrer || "Acesso direto", url: window.location.href }) });
      if (!response.ok) throw new Error();
      (window as Window & { dataLayer?: object[] }).dataLayer?.push({ event: "generate_lead", form_location: formId }); setSent(true);
    } catch { setError(true); } finally { setSending(false); }
  }
  return <form className="lead-form" onSubmit={submit}>
    <h3>{sent ? "Recebemos seu pedido!" : "Solicite uma proposta"}</h3>
    <p>{sent ? "Em breve um especialista entrará em contato." : "Atendimento por especialista. Sem compromisso."}</p>
    {!sent && <><input name="name" required placeholder="Nome completo" /><div className="form-row"><input name="company" required placeholder="Empresa" /><input name="cnpj" required placeholder="CNPJ" /></div><input name="segment" placeholder="Segmento" /><input name="whatsapp" required placeholder="WhatsApp" /><select name="sellsOnCredit" defaultValue=""><option value="" disabled>Você vende a prazo ou emite boletos?</option><option value="SIM">Sim</option><option value="NÃO">Não</option></select><button disabled={sending}>{sending ? "Enviando..." : <>Quero uma proposta <ArrowRight aria-hidden="true" /></>}</button>{error && <p role="alert">Não foi possível enviar. Tente novamente.</p>}</>}
  </form>;
}
function Button({ children, secondary = false }: { children: React.ReactNode, secondary?: boolean }) { return <a href="#proposta" className={secondary ? "button secondary" : "button"}>{children}<ArrowRight aria-hidden="true" /></a>; }

export default function Home() {
  const [open, setOpen] = useState(0);
  const [cookies, setCookies] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const cleanupHover: Array<() => void> = [];
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.querySelectorAll<HTMLElement>("[data-hero-reveal]"), {
          autoAlpha: 0,
          y: 22,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.12,
        });

        root.querySelectorAll<HTMLElement>("section:not(.hero)").forEach((section) => {
          const targets = section.querySelectorAll<HTMLElement>(
            "h2, .intro, .split > div, .audience article, .cards article, .comparison-table-wrap, .center, .steps article, .faq-item"
          );
          if (!targets.length) return;
          gsap.from(targets, {
            autoAlpha: 0,
            y: 26,
            duration: 0.78,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: section, start: "top 55%", once: true },
          });
        });

        root.querySelectorAll<HTMLElement>("[data-counter]").forEach((element) => {
          const end = Number(element.dataset.counter);
          const prefix = element.dataset.prefix ?? "";
          const suffix = element.dataset.suffix ?? "";
          const fractionDigits = Number.isInteger(end) ? 0 : 2;
          const value = { current: 0 };
          gsap.to(value, {
            current: end,
            duration: 1.45,
            ease: "power2.out",
            snap: { current: fractionDigits ? 0.01 : 1 },
            scrollTrigger: { trigger: element, start: "top 60%", once: true },
            onUpdate: () => {
              element.textContent = `${prefix}${new Intl.NumberFormat("pt-BR", { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(value.current)}${suffix}`;
            },
          });
        });

        root.querySelectorAll<HTMLElement>(".audience article, .cards article, .steps article, .button, .lead-form button").forEach((target) => {
          const isButton = target.matches(".button, .lead-form button");
          const enter = () => gsap.to(target, {
            y: isButton ? -2 : -5,
            scale: isButton ? 1.015 : 1.01,
            duration: 0.22,
            ease: "power2.out",
            overwrite: "auto",
          });
          const leave = () => gsap.to(target, {
            y: 0,
            scale: 1,
            duration: 0.28,
            ease: "power2.out",
            overwrite: "auto",
          });
          target.addEventListener("pointerenter", enter);
          target.addEventListener("pointerleave", leave);
          cleanupHover.push(() => {
            target.removeEventListener("pointerenter", enter);
            target.removeEventListener("pointerleave", leave);
          });
        });
      });
      return () => media.revert();
    }, root);

    return () => {
      cleanupHover.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return <main ref={mainRef}>
    <section className="hero" id="proposta">
      <img className="glow" src="/glow-bg.png" alt="" /><div className="container"><header data-hero-reveal><Logo /></header><div className="hero-grid"><div className="hero-copy" data-hero-reveal><span className="eyebrow dark">Para empresas que não querem ver dinheiro ir embora</span><h1>Reduza a inadimplência <em>com a maior base de dados do país.</em></h1><p>A Hiper Check é uma Distribuidora Autorizada Serasa Experian e oferece negativação e análise de crédito para empresas. A inadimplência começa quando você vende sem consultar.</p><ul><li><CheckCircle aria-hidden="true" />Sem fidelidade</li><li><CheckCircle aria-hidden="true" />Sem taxa de carta</li><li><CheckCircle aria-hidden="true" />Baixa de boleto</li></ul><div className="hero-actions"><Button>Quero proteger meu caixa</Button><Button secondary>Ver como funciona</Button></div></div><div data-hero-reveal><LeadForm /></div></div></div><img className="hero-shapes" src="/shapes-hero.png" alt="" /></section>

    <section className="light section pain"><div className="container"><span className="eyebrow">Uma solução para o seu negócio</span><h2>Para empresas que estão cansadas de cobrar e continuar sem receber.</h2><p className="intro">Se sua empresa concede crédito próprio, emite boletos, cobra mensalidades ou tem uma carteira de inadimplentes que cresce todo mês, você está no lugar certo.</p><div className="audience">{audience.map(([Icon, title, description]) => <article key={title}><div className="card-icon"><Icon aria-hidden="true" /></div><b>{title}</b><p>{description}</p></article>)}</div></div></section>

    <section className="section process"><img className="shapes-process" src="/shapes-process.png" alt="" /><div className="container split"><div><span className="eyebrow">O problema é real</span><h2>O problema não é só o cliente que não paga. É o processo que não existe.</h2><p>A maioria das empresas perde dinheiro porque libera crédito sem consultar, cobra por WhatsApp sem consequência real e, quando decide agir, descobre um processo caro e burocrático.</p><aside>⚠️ Cadastre os clientes inadimplentes no canal oficial. Não é improviso. É consequência.</aside></div><div className="checks">{["Venda sem análise aumenta o risco de prejuízo.", "Cobrança manual consome tempo e não escala.", "SPC não tem a mesma base e abrangência nacional.", "Sem consequência, o devedor não prioriza pagar.", "Você paga caro por serviços que deveriam ser simples."].map(x => <p key={x}><XmarkCircle aria-hidden="true" />{x}</p>)}</div></div></section>

    <section className="serasa section"><img className="hcb-watermark" src="/hcb-mark.png" alt="" /><div className="container split"><div><span className="eyebrow dark">Parceiro autorizado Serasa Experian</span><h2>A maior base de dados de crédito do país está ao lado da sua empresa.</h2><p>A Hiper Check é uma Distribuidora Autorizada Serasa Experian. Sua empresa acessa informações completas e atualizadas sobre crédito, pendências, protestos e restrições financeiras.</p><small>Sem empresas locais: dados nacionais, precisos e atualizados.</small></div><div className={styles.serasaBrand}><span>Parceiro autorizado</span><img className="serasa-logo" src="/logo%20serasaexperian.png" alt="Serasa Experian" /></div></div></section>

    <section className="section"><div className="container"><span className="eyebrow">O que você tem na Hiper Check</span><h2>Tudo o que sua empresa precisa para vender com critério e cobrar com mais força.</h2><div className="grid cards">{features.map(([Icon, title, description]) => <article key={title}><i className="card-icon"><Icon aria-hidden="true" /></i><b>{title}</b><p>{description}</p></article>)}</div></div></section>

    <section className="pink section"><div className="container"><span className="eyebrow dark">Sem burocracia, sem taxas surpresa</span><h2>O que diferencia a Hiper Check na prática.</h2><p className="intro">Não cobramos o que os outros cobram. E isso faz diferença no final do mês.</p><div className="grid cards benefits">{benefits.map(([Icon, title, description]) => <article key={title}><i className="card-icon"><Icon aria-hidden="true" /></i><b>{title}</b><p>{description}</p></article>)}</div></div></section>

    <section className="section compare"><div className="container"><span className="eyebrow">Antes de escolher</span><h2>O barato que sai caro. <em>Calcule o custo total</em> antes de escolher.</h2><div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th scope="col">Critério</th><th scope="col" className="comparison-hiper">Hiper Check</th><th scope="col">Concorrentes comuns</th></tr></thead><tbody>{comparisonRows.map(([criterion, hiperCheck, competitors]) => <tr key={criterion}><th scope="row">{criterion}</th><td className="comparison-hiper"><CheckCircle className="comparison-check" aria-hidden="true" />{hiperCheck}</td><td><XmarkCircle className="comparison-cross" aria-hidden="true" />{competitors}</td></tr>)}</tbody></table></div><div className="center"><Button>Falar com especialista</Button></div></div></section>

    <section className="steps section"><img className="shapes-steps s1" src="/shapes-steps-1.png" alt="" /><img className="shapes-steps s2" src="/shapes-steps-2.png" alt="" /><div className="container"><span className="eyebrow dark">Simples e seguro</span><h2>Três passos para proteger o caixa da sua empresa.</h2><div className="grid"><article><b>01</b><h3>Fale com um especialista</h3><p>Entendemos o seu cenário e a melhor solução.</p></article><article><b>02</b><h3>Ative o acesso</h3><p>Processo rápido, guiado e sem burocracia.</p></article><article><b>03</b><h3>Consulte, cobre e recupere</h3><p>Mais critério para vender e cobrar.</p></article></div></div></section>

    <section className={`section ${styles.companies}`}><div className="container"><span className="eyebrow">Empresas protegidas</span><h2>Empresas que vendem a prazo usam a Hiper Check para <em>proteger o caixa.</em></h2><div className={styles.stats}><article><b data-counter="1600" data-prefix="+">+1.600</b><span>Empresas atendidas</span><small>Total de clientes atendidos</small></article><article><b data-counter="11239258.52" data-prefix="+">+11.239.258,52</b><span>Recuperados</span><small>Em valores de carteiras atendidas</small></article><article><b data-counter="30000" data-prefix="+">+30.000</b><span>Consultas por mês</span><small>Decisões de crédito mais seguras</small></article><article><b data-counter="15">15</b><span>Anos de mercado</span><small>Experiência para apoiar seu negócio</small></article></div></div></section>

    <section className="section faq"><div className="container"><span className="eyebrow">Dúvidas frequentes</span><h2>Perguntas de quem está avaliando a Hiper Check.</h2>{faqs.map(([q,a], i) => <div className="faq-item" key={q}><button onClick={() => setOpen(open === i ? -1 : i)}><span>{q}</span>{open === i ? <Xmark aria-label="Fechar resposta" /> : <Plus aria-label="Abrir resposta" />}</button>{open === i && <p>{a}</p>}</div>)}</div></section>

    <section className="closing section"><img className="glow" src="/glow-bg.png" alt="" /><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow dark">Proteja seu negócio</span><h2>Pare de vender no escuro. Pare de cobrar sem consequência.</h2><p>Fale com um especialista da Hiper Check e descubra como proteger o caixa da sua empresa com negativação e análise de crédito via Serasa.</p><ul><li><CheckCircle aria-hidden="true" />Negativação por experiência</li><li><CheckCircle aria-hidden="true" />Sem contratos de fidelidade</li><li><CheckCircle aria-hidden="true" />Cartas comunicantes gratuitas</li></ul></div><LeadForm /></div></section>
    <footer><div className="container"><Logo /><span>© 2026 Hiper Check do Brasil. Todos os direitos reservados.</span><span className="footer-contact"><Phone aria-hidden="true" />(77) 99838-1190 <Mail aria-hidden="true" />comercial@hipercheck.com.br</span></div></footer>
    {cookies && <div className="cookies"><Cookie aria-hidden="true" />Usamos cookies para personalizar conteúdos e melhorar a sua experiência.<button>Configurar</button><button className="accept" onClick={() => setCookies(false)}>Entendi e aceito</button><button className="close" onClick={() => setCookies(false)} aria-label="Fechar aviso de cookies"><Xmark aria-hidden="true" /></button></div>}
  </main>;
}
