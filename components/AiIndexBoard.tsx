'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AiIndexItem } from '@/lib/types';

const orderKey = 'the-whale-ai-index-order-v1';
const sectionKey = 'the-whale-ai-index-sections-v1';
const customColumnsKey = 'the-whale-ai-index-custom-columns-v1';

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
  const [sectionById, setSectionById] = useState<Record<string, string>>({});
  const [customColumns, setCustomColumns] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingOverSection, setDraggingOverSection] = useState<string | null>(null);
  const [renamingColumn, setRenamingColumn] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [newColumnName, setNewColumnName] = useState('');

  const getSectionForItem = (item: AiIndexItem) => sectionById[item.id] ?? item.category;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(orderKey);
      const saved = raw ? (JSON.parse(raw) as string[]) : [];
      setOrdered(applySavedOrder(items, saved));

      const rawSections = window.localStorage.getItem(sectionKey);
      const savedSections = rawSections ? (JSON.parse(rawSections) as Record<string, string>) : {};
      setSectionById(savedSections);

      const rawCustom = window.localStorage.getItem(customColumnsKey);
      const savedCustom = rawCustom ? (JSON.parse(rawCustom) as string[]) : [];
      setCustomColumns(savedCustom);
    } catch {
      setOrdered(items);
      setSectionById({});
      setCustomColumns([]);
    }
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(orderKey, JSON.stringify(ordered.map((item) => item.id)));
  }, [ordered]);

  useEffect(() => {
    window.localStorage.setItem(sectionKey, JSON.stringify(sectionById));
  }, [sectionById]);

  useEffect(() => {
    window.localStorage.setItem(customColumnsKey, JSON.stringify(customColumns));
  }, [customColumns]);

  const itemCountLabel = useMemo(() => `${ordered.length} indexed items`, [ordered.length]);
  const sections = useMemo(() => {
    const base = Array.from(new Set(ordered.map((item) => item.category)));
    const custom = customColumns.filter(Boolean);
    const mapped = Array.from(new Set(Object.values(sectionById).filter((s) => !base.includes(s))));
    return [...base, ...custom, ...mapped].filter((s, i, a) => a.indexOf(s) === i);
  }, [ordered, sectionById, customColumns]);

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

  function moveCardToSection(fromId: string, section: string) {
    const next = ordered.filter((item) => item.id !== fromId);
    const lastIndexInSection = next.reduce((idx, item, index) => {
      if ((sectionById[item.id] ?? item.category) === section) return index;
      return idx;
    }, -1);

    const moved = ordered.find((item) => item.id === fromId);
    if (!moved) return;

    if (lastIndexInSection >= 0) {
      next.splice(lastIndexInSection + 1, 0, moved);
    } else {
      next.push(moved);
    }

    setOrdered(next);
    setSectionById((prev) => ({ ...prev, [fromId]: section }));
  }

  function handleCardDrop(target: AiIndexItem) {
    if (!draggingId) return;
    moveCard(draggingId, target.id);
    const section = getSectionForItem(target);
    setSectionById((prev) => ({ ...prev, [draggingId]: section }));
    setDraggingId(null);
    setDraggingOverSection(null);
  }

  function handleSectionDrop(section: string) {
    if (!draggingId) return;
    moveCardToSection(draggingId, section);
    setDraggingId(null);
    setDraggingOverSection(null);
  }

  function addCustomColumn() {
    if (!newColumnName.trim()) return;
    if (customColumns.includes(newColumnName)) return;
    setCustomColumns((prev) => [...prev, newColumnName]);
    setNewColumnName('');
  }

  function renameColumn(oldName: string, newName: string) {
    if (!newName.trim() || newName === oldName) return;
    if (customColumns.includes(newName)) return;

    setCustomColumns((prev) => prev.map((col) => (col === oldName ? newName : col)));
    setSectionById((prev) => {
      const next = { ...prev };
      for (const [itemId, section] of Object.entries(next)) {
        if (section === oldName) {
          next[itemId] = newName;
        }
      }
      return next;
    });
    setRenamingColumn(null);
    setRenameValue('');
  }

  function deleteColumn(colName: string) {
    setCustomColumns((prev) => prev.filter((col) => col !== colName));
    setSectionById((prev) => {
      const next = { ...prev };
      for (const [itemId, section] of Object.entries(next)) {
        if (section === colName) {
          delete next[itemId];
        }
      }
      return next;
    });
  }

  return (
    <section className="space-y-6">
      <div className="whale-panel p-6">
        <h1 className="text-3xl font-black">AI Index Library</h1>
        <p className="mt-2 text-slate-600">Drag cards between sections/columns to group your index by workflow stage. Create custom columns to organize by your preferred workflow. Grouping and order are saved on this device.</p>
        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-whale-700">{itemCountLabel}</p>
        <div className="mt-4 flex gap-2">
          <input
            className="whale-input flex-1"
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addCustomColumn();
            }}
            placeholder="New column name..."
          />
          <button type="button" onClick={addCustomColumn} className="whale-button whitespace-nowrap">
            + Add Column
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {sections.map((section) => {
          const cards = ordered.filter((item) => getSectionForItem(item) === section);
          const isCustom = customColumns.includes(section);
          const isRenaming = renamingColumn === section;

          return (
            <div
              key={section}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggingOverSection(section);
              }}
              onDrop={() => handleSectionDrop(section)}
              onDragLeave={() => setDraggingOverSection((prev) => (prev === section ? null : prev))}
              className={`w-[20rem] shrink-0 rounded-3xl border bg-white/65 p-3 ${draggingOverSection === section ? 'border-whale-500 ring-2 ring-whale-200' : 'border-white/70'}`}
            >
              <div className="mb-3 flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2">
                <div className="flex-1">
                  {isRenaming ? (
                    <input
                      className="whale-input text-sm"
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') renameColumn(section, renameValue);
                        if (e.key === 'Escape') setRenamingColumn(null);
                      }}
                      onBlur={() => renameColumn(section, renameValue)}
                    />
                  ) : (
                    <>
                      <p className="text-sm font-black text-slate-900">{section}</p>
                      <p className="text-xs text-slate-600">{cards.length} items</p>
                    </>
                  )}
                </div>
                {isCustom && (
                  <div className="ml-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRenamingColumn(section);
                        setRenameValue(section);
                      }}
                      className="rounded px-2 py-1 text-xs font-bold text-whale-700 hover:bg-white/50"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteColumn(section)}
                      className="rounded px-2 py-1 text-xs font-bold text-red-600 hover:bg-white/50"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {cards.map((item) => (
                  <article
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggingId(item.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleCardDrop(item)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDraggingOverSection(null);
                    }}
                    className="whale-panel cursor-move p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-whale-100 px-3 py-1 text-xs font-bold text-whale-800">{item.category}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{item.age_group ?? 'Any age'}</span>
                    </div>
                    <h2 className="mt-3 text-base font-bold">{item.title}</h2>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">{item.content}</p>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
