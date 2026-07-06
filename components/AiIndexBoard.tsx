'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AiIndexItem } from '@/lib/types';

const orderKey = 'the-whale-ai-index-order-v1';

function applySavedOrder(items: AiIndexItem[], savedIds: string[]) {
  if (!savedIds.length) return items;
  const map = new Map(items.map((item) => [item.id, item]));
  const ordered: AiIndexItem[] = [];

  for (const id of savedIds) {
    const hit = map.get(id);
    if (hit) ordered.push(hit);
  }

  for (const item of items) {
    if (!savedIds.includes(item.id)) {
      ordered.push(item);
    }
  }

  return ordered;
}

export function AiIndexBoard({ items }: { items: AiIndexItem[] }) {
  const [ordered, setOrdered] = useState<AiIndexItem[]>(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(orderKey);
      const saved = raw ? (JSON.parse(raw) as string[]) : [];
      setOrdered(applySavedOrder(items, saved));
    } catch {
      setOrdered(items);
    }
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(orderKey, JSON.stringify(ordered.map((item) => item.id)));
  }, [ordered]);

  const itemCountLabel = useMemo(() => `${ordered.length} indexed items`, [ordered.length]);

  function moveCard(fromId: string, toId: string) {
    if (fromId === toId) return;
    const next = [...ordered];
    const fromIndex = next.findIndex((item) => item.id === fromId);
    const toIndex = next.findIndex((item) => item.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrdered(next);
  }

  return (
    <section className="space-y-6">
      <div className="whale-panel p-6">
        <h1 className="text-3xl font-black">AI Index Library</h1>
        <p className="mt-2 text-slate-600">Drag and drop cards to prioritize the index order used in your workflow. Order is saved on this device.</p>
        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-whale-700">{itemCountLabel}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ordered.map((item) => (
          <article
            key={item.id}
            draggable
            onDragStart={() => setDraggingId(item.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggingId) moveCard(draggingId, item.id);
              setDraggingId(null);
            }}
            onDragEnd={() => setDraggingId(null)}
            className="whale-panel cursor-move p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-whale-100 px-3 py-1 text-xs font-bold text-whale-800">{item.category}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{item.age_group ?? 'Any age'}</span>
            </div>
            <h2 className="mt-3 text-lg font-bold">{item.title}</h2>
            <p className="mt-2 line-clamp-5 text-sm leading-6 text-slate-600">{item.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
