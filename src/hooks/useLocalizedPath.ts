// useLocalizedPath removed — Arabic support discontinued.
// Returns path as-is (English only).
export default function useLocalizedPath() {
  return (path: string): string => path;
}
