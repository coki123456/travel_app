"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import ItemCard from "../../components/items/ItemCard";
import AddItemForm from "../../components/items/AddItemForm";
import { EmojiIcon } from "../../components/ui/EmojiIcon";

type ItemView = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  block: string;
};

type ItemsBoardProps = {
  date: string;
  items: ItemView[];
};

const BLOCKS = [
  { value: "ALL_DAY", label: "Todo el día" },
  { value: "MORNING", label: "Mañana" },
  { value: "AFTERNOON", label: "Tarde" },
  { value: "EVENING", label: "Noche" },
];

export default function ItemsBoardRefactored({ date, items }: ItemsBoardProps) {
  const router = useRouter();

  const grouped = useMemo(() => {
    return BLOCKS.map((blockItem) => ({
      block: blockItem.value,
      label: blockItem.label,
      items: items.filter((item) => item.block === blockItem.value),
    }));
  }, [items]);

  const handleUpdate = () => {
    router.refresh();
  };

  const handleDelete = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Card variant="default" padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
                <EmojiIcon emoji="📆" label="Itinerario del día" className="text-lg" />
              </div>
              <CardTitle>Itinerario del día</CardTitle>
            </div>
            <span className="badge badge-accent">
              {items.length} {items.length === 1 ? "elemento" : "elementos"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="mt-6 space-y-8">
          {grouped.map((group) => (
            <div key={group.block} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[rgb(var(--color-border-light))]"></div>
                <span className="text-xs font-medium uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">
                  {group.label}
                </span>
                <span className="text-xs text-[rgb(var(--color-text-tertiary))]">{group.items.length}</span>
                <div className="h-px flex-1 bg-[rgb(var(--color-border-light))]"></div>
              </div>

              {group.items.length === 0 ? (
                <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-[rgb(var(--color-border-light))] bg-[rgb(var(--color-bg-tertiary))] p-6 text-center">
                  <EmojiIcon emoji="📂" label="Sin actividades" className="text-2xl opacity-60" />
                  <p className="text-sm text-[rgb(var(--color-text-secondary))]">Sin actividades en este bloque</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                      isSubmitting={false}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <AddItemForm date={date} />
    </div>
  );
}
