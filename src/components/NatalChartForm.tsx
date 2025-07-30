"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BirthData } from "~/lib/astro-types";

interface NatalChartFormProps {
  onSubmit: (birthData: BirthData) => void;
  initialData?: Partial<BirthData>;
}

export default function NatalChartForm({ onSubmit, initialData }: NatalChartFormProps) {
  const [formData, setFormData] = useState<Partial<BirthData>>({
    date: initialData?.date || "",
    time: initialData?.time || "",
    location: {
      city: initialData?.location?.city || "",
      country: initialData?.location?.country || "",
      latitude: initialData?.location?.latitude || 0,
      longitude: initialData?.location?.longitude || 0,
      timezone: initialData?.location?.timezone || "UTC"
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.location?.city) {
      return;
    }

    const birthData: BirthData = {
      date: formData.date,
      time: formData.time,
      location: {
        city: formData.location.city,
        country: formData.location.country,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        timezone: formData.location.timezone
      }
    };

    onSubmit(birthData);
  };

  const handleLocationChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location!,
        [field]: value
      }
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Birth Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Birth Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Birth Time</label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Birth City</label>
            <Input
              type="text"
              placeholder="Enter birth city"
              value={formData.location?.city || ""}
              onChange={(e) => handleLocationChange("city", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Input
              type="text"
              placeholder="Enter country"
              value={formData.location?.country || ""}
              onChange={(e) => handleLocationChange("country", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Latitude</label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.0000"
                value={formData.location?.latitude || ""}
                onChange={(e) => handleLocationChange("latitude", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Longitude</label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.0000"
                value={formData.location?.longitude || ""}
                onChange={(e) => handleLocationChange("longitude", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Generate Chart
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}