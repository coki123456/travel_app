"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import ItemCard from "../../components/items/ItemCard";
import AddItemForm from "../../components/items/AddItemForm";

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
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <CardTitle>Itinerario del día</CardTitle>
            </div>
            <span className="badge badge-accent">
              {items.length} {items.length === 1 ? 'elemento' : 'elementos'}
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
                <span className="text-xs text-[rgb(var(--color-text-tertiary))]">
                  {group.items.length}
                </span>
                <div className="h-px flex-1 bg-[rgb(var(--color-border-light))]"></div>
              </div>

              {group.items.length === 0 ? (
                <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-[rgb(var(--color-border-light))] bg-[rgb(var(--color-bg-tertiary))] p-6 text-center">
                  <svg className="w-8 h-8 mx-auto text-[rgb(var(--color-text-tertiary))] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                    Sin actividades en este bloque
                  </p>
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
