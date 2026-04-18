import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-4 0v2M12 12v4M10 14h4" />
      </svg>
    ),
    title: "License Tracking",
    desc: "Every seat, renewal date, and usage metric in one unified view.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Cost Analytics",
    desc: "Intelligent insights that reveal hidden waste and optimization opportunities.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: "Smart Alerts",
    desc: "Proactive notifications for renewals, overages, and unused licenses.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    title: "Team Management",
    desc: "Seamlessly assign, revoke, and manage licenses as your organization scales.",
  },
];

const stats = [
  { value: "40%", label: "Average cost reduction" },
  { value: "200+", label: "App integrations" },
  { value: "< 2min", label: "Setup time" },
];

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .premium-btn {
          background: black;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 980px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.01em;
        }
        .premium-btn:hover {
          background: #1d1d1f;
          transform: scale(1.02);
        }

        .premium-btn-outline {
          background: transparent;
          color: black;
          border: 1.5px solid #d2d2d7;
          padding: 11px 24px;
          border-radius: 980px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.01em;
        }
        .premium-btn-outline:hover {
          border-color: black;
          background: rgba(0,0,0,0.03);
        }

        .feature-card {
          background: #fbfbfd;
          border: 1px solid #f5f5f7;
          border-radius: 24px;
          padding: 48px 36px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, transparent, rgba(0,0,0,0.1), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s;
        }
        .feature-card:hover::before {
          opacity: 1;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          border-color: #e5e5e7;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
        }

        .glass-nav {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
        }

        .gradient-text {
          background: linear-gradient(135deg, #1d1d1f 0%, #86868b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Premium Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={scrolled ? "glass-nav" : ""}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
        }}
      >
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              background: "black",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>LicenseIQ</span>
          </div>



          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="premium-btn-outline" onClick={() => navigate("/login")}>
              Sign in
            </button>
            <button className="premium-btn" onClick={() => navigate("/register-org")}>
              Register 
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{
          paddingTop: 140,
          paddingBottom: 100,
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0, 0, 0, 0.05)",
              padding: "6px 16px",
              borderRadius: 980,
              fontSize: 13,
              fontWeight: 500,
              color: "#1d1d1f",
              marginBottom: 24,
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#34c759"
              }} />
              Manage your software spend with confidence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontSize: "clamp(48px, 7vw, 80px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              marginBottom: 24,
              color: "#1d1d1f",
            }}
          >
            Manage your SaaS
            <br />
            licenses, smartly.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontSize: 21,
              lineHeight: 1.5,
              color: "#6e6e73",
              maxWidth: 640,
              margin: "0 auto 40px",
              fontWeight: 400,
            }}
          >
            Track usage, eliminate waste, and optimize every software dollar — all from one beautifully simple dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <button
              className="premium-btn"
              style={{ padding: "14px 32px", fontSize: 16 }}
              onClick={() => navigate("/dashboard")}
            >
              Start for free
            </button>

          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: 1080,
          margin: "80px auto",
          padding: "0 24px",
        }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 2,
          background: "#f5f5f7",
          borderRadius: 24,
          overflow: "hidden",
        }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                background: "white",
                padding: "48px 32px",
                textAlign: "center",
              }}
            >
              <div style={{
                fontSize: 56,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                marginBottom: 8,
                background: "linear-gradient(135deg, #1d1d1f 0%, #4a4a4a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: 15,
                color: "#6e6e73",
                fontWeight: 500,
              }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <section style={{ maxWidth: 1280, margin: "140px auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <h2 style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: 16,
            color: "#1d1d1f",
          }}>
            Everything you need.
            <br />
            <span className="gradient-text">Nothing you don't.</span>
          </h2>
          <p style={{
            fontSize: 19,
            color: "#6e6e73",
            maxWidth: 600,
            margin: "0 auto",
          }}>
            Powerful tools designed to give you complete control over your software spend.
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="feature-card"
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #f5f5f7 0%, #e5e5e7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                color: "#1d1d1f",
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 12,
                letterSpacing: "-0.01em",
                color: "#1d1d1f",
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: 16,
                color: "#6e6e73",
                lineHeight: 1.6,
              }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: 1080, margin: "140px auto 80px", padding: "0 24px" }}
      >
        <div style={{
          background: "linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)",
          borderRadius: 32,
          padding: "clamp(60px, 10vw, 100px) clamp(40px, 8vw, 80px)",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 20,
              letterSpacing: "-0.03em",
            }}>
              Stop paying for software
              <br />
              nobody actually uses.
            </h2>
            <p style={{
              fontSize: 18,
              color: "#a1a1a6",
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.5,
            }}>
              Join hundreds of teams that have already reduced their SaaS spend by up to 40%.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "white",
                color: "#1d1d1f",
                border: "none",
                padding: "16px 40px",
                borderRadius: 980,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 10px 30px rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              Get started free
            </button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #d2d2d7",
        padding: "40px 24px",
        marginTop: 100,
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}>
          <span style={{
            fontSize: 14,
            color: "#6e6e73",
          }}>
            © 2026 LicenseIQ. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 32 }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: 14,
                  color: "#6e6e73",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.color = "#1d1d1f"}
                onMouseLeave={(e) => e.target.style.color = "#6e6e73"}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}