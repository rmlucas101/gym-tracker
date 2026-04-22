import { useState, useEffect, useRef, useCallback } from "react";
 
// ─── DATA ────────────────────────────────────────────────────────────────────
const ROUTINE = [
  {
    id: 1,
    label: "DÍA 1",
    title: "PECHO / TRÍCEPS",
    groups: [
      {
        name: "PECHO",
        exercises: [
          { id: "1-1", name: "Pecho a 45°", sets: 4, reps: 12, equipment: "Máquina" },
          { id: "1-2", name: "Pecho plano", sets: 4, reps: 10, equipment: "Máquina" },
          { id: "1-3", name: "Apertura", sets: 4, reps: 15, equipment: "Peck Deck" },
        ],
      },
      {
        name: "TRÍCEPS",
        exercises: [
          { id: "1-4", name: "Tríceps francés", sets: 4, reps: 10, equipment: "Mancuerna" },
          { id: "1-5", name: "Tríceps con polea + soga", sets: 4, reps: 15, equipment: "Polea" },
          { id: "1-6", name: "Tríceps con polea", sets: 4, reps: 10, equipment: "Unilateral" },
        ],
      },
    ],
    cardio: { duration: 15, label: "Cardio aeróbico" },
  },
  {
    id: 2,
    label: "DÍA 2",
    title: "PIERNAS",
    groups: [
      {
        name: "PIERNAS",
        exercises: [
          { id: "2-1", name: "Sillón de cuádriceps", sets: 4, reps: 10, equipment: "1 pierna → 2 piernas" },
          { id: "2-2", name: "Prensa a 45°", sets: 4, reps: 10, equipment: "Máquina" },
          { id: "2-3", name: "Camilla isquio", sets: 4, reps: 10, equipment: "Máquina" },
          { id: "2-4", name: "Aductor", sets: 4, reps: 15, equipment: "Máquina" },
          { id: "2-5", name: "Gemelos", sets: 4, reps: 15, equipment: "Máquina" },
        ],
      },
    ],
    cardio: { duration: 15, label: "Cardio aeróbico" },
  },
  {
    id: 3,
    label: "DÍA 3",
    title: "ESPALDA / BÍCEPS",
    groups: [
      {
        name: "ESPALDA",
        exercises: [
          { id: "3-1", name: "Dorsales con polea", sets: 4, reps: 10, equipment: "Polea" },
          { id: "3-2", name: "Remo Hammer", sets: 4, reps: 10, equipment: "Abierto" },
          { id: "3-3", name: "Remo alto", sets: 4, reps: 12, equipment: "Polea" },
          { id: "3-4", name: "Remo bajo (cerrado)", sets: 4, reps: 15, equipment: "Polea" },
          { id: "3-5", name: "Posteriores", sets: 4, reps: 10, equipment: "Peck Deck" },
        ],
      },
      {
        name: "BÍCEPS",
        exercises: [
          { id: "3-6", name: "Curl de bíceps", sets: 4, reps: 10, equipment: "Mancuernas" },
          { id: "3-7", name: "Curl bíceps polea + soga", sets: 4, reps: 15, equipment: "Martillo" },
        ],
      },
    ],
    cardio: { duration: 15, label: "Cardio aeróbico" },
  },
  {
    id: 4,
    label: "DÍA 4",
    title: "HOMBROS / TRÍCEPS",
    groups: [
      {
        name: "HOMBROS",
        exercises: [
          { id: "4-1", name: "Press militar", sets: 4, reps: 10, equipment: "Máquina" },
          { id: "4-2", name: "Vuelos frontales", sets: 4, reps: 15, equipment: "Mancuernas" },
          { id: "4-3", name: "Vuelos laterales", sets: 4, reps: 15, equipment: "Mancuernas" },
        ],
      },
      {
        name: "TRÍCEPS",
        exercises: [
          { id: "4-4", name: "Tríceps con polea", sets: 4, reps: 15, equipment: "Unilateral" },
          { id: "4-5", name: "Tríceps con polea + soga", sets: 4, reps: 15, equipment: "Polea" },
          { id: "4-6", name: "Tríceps francés", sets: 4, reps: 15, equipment: "Mancuerna" },
        ],
      },
    ],
    cardio: { duration: 15, label: "Cardio aeróbico" },
  },
  {
    id: 5,
    label: "DÍA 5",
    title: "PIERNAS / BÍCEPS",
    groups: [
      {
        name: "PIERNAS",
        exercises: [
          { id: "5-1", name: "Sillón de cuádriceps", sets: 4, reps: 10, equipment: "1 pierna → 2 piernas" },
          { id: "5-2", name: "Prensa a 45°", sets: 4, reps: 10, equipment: "Máquina" },
          { id: "5-3", name: "Camilla isquio", sets: 4, reps: 10, equipment: "Máquina" },
          { id: "5-4", name: "Aductor", sets: 4, reps: 15, equipment: "Máquina" },
          { id: "5-5", name: "Gemelos", sets: 4, reps: 15, equipment: "Máquina" },
        ],
      },
      {
        name: "BÍCEPS",
        exercises: [
          { id: "5-6", name: "Curl de bíceps", sets: 4, reps: 10, equipment: "Mancuernas" },
          { id: "5-7", name: "Curl bíceps polea + soga", sets: 4, reps: 15, equipment: "Martillo" },
        ],
      },
    ],
    cardio: { duration: 15, label: "Cardio aeróbico" },
  },
];
 
const REST_TIME = 60; // seconds between sets
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
function initProgress() {
  const p = {};
  ROUTINE.forEach((day) => {
    p[day.id] = { completed: false, cardio: false, exercises: {} };
    day.groups.forEach((g) =>
      g.exercises.forEach((ex) => {
        p[day.id].exercises[ex.id] = { completedSets: 0, done: false };
      })
    );
  });
  return p;
}
 
function calcWeeklyStats(progress) {
  let total = 0;
  ROUTINE.forEach((day) => {
    Object.values(progress[day.id]?.exercises || {}).forEach((ex) => {
      total += ex.completedSets || 0;
    });
  });
  return total;
}
 
// ─── COMPONENTS ──────────────────────────────────────────────────────────────
 
function RestTimer({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) { onDone(); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onDone]);
  const pct = ((seconds - left) / seconds) * 100;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 200,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <p style={{ color: "#FFD700", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 4, marginBottom: 24 }}>DESCANSO</p>
      <div style={{ position: "relative", width: 160, height: 160 }}>
        <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="80" cy="80" r="70" fill="none" stroke="#222" strokeWidth="10" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="#FFD700" strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, color: "#fff",
        }}>{left}</div>
      </div>
      <button onClick={onDone} style={{
        marginTop: 32, background: "transparent", border: "1.5px solid #555", color: "#888",
        fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 3, padding: "10px 28px", cursor: "pointer",
      }}>SALTAR</button>
    </div>
  );
}
 
function DayCompleteAnimation({ dayTitle, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 300,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <style>{`
        @keyframes zoomIn { from { transform: scale(.4); opacity:0 } to { transform: scale(1); opacity:1 } }
        @keyframes sparkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,.4)} 70%{box-shadow:0 0 0 30px rgba(255,215,0,0)} }
      `}</style>
      <div style={{ animation: "zoomIn .5s cubic-bezier(.175,.885,.32,1.275) forwards", textAlign: "center" }}>
        <div style={{
          width: 120, height: 120, borderRadius: "50%", background: "#FFD700",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px", animation: "pulse 1.5s infinite",
        }}>
          <span style={{ fontSize: 56 }}>💪</span>
        </div>
        <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 6, color: "#FFD700", marginBottom: 8 }}>
          DÍA COMPLETADO
        </p>
        <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, color: "#fff", margin: "0 0 8px" }}>
          {dayTitle}
        </p>
        <p style={{ color: "#666", fontFamily: "sans-serif", fontSize: 14, marginBottom: 40 }}>
          ¡Excelente trabajo, campeón!
        </p>
        <button onClick={onClose} style={{
          background: "#FFD700", border: "none", color: "#000",
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 4,
          padding: "14px 40px", cursor: "pointer",
        }}>CONTINUAR</button>
      </div>
    </div>
  );
}
 
function WeekCompleteAnimation({ onReset }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.95)", zIndex: 400,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <style>{`
        @keyframes rotateStar { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bangIn { from{transform:scale(0) rotate(-10deg);opacity:0} to{transform:scale(1) rotate(0deg);opacity:1} }
      `}</style>
      <div style={{ animation: "bangIn .6s cubic-bezier(.175,.885,.32,1.275) forwards", textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 16, animation: "rotateStar 3s linear infinite" }}>🏆</div>
        <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 8, color: "#FFD700", marginBottom: 12 }}>
          SEMANA COMPLETADA
        </p>
        <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 46, color: "#fff", lineHeight: 1, marginBottom: 8 }}>
          SEMANA<br />TERMINADA
        </p>
        <p style={{ color: "#555", fontFamily: "sans-serif", fontSize: 14, marginBottom: 48 }}>
          5 días · 5 entrenamientos · 100% completado
        </p>
        <button onClick={onReset} style={{
          background: "#FFD700", border: "none", color: "#000",
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 4,
          padding: "16px 48px", cursor: "pointer",
        }}>REINICIAR SEMANA</button>
      </div>
    </div>
  );
}
 
function ProfileModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState(profile);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{ background: "#111", border: "1px solid #2a2a2a", padding: 32, width: "100%", maxWidth: 360 }}>
        <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: 4, color: "#FFD700", marginBottom: 28 }}>
          MI PERFIL
        </p>
        {[
          { key: "name", label: "NOMBRE", type: "text", placeholder: "Tu nombre" },
          { key: "weight", label: "PESO (kg)", type: "number", placeholder: "80" },
          { key: "height", label: "ALTURA (cm)", type: "number", placeholder: "175" },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key} style={{ marginBottom: 18 }}>
            <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 3, color: "#666", marginBottom: 6 }}>{label}</p>
            <input
              type={type}
              value={form[key]}
              placeholder={placeholder}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{
                width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a",
                color: "#fff", fontFamily: "sans-serif", fontSize: 16, padding: "10px 14px",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button onClick={() => { onSave(form); onClose(); }} style={{
            flex: 1, background: "#FFD700", border: "none", color: "#000",
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 3,
            padding: "12px 0", cursor: "pointer",
          }}>GUARDAR</button>
          <button onClick={onClose} style={{
            flex: 1, background: "transparent", border: "1px solid #333", color: "#888",
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 3,
            padding: "12px 0", cursor: "pointer",
          }}>CANCELAR</button>
        </div>
      </div>
    </div>
  );
}
 
function ExerciseCard({ exercise, exProgress, onSetComplete }) {
  const { completedSets, done } = exProgress;
  return (
    <div style={{
      background: done ? "rgba(255,215,0,.05)" : "#0e0e0e",
      border: done ? "1px solid rgba(255,215,0,.3)" : "1px solid #1c1c1c",
      padding: "16px 18px", marginBottom: 10,
      transition: "all .3s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, letterSpacing: 1,
            color: done ? "#FFD700" : "#fff", margin: 0,
          }}>
            {done && "✓ "}{exercise.name}
          </p>
          <p style={{ color: "#444", fontSize: 12, margin: "4px 0 0", fontFamily: "sans-serif" }}>
            {exercise.equipment} · {exercise.sets} × {exercise.reps} reps
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 28,
            color: done ? "#FFD700" : "#333",
          }}>{completedSets}/{exercise.sets}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: exercise.sets }).map((_, i) => (
          <button
            key={i}
            disabled={done || i > completedSets}
            onClick={() => !done && i === completedSets && onSetComplete()}
            style={{
              flex: 1, height: 36, border: "none", cursor: (done || i > completedSets) ? "default" : "pointer",
              background: i < completedSets ? "#FFD700" : (i === completedSets && !done) ? "#1e1e0a" : "#151515",
              outline: i === completedSets && !done ? "1px solid #FFD700" : "none",
              transition: "all .2s",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: i < completedSets ? "#000" : "#333",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 13,
            }}
          >
            {i < completedSets ? "✓" : `S${i + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}
 
// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GymTracker() {
  const [activeTab, setActiveTab] = useState("week");
  const [activeDay, setActiveDay] = useState(null);
  const [progress, setProgress] = useState(initProgress);
  const [profile, setProfile] = useState({ name: "", weight: "", height: "" });
  const [restActive, setRestActive] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [dayComplete, setDayComplete] = useState(null);
  const [weekComplete, setWeekComplete] = useState(false);
 
  const weekStats = calcWeeklyStats(progress);
  const daysCompleted = ROUTINE.filter((d) => progress[d.id]?.completed).length;
 
  const handleSetComplete = useCallback((dayId, exId, totalSets) => {
    setProgress((prev) => {
      const ex = prev[dayId].exercises[exId];
      const newSets = ex.completedSets + 1;
      const done = newSets >= totalSets;
      const newEx = { completedSets: newSets, done };
      const newExMap = { ...prev[dayId].exercises, [exId]: newEx };
 
      // check if all exercises of the day are done
      const allExDone = Object.values(newExMap).every((e) => e.done);
      return {
        ...prev,
        [dayId]: { ...prev[dayId], exercises: newExMap, completed: allExDone && prev[dayId].cardio },
      };
    });
    setRestActive(true);
  }, []);
 
  const handleCardioDone = useCallback((dayId) => {
    setProgress((prev) => {
      const allExDone = Object.values(prev[dayId].exercises).every((e) => e.done);
      const newDay = { ...prev[dayId], cardio: true, completed: allExDone };
      const newP = { ...prev, [dayId]: newDay };
 
      if (allExDone) {
        // check week
        const allDaysDone = ROUTINE.every((d) => newP[d.id].completed);
        if (allDaysDone) setTimeout(() => setWeekComplete(true), 600);
        else setTimeout(() => setDayComplete(dayId), 400);
      }
      return newP;
    });
  }, []);
 
  const resetWeek = useCallback(() => {
    setProgress(initProgress());
    setWeekComplete(false);
    setActiveDay(null);
  }, []);
 
  const day = activeDay ? ROUTINE.find((d) => d.id === activeDay) : null;
  const dayProg = activeDay ? progress[activeDay] : null;
 
  // ── Week Overview ──
  const WeekView = () => (
    <div style={{ padding: "0 16px 100px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>
 
      {/* Header */}
      <div style={{ paddingTop: 20, marginBottom: 28 }}>
        <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 6, color: "#555", marginBottom: 4 }}>
          SEMANA ACTUAL
        </p>
        <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: "#fff", margin: 0 }}>
          {profile.name ? `HOLA, ${profile.name.toUpperCase()}` : "TU RUTINA"}
        </p>
      </div>
 
      {/* Stats bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {[
          { label: "DÍAS", val: `${daysCompleted}/5` },
          { label: "SERIES HOY", val: weekStats },
        ].map(({ label, val }) => (
          <div key={label} style={{ flex: 1, background: "#0e0e0e", border: "1px solid #1c1c1c", padding: "14px 16px" }}>
            <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "#FFD700", margin: 0 }}>{val}</p>
            <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, fontFamily: "'Bebas Neue',sans-serif", margin: 0 }}>{label}</p>
          </div>
        ))}
        {profile.weight && (
          <div style={{ flex: 1, background: "#0e0e0e", border: "1px solid #1c1c1c", padding: "14px 16px" }}>
            <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "#FFD700", margin: 0 }}>{profile.weight}<span style={{ fontSize: 14 }}>kg</span></p>
            <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, fontFamily: "'Bebas Neue',sans-serif", margin: 0 }}>PESO</p>
          </div>
        )}
      </div>
 
      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#444", fontSize: 11, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 3 }}>PROGRESO SEMANAL</span>
          <span style={{ color: "#FFD700", fontSize: 11, fontFamily: "'Bebas Neue',sans-serif" }}>{Math.round((daysCompleted / 5) * 100)}%</span>
        </div>
        <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2 }}>
          <div style={{
            height: "100%", background: "#FFD700", borderRadius: 2,
            width: `${(daysCompleted / 5) * 100}%`, transition: "width .6s ease",
          }} />
        </div>
      </div>
 
      {/* Day cards */}
      {ROUTINE.map((d) => {
        const dp = progress[d.id];
        const exCount = d.groups.reduce((a, g) => a + g.exercises.length, 0);
        const doneSets = Object.values(dp.exercises).reduce((a, e) => a + e.completedSets, 0);
        const totalSets = d.groups.reduce((a, g) => a + g.exercises.reduce((b, e) => b + e.sets, 0), 0);
        const pct = Math.round((doneSets / totalSets) * 100);
 
        return (
          <button key={d.id} onClick={() => { setActiveDay(d.id); setActiveTab("day"); }}
            style={{
              width: "100%", background: dp.completed ? "rgba(255,215,0,.06)" : "#0e0e0e",
              border: dp.completed ? "1px solid rgba(255,215,0,.4)" : "1px solid #1c1c1c",
              padding: "18px 20px", marginBottom: 10, textAlign: "left", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 16,
            }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: dp.completed ? "#FFD700" : "#151515",
              border: dp.completed ? "none" : "1px solid #2a2a2a",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 13,
              color: dp.completed ? "#000" : "#555", flexShrink: 0,
            }}>{dp.completed ? "✓" : d.id}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 3, color: dp.completed ? "#FFD700" : "#555", margin: "0 0 2px" }}>{d.label}</p>
              <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: dp.completed ? "#FFD700" : "#fff", margin: "0 0 6px" }}>{d.title}</p>
              <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2 }}>
                <div style={{ height: "100%", background: "#FFD700", borderRadius: 2, width: `${pct}%`, transition: "width .4s" }} />
              </div>
              <p style={{ color: "#444", fontSize: 11, fontFamily: "sans-serif", margin: "4px 0 0" }}>{doneSets}/{totalSets} series · {exCount} ejercicios</p>
            </div>
            <span style={{ color: "#333", fontSize: 20 }}>›</span>
          </button>
        );
      })}
    </div>
  );
 
  // ── Day Detail ──
  const DayView = () => {
    if (!day) return null;
    const totalSets = day.groups.reduce((a, g) => a + g.exercises.reduce((b, e) => b + e.sets, 0), 0);
    const doneSets = Object.values(dayProg.exercises).reduce((a, e) => a + e.completedSets, 0);
    const allExDone = day.groups.every((g) => g.exercises.every((e) => dayProg.exercises[e.id].done));
 
    return (
      <div style={{ padding: "0 16px 100px" }}>
        <button onClick={() => setActiveTab("week")} style={{
          background: "none", border: "none", color: "#FFD700", cursor: "pointer",
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 3, paddingTop: 20, paddingLeft: 0,
        }}>← SEMANA</button>
 
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 5, color: "#555", margin: "8px 0 2px" }}>{day.label}</p>
          <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, color: "#fff", margin: "0 0 14px" }}>{day.title}</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#444", fontSize: 11, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 3 }}>SERIES COMPLETADAS</span>
            <span style={{ color: "#FFD700", fontSize: 11, fontFamily: "'Bebas Neue',sans-serif" }}>{doneSets}/{totalSets}</span>
          </div>
          <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, marginBottom: 20 }}>
            <div style={{ height: "100%", background: "#FFD700", borderRadius: 2, width: `${(doneSets / totalSets) * 100}%`, transition: "width .3s" }} />
          </div>
        </div>
 
        {day.groups.map((group) => (
          <div key={group.name} style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 5, color: "#FFD700", marginBottom: 12 }}>{group.name}</p>
            {group.exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                exProgress={dayProg.exercises[ex.id]}
                onSetComplete={() => handleSetComplete(day.id, ex.id, ex.sets)}
              />
            ))}
          </div>
        ))}
 
        {/* Cardio */}
        <div style={{
          background: dayProg.cardio ? "rgba(255,215,0,.05)" : "#0e0e0e",
          border: dayProg.cardio ? "1px solid rgba(255,215,0,.3)" : "1px solid #1c1c1c",
          padding: "18px 20px", marginBottom: 10,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 4, color: "#555", margin: "0 0 4px" }}>CARDIO FINAL</p>
              <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: dayProg.cardio ? "#FFD700" : "#fff", margin: 0 }}>
                {dayProg.cardio && "✓ "}Aeróbico — {day.cardio.duration} min
              </p>
            </div>
            {!dayProg.cardio && (
              <button
                disabled={!allExDone}
                onClick={() => handleCardioDone(day.id)}
                style={{
                  background: allExDone ? "#FFD700" : "#151515",
                  border: allExDone ? "none" : "1px solid #2a2a2a",
                  color: allExDone ? "#000" : "#333",
                  fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 2,
                  padding: "10px 18px", cursor: allExDone ? "pointer" : "default",
                }}>HECHO</button>
            )}
          </div>
        </div>
      </div>
    );
  };
 
  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; }
        input::placeholder { color: #333; }
      `}</style>
 
      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100, background: "#080808",
        borderBottom: "1px solid #111", padding: "14px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: "#FFD700", letterSpacing: 3 }}>GYM</span>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: "#fff", letterSpacing: 3, marginLeft: 4 }}>TRACKER</span>
        </div>
        <button onClick={() => setShowProfile(true)} style={{
          background: "#111", border: "1px solid #2a2a2a", color: "#FFD700",
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 3,
          padding: "8px 14px", cursor: "pointer",
        }}>
          {profile.name ? profile.name.split(" ")[0].toUpperCase() : "PERFIL"}
        </button>
      </div>
 
      {/* Content */}
      <div style={{ overflowY: "auto", height: "calc(100vh - 118px)" }}>
        {activeTab === "week" ? <WeekView /> : <DayView />}
      </div>
 
      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "#0a0a0a", borderTop: "1px solid #1a1a1a",
        display: "flex",
      }}>
        {[
          { key: "week", label: "SEMANA", icon: "▦" },
          { key: "day", label: "HOY", icon: "⚡" },
        ].map(({ key, label, icon }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            flex: 1, background: "none", border: "none", padding: "14px 0",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 18, color: activeTab === key ? "#FFD700" : "#333" }}>{icon}</span>
            <span style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 3,
              color: activeTab === key ? "#FFD700" : "#333",
            }}>{label}</span>
          </button>
        ))}
      </div>
 
      {/* Modals & overlays */}
      {restActive && <RestTimer seconds={REST_TIME} onDone={() => setRestActive(false)} />}
      {showProfile && <ProfileModal profile={profile} onSave={setProfile} onClose={() => setShowProfile(false)} />}
      {dayComplete && (
        <DayCompleteAnimation
          dayTitle={ROUTINE.find((d) => d.id === dayComplete)?.title}
          onClose={() => setDayComplete(null)}
        />
      )}
      {weekComplete && <WeekCompleteAnimation onReset={resetWeek} />}
    </div>
  );
}
 
