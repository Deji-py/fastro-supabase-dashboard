function formatNumber(value: number): string {
  if (value < 1000) return value.toString();

  const suffixes = ["", "K", "M", "B", "T"]; // Suffixes for thousands, millions, billions, etc.
  let suffixIndex = 0;
  let shortenedValue = value;

  while (shortenedValue >= 1000 && suffixIndex < suffixes.length - 1) {
    shortenedValue /= 1000;
    suffixIndex++;
  }

  // Round the shortened value to one decimal place for readability
  return `${shortenedValue.toFixed(1)}${suffixes[suffixIndex]}`;
}

export default formatNumber;
