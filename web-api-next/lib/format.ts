export const formatNpr = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: amount >= 1000 ? 0 : 2,
  })
    .format(amount)
    .replace("NPR", "NRP");
