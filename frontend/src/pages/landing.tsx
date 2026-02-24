import { useLocation } from "wouter";
import { ArrowRight, Sparkles, Zap, Clock, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.12.60/build/spline-viewer.js";
    document.head.appendChild(script);

    const removeWatermark = () => {
      const viewer = document.querySelector("spline-viewer");
      if (viewer?.shadowRoot) {
        // Try every selector Spline might use for the badge
        const selectors = [
          "#logo",
          "a[href*='spline']",
          "[class*='logo']",
          "[id*='logo']",
          "[class*='watermark']",
          "[id*='watermark']",
        ];
        selectors.forEach((sel) => {
          viewer.shadowRoot?.querySelectorAll(sel).forEach((el) => {
            (el as HTMLElement).style.cssText = "display:none!important;opacity:0!important;visibility:hidden!important;";
          });
        });
        // Inject a persistent <style> into the shadow root so it stays hidden
        if (!viewer.shadowRoot.querySelector("#wm-kill")) {
          const style = document.createElement("style");
          style.id = "wm-kill";
          style.textContent = `
            #logo, a[href*='spline'], [class*='logo'], [id*='logo'],
            [class*='watermark'], [id*='watermark'] {
              display: none !important;
              opacity: 0 !important;
              visibility: hidden !important;
              pointer-events: none !important;
            }
          `;
          viewer.shadowRoot.appendChild(style);
        }
      }
    };
    const interval = setInterval(removeWatermark, 300);
    const timeout = setTimeout(() => clearInterval(interval), 15000);

    setMounted(true);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const features = [
    { icon: Clock, title: "24/7 Available", desc: "Always here when you need it" },
    { icon: Zap, title: "Instant Responses", desc: "Zero wait time, pure speed" },
    { icon: Shield, title: "Smart & Accurate", desc: "Enterprise-grade AI" },
  ];

  return (
    <>
      <style>{`
        body { margin: 0; background: #050508; }
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm   { font-family: 'DM Sans', sans-serif; }

        spline-viewer { width: 100%; height: 100%; display: block; }

        .spline-fade::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right, #050508 0%, transparent 18%, transparent 78%, #050508 100%),
            linear-gradient(to bottom, #050508 0%, transparent 12%, transparent 88%, #050508 100%);
          pointer-events: none;
          z-index: 2;
        }

        .grain::after {
          content: '';
          position: fixed;
          inset: -200%;
          width: 400%;
          height: 400%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.035;
          animation: grain 0.6s steps(2) infinite;
          pointer-events: none;
          z-index: 999;
        }
        @keyframes grain {
          0%   { transform: translate(0,0); }
          25%  { transform: translate(-2%,-3%); }
          50%  { transform: translate(3%,2%); }
          75%  { transform: translate(-1%,4%); }
          100% { transform: translate(2%,-1%); }
        }

        .text-gradient {
          background: linear-gradient(130deg, #818cf8 0%, #a78bfa 55%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 6px 1px rgba(129,140,248,0.9); }
          50%       { box-shadow: 0 0 2px 0px rgba(129,140,248,0.3); }
        }
        .pulse-dot { animation: pulse-glow 2s ease-in-out infinite; }

        .fade-item { opacity: 0; transform: translateY(16px); }
        .mounted .fade-item:nth-child(1) { animation: fadeUp 0.7s 0.05s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mounted .fade-item:nth-child(2) { animation: fadeUp 0.7s 0.15s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mounted .fade-item:nth-child(3) { animation: fadeUp 0.7s 0.25s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mounted .fade-item:nth-child(4) { animation: fadeUp 0.7s 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mounted .fade-item:nth-child(5) { animation: fadeUp 0.7s 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

        .cta-btn { position: relative; overflow: hidden; }
        .cta-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.13), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .cta-btn:hover::before { opacity: 1; }
        .cta-btn:hover .btn-arrow { transform: translateX(3px); }
        .btn-arrow { transition: transform 0.2s ease; }

        .feature-card { transition: background 0.2s, border-color 0.2s, transform 0.2s; }
        .feature-card:hover {
          background: rgba(99,102,241,0.08) !important;
          border-color: rgba(99,102,241,0.22) !important;
          transform: translateY(-2px);
        }

        .nav-link { transition: color 0.15s; }
        .nav-link:hover { color: rgba(255,255,255,0.88) !important; }

        .blob-tr {
          position: absolute; pointer-events: none;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%);
          filter: blur(50px); top: -80px; right: 0;
        }
        .blob-br {
          position: absolute; pointer-events: none;
          width: 340px; height: 340px; border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%);
          filter: blur(60px); bottom: 40px; right: 140px;
        }
      `}</style>

      <div className="grain font-dm relative h-screen w-full overflow-hidden bg-[#050508]">
        <div className="blob-tr" />
        <div className="blob-br" />

        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-20 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-indigo-500/30 bg-gradient-to-br from-indigo-500/25 to-violet-600/10">
                <Sparkles className="h-[15px] w-[15px] text-indigo-400" />
              </div>
              <span className="font-syne text-[17px] font-bold tracking-tight text-white">Support AI</span>
            </div>

          </div>
        </header>

        {/* Body */}
        <div className="flex h-full pt-16">

          {/* Left — Spline */}
          <div className="spline-fade relative h-full w-1/2">
            <spline-viewer url="https://prod.spline.design/sTLa2aPjZZcYL2MY/scene.splinecode" />
            {/* Hard pixel cover over the "Built with Spline" badge */}
            <div className="absolute bottom-0 right-0 z-10 h-12 w-52 bg-[#050508]" />
          </div>

          {/* Right — Content */}
          <div className="flex h-full w-1/2 items-center justify-center px-12 xl:px-16">
            <div className={`flex w-full max-w-[480px] flex-col ${mounted ? "mounted" : ""}`}>

              {/* 1 · Badge */}
              <div className="fade-item mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5">
                <div className="pulse-dot h-[6px] w-[6px] rounded-full bg-indigo-400" />
                <span className="font-syne text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400">
                  AI-Powered Support
                </span>
              </div>

              {/* 2 · Heading — same bold scale as before */}
              <h1 className="font-syne fade-item mb-5 text-5xl font-extrabold leading-[1.06] tracking-[-2px] text-white xl:text-6xl">
                Your <span className="text-gradient">intelligent</span>
                <br />
                <span className="text-white/25">assistant</span>
              </h1>

              {/* 3 · Description */}
              <p className="fade-item mb-7 max-w-[380px] text-[15px] leading-[1.75] text-white/45">
                Get instant answers and personalized support powered by advanced AI — available around the clock, always accurate.
              </p>

              {/* 4 · CTA */}
              <div className="fade-item mb-9">
                <button
                  onClick={() => setLocation("/chat")}
                  className="cta-btn inline-flex cursor-pointer items-center gap-2.5 rounded-[13px] border-0 bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-3.5 font-syne text-[15px] font-bold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.45),0_8px_28px_rgba(99,102,241,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.6),0_14px_40px_rgba(99,102,241,0.42)] active:translate-y-0"
                >
                  Get Started
                  <ArrowRight className="btn-arrow h-4 w-4" />
                </button>
              </div>

              {/* Divider */}
              <div className="fade-item mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

              {/* 5 · Feature cards */}
              <div className="fade-item grid grid-cols-3 gap-2.5">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="feature-card cursor-default rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"
                  >
                    <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-[8px] bg-indigo-500/12">
                      <Icon className="h-3.5 w-3.5 text-indigo-400" />
                    </div>
                    <p className="font-syne mb-0.5 text-[12px] font-bold tracking-tight text-white">{title}</p>
                    <p className="text-[11px] leading-snug text-white/32">{desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}