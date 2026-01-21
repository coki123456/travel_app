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
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
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
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.checked
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {item.checked && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
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
