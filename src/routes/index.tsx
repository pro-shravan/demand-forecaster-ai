import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Brain, TrendingUp, ShieldCheck, Zap, BarChart3, Package,
  Sparkles, ArrowRight, Check, Star,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Foresight — AI Demand Prediction for Retailers" },
      { name: "description", content: "Predict demand, prevent stockouts, and grow revenue with AI-powered forecasting built for modern retail." },
      { property: "og:title", content: "Foresight — AI Demand Prediction" },
      { property: "og:description", content: "AI forecasting for inventory, sales, and business insights." },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Features />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-2xl grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">Foresight</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#benefits" className="hover:text-foreground transition">Benefits</a>
          <a href="#testimonials" className="hover:text-foreground transition">Customers</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition">Sign in</Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="rounded-full px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-[1.02]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-32 px-6">
      <div className="absolute inset-0 -z-10">
        <div className="glow-orb absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]" />
      </div>
      <div className="max-w-6xl mx-auto text-center">
        <motion.div {...fadeUp} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="size-3.5 text-primary" />
          Powered by Groq AI · Real-time inference
        </motion.div>
        <motion.h1
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Predict demand before <br />
          <span className="gradient-text">it happens.</span>
        </motion.h1>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          AI-based market demand prediction for modern retailers. Upload your sales,
          get accurate forecasts, and turn inventory into growth.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="group rounded-full px-7 py-3.5 text-sm font-semibold text-white flex items-center gap-2 transition hover:scale-[1.03]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Start forecasting free <ArrowRight className="size-4 group-hover:translate-x-0.5 transition" />
          </Link>
          <a href="#features" className="rounded-full border border-border/60 bg-card/40 backdrop-blur px-7 py-3.5 text-sm font-medium hover:bg-card/80 transition">
            See how it works
          </a>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.25 }}
          className="mt-20 relative"
        >
          <div className="glass-card p-2 md:p-4 mx-auto max-w-5xl">
            <div className="rounded-2xl overflow-hidden border border-border/40" style={{ background: "linear-gradient(180deg, oklch(0.18 0.005 60), oklch(0.14 0.005 60))" }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-8">
                {[
                  { label: "Prediction accuracy", value: "94.2%", icon: Brain },
                  { label: "Avg. revenue lift", value: "+27%", icon: TrendingUp },
                  { label: "Stockouts prevented", value: "1.4K", icon: Package },
                  { label: "Reports generated", value: "8.2K", icon: BarChart3 },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-card/60 border border-border/40 p-5 text-left">
                    <s.icon className="size-5 text-primary mb-3" />
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Brain, title: "AI demand engine", desc: "Groq-accelerated models analyze seasonality, trends, and customer patterns in real time." },
    { icon: Package, title: "Smart inventory", desc: "Get reorder recommendations, low-stock alerts, and overstock warnings automatically." },
    { icon: BarChart3, title: "Beautiful analytics", desc: "Interactive dashboards for sales, forecasts, categories, and prediction accuracy." },
    { icon: Zap, title: "One-click uploads", desc: "Import CSV sales data. Validation and preview built in — no setup required." },
    { icon: TrendingUp, title: "Business insights", desc: "AI-generated summaries and improvement suggestions tailored to your catalog." },
    { icon: ShieldCheck, title: "Enterprise-grade", desc: "Role-based access, row-level security, and audit-friendly reports out of the box." },
  ];
  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-medium text-primary">Features</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Everything you need to forecast demand.</h2>
          <p className="mt-4 text-muted-foreground">Built for retailers, analysts, and operations teams that move fast.</p>
        </motion.div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="glass-card p-8 group hover:border-primary/40 transition"
            >
              <div className="size-12 rounded-2xl grid place-items-center mb-5" style={{ background: "var(--gradient-primary)" }}>
                <f.icon className="size-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    "Reduce stockouts by up to 62%",
    "Cut excess inventory carrying cost",
    "AI-generated business summaries",
    "Real-time predictions with Groq",
    "PDF reports & email delivery",
    "Role-based access for teams",
  ];
  return (
    <section id="benefits" className="py-32 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeUp}>
          <div className="text-sm font-medium text-primary">Benefits</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Turn historical sales into <span className="gradient-text">forward-looking</span> revenue.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Foresight combines your sales, seasonality, and buying patterns to produce
            actionable inventory recommendations you can trust.
          </p>
          <ul className="mt-8 space-y-3">
            {items.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm">
                <div className="size-5 rounded-full grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
                  <Check className="size-3 text-white" />
                </div>
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="glass-card p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Predicted demand · next 30 days</div>
              <div className="mt-1 text-3xl font-bold">128,420 units</div>
            </div>
            <div className="rounded-full px-3 py-1 text-xs font-semibold text-primary bg-primary/10 border border-primary/30">
              94% confidence
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {[
              { name: "Electronics", pct: 82 },
              { name: "Apparel", pct: 64 },
              { name: "Home", pct: 48 },
              { name: "Beauty", pct: 33 },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">{c.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-primary)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { name: "Priya Shah", role: "Head of Ops, Nova Retail", quote: "Foresight replaced our spreadsheets overnight. Forecasts we trust and reports our board actually reads." },
    { name: "Marcus Weber", role: "CFO, LoomWorks", quote: "We cut carrying cost by 21% in the first quarter. The AI recommendations are eerily accurate." },
    { name: "Aiko Tanaka", role: "Analyst, KitoMart", quote: "Uploads, forecasts, PDF reports — it's the whole loop. Beautifully designed and blazing fast." },
  ];
  return (
    <section id="testimonials" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-medium text-primary">Customers</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Loved by data-driven teams.</h2>
        </motion.div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {t.map((x, i) => (
            <motion.div
              key={x.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="glass-card p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{x.quote}"</p>
              <div className="mt-6">
                <div className="font-semibold text-sm">{x.name}</div>
                <div className="text-xs text-muted-foreground">{x.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    { q: "How accurate are the forecasts?", a: "Our models routinely hit 90–95% accuracy on retail SKUs with at least 6 months of history. Groq-accelerated inference means predictions in seconds." },
    { q: "What data do I need to upload?", a: "A CSV of historical sales (date, SKU, quantity, revenue) is enough to get started. You can add inventory data for richer recommendations." },
    { q: "Can I export reports?", a: "Yes. Every report can be exported to PDF and emailed directly to your team via our built-in delivery." },
    { q: "Is my data secure?", a: "Absolutely. We use row-level security, role-based access, and encryption in transit and at rest." },
  ];
  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <div className="text-sm font-medium text-primary">FAQ</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Questions, answered.</h2>
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-12 glass-card p-2">
          <Accordion type="single" collapsible className="w-full">
            {qs.map((x, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/40 last:border-0 px-4">
                <AccordionTrigger className="text-left hover:no-underline text-base font-medium py-5">{x.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">{x.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-2xl grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-semibold">Foresight</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            AI-based market demand prediction for modern retail. Built for teams that move fast.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Product</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
            <li><a href="#benefits" className="hover:text-foreground">Benefits</a></li>
            <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Foresight. All rights reserved.
      </div>
    </footer>
  );
}
