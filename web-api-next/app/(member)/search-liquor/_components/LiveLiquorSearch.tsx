"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function LiveLiquorSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const didMount = useRef(false);
  const userChangedValue = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (!userChangedValue.current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        nextParams.set("search", value.trim());
      } else {
        nextParams.delete("search");
      }
      if (!value.trim() && !nextParams.get("maxPrice")) {
        nextParams.delete("category");
      }
      const query = nextParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [pathname, router, searchParams, value]);

  return (
    <input
      type="search"
      value={value}
      onChange={(event) => {
        userChangedValue.current = true;
        setValue(event.target.value);
      }}
      placeholder="Search liquor"
      className="mt-3 h-11 w-full rounded bg-neutral-100 px-3 text-sm text-neutral-700 outline-none focus:ring-2 focus:ring-[#d8b52f]/40"
    />
  );
}
