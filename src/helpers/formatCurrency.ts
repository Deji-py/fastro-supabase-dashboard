function formatCurrency(amount: number, locale = "en-US", currency = "USD") {
  if (typeof amount !== "number") {
    amount = parseFloat(amount);
    if (isNaN(amount)) return "";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default formatCurrency;
