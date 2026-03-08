import { useState, useEffect, useCallback } from "react";

const POINTS_PER_DOLLAR = 5;

const INITIAL_KIDS = [
  { id: "lucas", name: "Lucas", color: "#FF6B35", accent: "#FFD93D", emoji: "🎮" },
  { id: "marshall", name: "Marshall", color: "#4ECDC4", accent: "#A8FF78", emoji: "⚡" },
];

const QUICK_POINTS = [1, 5, 10];

const REASONS = [
  { label: "Used Nice Words 🙏", short: "Nice Words" },
  { label: "Helped Out 🤝", short: "Helped Out" },
  { label: "Great Attitude ⭐", short: "Great Attitude" },
  { label: "Completed Chore 🧹", short: "Did a Chore" },
  { label: "School Win 🎓", short: "School Win" },
  { label: "Bonus Awesome 🌟", short: "Bonus Awesome" },
];

function formatDollars(points) {
  return (points / POINTS_PER_DOLLAR).toFixed(2);
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function CoinBurst({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "inherit" }}>
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 10, height: 10,
          borderRadius: "50%",
          background: ["#FFD93D","#FF6B35","#4ECDC4","#A8FF78","#FF8CC8"][i % 5],
          animation: `burst-${i} 0.7s ease-out forwards`,
          transform: `rotate(${i * 30}deg)`,
        }} />
      ))}
      <style>{`
        ${[...Array(12)].map((_, i) => `
          @keyframes burst-${i} {
            0% { transform: translate(-50%,-50%) rotate(${i*30}deg) translateY(0px); opacity: 1; }
            100% { transform: translate(-50%,-50%) rotate(${i*30}deg) translateY(-${40 + Math.random()*30}px); opacity: 0; }
          }
        `).join("")}
      `}</style>
    </div>
  );
}

function KidCard({ kid, onAddPoints, onSpend }) {
  const [burst, setBurst] = useState(false);
  const [showSpend, setShowSpend] = useState(false);
  const [spendAmount, setSpendAmount] = useState("");
  const [spendReason, setSpendReason] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [customPoints, setCustomPoints] = useState("");
  const [selectedReason, setSelectedReason] = useState(REASONS[0].label);

  const triggerBurst = (pts) => {
    onAddPoints(kid.id, pts, selectedReason);
    setBurst(true);
    setTimeout(() => setBurst(false), 800);
  };

  const handleSpend = () => {
    const dollars = parseFloat(spendAmount);
    if (!isNaN(dollars) && dollars > 0) {
      onSpend(kid.id, dollars, spendReason || "Purchase");
      setSpendAmount("");
      setSpendReason("");
      setShowSpend(false);
    }
  };

  const dollars = formatDollars(kid.points);
  const recentHistory = (kid.history || []).slice(-20).reverse();

  return (
    <div style={{
      background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
      border: `2px solid ${kid.color}`,
      borderRadius: 20,
      padding: 24,
      position: "relative",
      boxShadow: `0 0 30px ${kid.color}44, 0 8px 32px #00000080`,
      flex: "1 1 340px",
      minWidth: 300,
      maxWidth: 480,
      overflow: "visible",
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        zIndex: 1,
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            fontSize: 36,
            background: `radial-gradient(circle, ${kid.color}33, transparent)`,
            borderRadius: "50%", width: 56, height: 56,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `2px solid ${kid.color}66`,
          }}>{kid.emoji}</div>
          <div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 16, color: kid.color,
              textShadow: `0 0 12px ${kid.color}`,
              letterSpacing: 1,
            }}>{kid.name.toUpperCase()}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, color: "#ffffff55", marginTop: 3, letterSpacing: 2 }}>
              PLAYER BANK
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: "#ffffff55", letterSpacing: 2 }}>STREAK</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: kid.accent }}>
              {(kid.history || []).length}
            </div>
          </div>
        </div>

        {/* Balance */}
        <div style={{
          background: "linear-gradient(135deg, #000000aa, #ffffff08)",
          border: `1px solid ${kid.color}44`,
          borderRadius: 12, padding: "16px 20px", marginBottom: 20,
          textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <CoinBurst active={burst} />
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, color: "#ffffff55", marginBottom: 6, letterSpacing: 3 }}>
            BALANCE
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 32, color: kid.accent,
            textShadow: `0 0 20px ${kid.accent}`,
          }}>
            ${dollars}
          </div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 13, color: "#ffffff44", marginTop: 6 }}>
            {kid.points} pts × $0.20/pt
          </div>
        </div>

        {/* Reason selector */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#ffffff55", marginBottom: 8, letterSpacing: 2 }}>AWARD REASON</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {REASONS.map(r => (
              <button key={r.label} onClick={() => setSelectedReason(r.label)} style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13,
                padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${selectedReason === r.label ? kid.color : "#ffffff22"}`,
                background: selectedReason === r.label ? `${kid.color}33` : "transparent",
                color: selectedReason === r.label ? kid.color : "#ffffffaa",
                transition: "all 0.15s",
                lineHeight: 1.3,
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        {/* Quick add points */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#ffffff55", marginBottom: 8, letterSpacing: 2 }}>AWARD POINTS</div>
          <div style={{ display: "flex", gap: 8 }}>
            {QUICK_POINTS.map(p => (
              <button key={p} onClick={() => triggerBurst(p)} style={{
                flex: 1, padding: "14px 0",
                fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 20,
                color: "#000", background: `linear-gradient(135deg, ${kid.color}, ${kid.accent})`,
                border: "none", borderRadius: 10, cursor: "pointer",
                boxShadow: `0 4px 12px ${kid.color}66`,
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >+{p}</button>
            ))}
          </div>
          {/* Custom points */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            <input
              type="number" min="1" placeholder="Custom points..."
              value={customPoints} onChange={e => setCustomPoints(e.target.value)}
              style={{
                width: "100%", background: "#ffffff0d", border: `1px solid ${kid.color}44`,
                borderRadius: 8, padding: "10px 12px", color: "#fff",
                fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 15, outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button onClick={() => {
              const p = parseInt(customPoints);
              if (p > 0) { triggerBurst(p); setCustomPoints(""); }
            }} style={{
              width: "100%", padding: "10px", background: `${kid.color}22`,
              border: `1px solid ${kid.color}`, borderRadius: 8, color: kid.color,
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer",
              boxSizing: "border-box",
            }}>Add Custom Points</button>
          </div>
        </div>

        {/* Spend */}
        <div style={{ marginBottom: 16 }}>
          {!showSpend ? (
            <button onClick={() => setShowSpend(true)} style={{
              width: "100%", padding: "12px",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16,
              background: "transparent", border: `1px solid #ff4444aa`,
              color: "#ff6666", borderRadius: 10, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ff444422"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >💸 Spend Money</button>
          ) : (
            <div style={{
              background: "#ff444411", border: "1px solid #ff444444",
              borderRadius: 10, padding: 12,
            }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#ff6666", marginBottom: 8, letterSpacing: 2 }}>DEDUCT AMOUNT</div>
              <input
                type="number" min="0.01" step="0.01" placeholder="$ Amount..."
                value={spendAmount} onChange={e => setSpendAmount(e.target.value)}
                style={{
                  width: "100%", background: "#ffffff0d", border: "1px solid #ff444466",
                  borderRadius: 6, padding: "9px 10px", color: "#fff",
                  fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 15, outline: "none",
                  boxSizing: "border-box", marginBottom: 6,
                }}
              />
              <input
                type="text" placeholder="What for? (e.g. Fortnite skin)"
                value={spendReason} onChange={e => setSpendReason(e.target.value)}
                style={{
                  width: "100%", background: "#ffffff0d", border: "1px solid #ff444466",
                  borderRadius: 6, padding: "9px 10px", color: "#fff",
                  fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 15, outline: "none",
                  boxSizing: "border-box", marginBottom: 8,
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={handleSpend} style={{
                  flex: 1, padding: "10px", background: "#ff333333",
                  border: "1px solid #ff4444", borderRadius: 6,
                  color: "#ff6666", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer",
                }}>✓ Confirm</button>
                <button onClick={() => setShowSpend(false)} style={{
                  flex: 1, padding: "10px", background: "transparent",
                  border: "1px solid #ffffff22", borderRadius: 6,
                  color: "#ffffff66", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
                }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* History toggle */}
        <button onClick={() => setShowHistory(!showHistory)} style={{
          width: "100%", padding: "10px",
          fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14,
          background: "transparent", border: `1px solid #ffffff22`,
          color: "#ffffff88", borderRadius: 8, cursor: "pointer", letterSpacing: 1,
        }}>
          {showHistory ? "▲ Hide History" : "▼ Show History"} ({(kid.history || []).length})
        </button>

        {showHistory && (
          <div style={{
            marginTop: 10, maxHeight: 200, overflowY: "auto",
            scrollbarWidth: "thin", scrollbarColor: `${kid.color}44 transparent`,
          }}>
            {recentHistory.length === 0 ? (
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#ffffff33", textAlign: "center", padding: 12 }}>
                No transactions yet
              </div>
            ) : recentHistory.map((h, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 8px",
                borderBottom: "1px solid #ffffff0d",
              }}>
                <div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: h.type === "spend" ? "#ff6666" : kid.accent }}>{h.reason}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#ffffff44", marginTop: 1 }}>{formatDate(h.ts)}</div>
                </div>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace", fontSize: 9, fontWeight: "bold",
                  color: h.type === "spend" ? "#ff4444" : "#44ff88",
                  whiteSpace: "nowrap", marginLeft: 8,
                }}>
                  {h.type === "spend" ? `-$${h.dollars.toFixed(2)}` : `+${h.points}pts`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [kids, setKids] = useState(() => {
    try {
      const saved = localStorage.getItem("kidbank-v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        return INITIAL_KIDS.map(k => ({
          ...k,
          ...(parsed.find(p => p.id === k.id) || {}),
        }));
      }
    } catch {}
    return INITIAL_KIDS.map(k => ({ ...k, points: 0, history: [] }));
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("kidbank-v1", JSON.stringify(
        kids.map(k => ({ id: k.id, points: k.points, history: k.history }))
      ));
    } catch {}
  }, [kids]);

  const showToast = (msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const addPoints = useCallback((id, pts, reason) => {
    setKids(prev => prev.map(k => k.id !== id ? k : {
      ...k,
      points: k.points + pts,
      history: [...(k.history || []), {
        type: "earn", points: pts, reason, ts: Date.now(),
      }],
    }));
    const kid = kids.find(k => k.id === id);
    showToast(`+${pts} pts for ${kid?.name}! 🎉`, kid?.color);
  }, [kids]);

  const spend = useCallback((id, dollars, reason) => {
    const pointsNeeded = Math.ceil(dollars * POINTS_PER_DOLLAR);
    setKids(prev => prev.map(k => {
      if (k.id !== id) return k;
      if (k.points < pointsNeeded) {
        showToast(`Not enough points! Need ${pointsNeeded} pts`, "#ff4444");
        return k;
      }
      return {
        ...k,
        points: k.points - pointsNeeded,
        history: [...(k.history || []), {
          type: "spend", dollars, points: pointsNeeded, reason, ts: Date.now(),
        }],
      };
    }));
    const kid = kids.find(k => k.id === id);
    showToast(`$${dollars.toFixed(2)} spent for ${kid?.name}`, "#ff6666");
  }, [kids]);

  const totalPoints = kids.reduce((s, k) => s + k.points, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0d0d1a 0%, #0a1628 50%, #0d0d1a 100%)",
      padding: "24px 16px 48px",
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ffffff22; border-radius: 2px; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes fadeInDown { from { opacity:0; transform: translateY(-16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
        @keyframes scanline { from { transform: translateY(-100%); } to { transform: translateY(100vh); } }
      `}</style>

      {/* Scanline effect */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 0, right: 0, height: "3px",
          background: "linear-gradient(transparent, rgba(255,255,255,0.03), transparent)",
          animation: "scanline 6s linear infinite",
        }} />
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(18px, 4vw, 28px)",
          color: "#FFD93D",
          textShadow: "0 0 24px #FFD93D, 0 0 48px #FFD93D88",
          marginBottom: 8,
          animation: "pulse-glow 3s ease-in-out infinite",
          letterSpacing: 2,
        }}>
          🏆 KID BANK
        </div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: "#ffffff44", letterSpacing: 4, marginBottom: 4 }}>
          REWARD ARCADE v1.0
        </div>
        <div style={{
          marginTop: 8, display: "inline-block",
          background: "#FFD93D11", border: "1px solid #FFD93D33",
          borderRadius: 20, padding: "5px 18px",
          fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: "#FFD93Daa",
        }}>
          5 pts = $1.00 &nbsp;·&nbsp; Total Pool: {totalPoints} pts (${formatDollars(totalPoints)})
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: "flex", gap: 20, flexWrap: "wrap",
        justifyContent: "center", maxWidth: 1000, margin: "0 auto",
      }}>
        {kids.map(kid => (
          <KidCard key={kid.id} kid={kid} onAddPoints={addPoints} onSpend={spend} />
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          background: "#0d0d1a", border: `1px solid ${toast.color}`,
          borderRadius: 12, padding: "12px 24px",
          fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16,
          color: toast.color, boxShadow: `0 0 24px ${toast.color}66`,
          zIndex: 1000, animation: "fadeInDown 0.3s ease",
          whiteSpace: "nowrap",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 40, fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#ffffff22", letterSpacing: 3 }}>
        INSERT COIN TO CONTINUE
      </div>
    </div>
  );
}
