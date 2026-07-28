"use client";

import { useMemo, useState } from "react";
import { formatNpr } from "@/lib/format";

type MonthlyPoint = {
  label: string;
  users: number;
  revenue: number;
};

export function AdminBarChart({ data }: { data: MonthlyPoint[] }) {
  const [mode, setMode] = useState<"revenue" | "users">("revenue");
  const maxValue = useMemo(
    () => Math.max(1, ...data.map((item) => mode === "revenue" ? item.revenue : item.users)),
    [data, mode]
  );

  return (
    <section className="mt-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">12 Month Report</h2>
          <p className="mt-1 text-sm text-neutral-500">Switch between monthly revenue and new users.</p>
        </div>
        <div className="rounded-lg bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setMode("revenue")}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === "revenue" ? "bg-[#d8b52f] text-[#3c3106]" : "text-neutral-600"}`}
          >
            Revenue
          </button>
          <button
            type="button"
            onClick={() => setMode("users")}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === "users" ? "bg-[#d8b52f] text-[#3c3106]" : "text-neutral-600"}`}
          >
            Users
          </button>
        </div>
      </div>

      <div className="mt-8 flex h-72 items-end gap-3 border-b border-l border-neutral-200 px-3 pb-3">
        {data.map((item) => {
          const value = mode === "revenue" ? item.revenue : item.users;
          const height = Math.max(value === 0 ? 0 : 8, Math.round((value / maxValue) * 220));
          return (
            <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-56 w-full items-end justify-center">
                <div
                  className="w-full max-w-10 rounded-t bg-[#806505] transition-all"
                  style={{ height }}
                  title={mode === "revenue" ? formatNpr(value) : `${value} user${value === 1 ? "" : "s"}`}
                />
              </div>
              <span className="text-xs font-semibold text-neutral-500">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-2 text-sm text-neutral-600 sm:grid-cols-3">
        <p>Total: <span className="font-bold text-neutral-950">{mode === "revenue" ? formatNpr(data.reduce((sum, item) => sum + item.revenue, 0)) : data.reduce((sum, item) => sum + item.users, 0)}</span></p>
        <p>Peak: <span className="font-bold text-neutral-950">{mode === "revenue" ? formatNpr(maxValue) : maxValue}</span></p>
        <p>Mode: <span className="font-bold capitalize text-neutral-950">{mode}</span></p>
      </div>
    </section>
  );
}
