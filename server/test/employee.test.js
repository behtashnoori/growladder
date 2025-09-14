import test from "node:test";
import assert from "node:assert";
import { employeeSchema } from "../src/validators/employee.js";

test("manager without dept passes", () => {
  const r = employeeSchema.safeParse({ id: "1", fullName: "a", rank: "مدیر" });
  assert.equal(r.success, true);
});

test("manager with dept fails", () => {
  const r = employeeSchema.safeParse({ id: "1", fullName: "a", rank: "مدیر", departmentId: "d" });
  assert.equal(r.success, false);
});

test("chief with section fails", () => {
  const r = employeeSchema.safeParse({ id: "1", fullName: "a", rank: "رئیس", sectionId: "s" });
  assert.equal(r.success, false);
});
