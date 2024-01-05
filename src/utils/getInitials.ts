export default function getInitials(str: string): string {
  const [first, ...rest] = str
    .toUpperCase()
    .split(/(\s|-)+/)
    .filter((s) => s.length >= 1)
    .map((s) => s[0]);
  const [last] = rest.reverse();
  return [first, last].filter(Boolean).join("");
}
