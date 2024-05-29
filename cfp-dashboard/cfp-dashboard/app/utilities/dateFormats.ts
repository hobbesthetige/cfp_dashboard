export function formatDateInZuluTime(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ") + " Zulu";
}

export function formatTimeInAnnotatedZuluTime(date: Date): string {
  return date.toISOString().slice(11, 16) + " Zulu";
}