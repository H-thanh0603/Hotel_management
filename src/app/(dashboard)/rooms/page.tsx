"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  AVAILABLE: "success",
  RESERVED: "warning",
  OCCUPIED: "destructive",
  CLEANING: "secondary",
  MAINTENANCE: "outline",
  UNAVAILABLE: "outline",
};

const statusLabels: Record<string, string> = {
  AVAILABLE: "Trong",
  RESERVED: "Da dat",
  OCCUPIED: "Dang o",
  CLEANING: "Dang don",
  MAINTENANCE: "Bao tri",
  UNAVAILABLE: "Tam ngung",
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rooms").then(r => r.json()).then(data => { setRooms(data); setLoading(false); });
  }, []);

  const floors = [...new Set(rooms.map(r => r.floor))].sort();

  if (loading) return <p>Dang tai...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quan li phong</h1>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(statusLabels).map(([key, label]) => (
          <Badge key={key} variant={statusColors[key] as any}>{label}</Badge>
        ))}
      </div>
      {floors.map(floor => (
        <div key={floor} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Tang {floor}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {rooms.filter(r => r.floor === floor).map(room => (
              <Card key={room.id} className="text-center">
                <CardContent className="p-4">
                  <p className="font-bold text-lg">{room.roomNumber}</p>
                  <p className="text-xs text-gray-500">{room.roomType?.name}</p>
                  <Badge variant={statusColors[room.status] as any} className="mt-2">
                    {statusLabels[room.status]}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
