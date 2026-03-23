/**
 * PDV Reporter — LocationInput
 * Design: Verde Campo — localização com GPS ou preenchimento manual
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Navigation, AlertCircle } from "lucide-react";

interface LocationData {
  cidade: string;
  estado: string;
  endereco: string;
  cep: string;
  latitude?: number;
  longitude?: number;
}

interface LocationInputProps {
  value: LocationData;
  onChange: (data: LocationData) => void;
}

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  const handleGPS = async () => {
    if (!navigator.geolocation) {
      setGpsError("GPS não disponível neste dispositivo.");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);
    setGpsSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding via nominatim (free, no key needed)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { "Accept-Language": "pt-BR" } }
          );
          const data = await res.json();
          const addr = data.address || {};

          const cidade =
            addr.city || addr.town || addr.village || addr.municipality || "";
          const estado = addr.state_code || addr.state || "";
          const rua = addr.road || addr.pedestrian || addr.footway || "";
          const numero = addr.house_number || "";
          const bairro = addr.suburb || addr.neighbourhood || addr.quarter || "";
          const endereco = [rua, numero, bairro].filter(Boolean).join(", ");
          const cep = (addr.postcode || "").replace(/\D/g, "");

          onChange({
            ...value,
            cidade,
            estado: estado.length === 2 ? estado.toUpperCase() : estado,
            endereco,
            cep,
            latitude,
            longitude,
          });
          setGpsSuccess(true);
        } catch {
          // GPS worked but geocoding failed — save coordinates only
          onChange({ ...value, latitude, longitude });
          setGpsSuccess(true);
        }

        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) setGpsError("Permissão de localização negada.");
        else if (err.code === 2) setGpsError("Localização indisponível. Tente novamente.");
        else setGpsError("Tempo esgotado. Tente novamente.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleField = (field: keyof LocationData, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-4">
      {/* GPS Button */}
      <Button
        type="button"
        variant={gpsSuccess ? "default" : "outline"}
        className={`w-full gap-2 h-12 text-sm font-medium transition-all ${
          gpsSuccess
            ? "bg-primary text-primary-foreground"
            : "border-primary/40 text-primary hover:bg-secondary"
        }`}
        onClick={handleGPS}
        disabled={gpsLoading}
      >
        {gpsLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : gpsSuccess ? (
          <Navigation className="w-4 h-4" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}
        {gpsLoading
          ? "Obtendo localização..."
          : gpsSuccess
          ? "Localização obtida via GPS"
          : "Usar GPS para localização automática"}
      </Button>

      {gpsError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {value.latitude && value.longitude && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
          <Navigation className="w-3.5 h-3.5 shrink-0" />
          <span>
            Coordenadas: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {/* Endereço */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">
            Endereço <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="Rua, número, bairro"
            value={value.endereco}
            onChange={(e) => handleField("endereco", e.target.value)}
            className="h-11"
          />
        </div>

        {/* Cidade + Estado */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              Cidade <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Ex: São Paulo"
              value={value.cidade}
              onChange={(e) => handleField("cidade", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              Estado <span className="text-destructive">*</span>
            </Label>
            <select
              value={value.estado}
              onChange={(e) => handleField("estado", e.target.value)}
              className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">UF</option>
              {ESTADOS_BR.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CEP */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">CEP</Label>
          <Input
            placeholder="00000-000"
            value={value.cep}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 8);
              const formatted = v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
              handleField("cep", formatted);
            }}
            inputMode="numeric"
            className="h-11"
          />
        </div>
      </div>
    </div>
  );
}
