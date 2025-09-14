import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true, time: new Date().toISOString() }));

function normalizeFa(x = "") {
  return String(x)
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, "")
    .replace(/[(),.;:؛،/_\-|]+/g, " ")
    .trim()
    .toLowerCase();
}

// Minimal employees endpoint
const employees = [
  {
    id: "e1",
    fullName: "کارمند نمونه ۱",
    employeeCode: "10000001",
    unitId: "u1",
    rank: "کارشناس",
  },
  {
    id: "e2",
    fullName: "کارمند نمونه ۲",
    employeeCode: "10000002",
    unitId: "u2",
    rank: "رئیس",
  },
];

app.get("/api/employees", (req, res) => {
  try {
    const q = normalizeFa(req.query.q || "");
    const list = Array.isArray(employees) ? employees : [];
    const items = !q
      ? list
      : list.filter((e) => {
          const haystack = [
            e.fullName,
            e.employeeCode,
            e.nationalId,
            e.unitId,
            e.rank,
          ]
            .filter(Boolean)
            .map(normalizeFa)
            .join(" ");
          return haystack.includes(q);
        });
    res.json({ items, total: items.length, page: 1, pageSize: items.length });
  } catch (err) {
    console.error("GET /api/employees failed:", err);
    res.status(500).json({ message: "خطا در پردازش لیست پرسنل" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("API on http://localhost:" + PORT));
