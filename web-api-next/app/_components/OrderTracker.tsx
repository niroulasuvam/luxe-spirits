const steps = ["accepted", "shipped", "delivered"] as const;

export function OrderTracker({ status, expectedDelivery }: { status: string; expectedDelivery?: string }) {
  const normalizedStatus = status === "paid" ? "accepted" : status;
  const currentIndex = normalizedStatus === "cancelled" || normalizedStatus === "pending" ? -1 : Math.max(0, steps.indexOf(normalizedStatus as (typeof steps)[number]));
  const expectedText = expectedDelivery
    ? new Date(expectedDelivery).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    : "";

  if (normalizedStatus === "cancelled") {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        Order cancelled
      </div>
    );
  }

  if (normalizedStatus === "pending") {
    return (
      <div className="rounded-lg bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700">
        Waiting for admin to accept this order.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => {
          const complete = index <= currentIndex;
          return (
            <div key={step} className="flex items-center gap-3">
              <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${complete ? "bg-green-600 text-white" : "bg-neutral-200 text-neutral-500"}`}>
                {index + 1}
              </span>
              <span className={`text-sm font-semibold capitalize ${complete ? "text-green-700" : "text-neutral-500"}`}>{step}</span>
            </div>
          );
        })}
      </div>
      {expectedText && normalizedStatus !== "delivered" ? (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          Estimated delivery: {expectedText}
        </p>
      ) : null}
    </div>
  );
}
