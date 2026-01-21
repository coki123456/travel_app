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
    <Card variant="default" padding="lg" className="shadow-lg shadow-black/30">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-slate-100">Elementos del día</CardTitle>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {items.length} elementos
        </span>
      </CardHeader>

      <CardContent className="mt-5 space-y-6">
        {grouped.map((group) => (
          <div key={group.block} className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="uppercase tracking-[0.3em]">{group.label}</span>
              <span>{group.items.length}</span>
            </div>
            {group.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">
                Sin elementos todavía.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
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

      <AddItemForm date={date} />
    </Card>
  );
}
