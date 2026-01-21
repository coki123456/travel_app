"use client";

import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/Card";

type DaySummary = {
  id: string;
  date: Date;
  city: string | null;
  summary: string | null;
};

interface DailyItineraryCardProps {
  day: DaySummary | undefined;
  date: Date;
  dateKey: string;
}

const formatLongDate = (date: Date) =>
  date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export default function DailyItineraryCard({
  day,
  date,
  dateKey,
}: DailyItineraryCardProps) {
  return (
    <Card variant="white" padding="none" className="flex flex-col h-full">
      {/* Panel Header */}
      <CardHeader className="p-6 border-b border-gray-200 mb-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">📋</div>
          <h3 className="text-lg font-bold text-gray-900">
            Itinerario del Día
          </h3>
        </div>
        <p className="text-sm text-gray-600 capitalize">
          {formatLongDate(date)}
        </p>
      </CardHeader>

      {/* Day Content */}
      <CardContent className="flex-1 overflow-y-auto p-6">
        {day?.summary ? (
          <>
            <h4 className="text-base font-bold text-gray-900 mb-3">
              {day.summary}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Hoy visitaremos el famoso Coliseo Romano. Luego, exploraremos el
              Foro Romano y el Monte Palatino.
            </p>

            {/* Timeline */}
            <div className="space-y-4">
              {[
                { time: "9:00 AM", title: "Tour por el Coliseo", checked: true },
                {
                  time: "12:00 PM",
                  title: "Recorrido por el Foro Romano",
                  checked: true,
                },
                {
                  time: "3:00 PM",
                  title: "Visita al Monte Palatino",
                  checked: false,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 text-lg">
                    {item.checked ? "✅" : "⬜"}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        item.checked
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {item.time}
                    </p>
                    <p
                      className={`text-sm ${
                        item.checked ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-sm text-gray-500">
              No hay actividades planificadas
            </p>
          </div>
        )}
      </CardContent>

      {/* Action Button */}
      <CardFooter className="p-6 border-t border-gray-200 mt-0">
        <Link
          href={`/day/${dateKey}`}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          Guardar Cambios
        </Link>
      </CardFooter>
    </Card>
  );
}
