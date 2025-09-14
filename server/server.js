import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Minimal employees endpoint
const employees = [
  { id: "e1", fullName: "کارمند نمونه ۱", unitId: "u1", rank: "کارشناس" },
  { id: "e2", fullName: "کارمند نمونه ۲", unitId: "u2", rank: "رئیس" },
];

app.get("/api/employees", (req, res) => {
  const q = (req.query.q || "").toString().trim().toLowerCase();
  const items = !q
    ? employees
    : employees.filter((e) => e.fullName.toLowerCase().includes(q));
  res.json({ items, total: items.length, page: 1, pageSize: items.length });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("API on http://localhost:" + PORT));
