import { useEffect, useState } from "react";

export function useDependentSelect(
  parent: string,
  child: string,
  setChild: (v: string) => void,
  mapping: Record<string, string[]>
): string[] {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const all = Array.from(new Set(Object.values(mapping).flat()));
    const opts = parent ? mapping[parent] ?? [] : all;
    setOptions(opts);
    if (child && !opts.includes(child)) {
      setChild("");
    }
  }, [parent, child, mapping, setChild]);

  return options;
}
