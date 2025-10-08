export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300,
) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
