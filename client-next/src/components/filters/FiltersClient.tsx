"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function FiltersClient() {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const query = new URLSearchParams();

      if (search) query.set("search", search);
      if (category) query.set("category", category);

      query.set("page", "1"); // reset page

      router.push(`/?${query.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div className="flex gap-2 mb-6">

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск"
        className="border p-2 rounded"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Все</option>
        <option value="tech">Техника</option>
        <option value="cars">Авто</option>
      </select>

    </div>
  );
}