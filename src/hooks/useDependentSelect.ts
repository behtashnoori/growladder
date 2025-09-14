import { useEffect, useState } from "react";

export function useDependentSelect(
  parent: string,
  child: string,
  setChild: (v: string) => void,
  mapping: Record<string, string[]>
): string[] {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const opts = mapping[parent] ?? [];
    setOptions(opts);
    if (child && !opts.includes(child)) {
      setChild("");
    }
  }, [parent, child, mapping, setChild]);

  return options;
}
