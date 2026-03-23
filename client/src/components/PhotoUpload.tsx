/**
 * PDV Reporter — PhotoUpload
 * Design: Verde Campo — câmera integrada com preview da foto
 */

import { useRef, useState } from "react";
import { Camera, Image, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  value?: string; // base64
  fileName?: string;
  onChange: (base64: string | undefined, fileName: string | undefined) => void;
}

export default function PhotoUpload({ value, fileName, onChange }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Compress image
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 800;
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
          else { w = Math.round((w * MAX) / h); h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.75);
        onChange(compressed, file.name);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    onChange(undefined, undefined);
    setError(null);
  };

  if (value) {
    return (
      <div className="space-y-2">
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img
            src={value}
            alt="Foto anexada"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {fileName && (
          <p className="text-xs text-muted-foreground truncate px-1">{fileName}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {/* Camera button */}
        <Button
          type="button"
          variant="outline"
          className="h-20 flex-col gap-1.5 border-dashed border-primary/30 hover:border-primary hover:bg-secondary text-muted-foreground hover:text-primary"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="w-6 h-6" />
          <span className="text-xs">Câmera</span>
        </Button>

        {/* Gallery button */}
        <Button
          type="button"
          variant="outline"
          className="h-20 flex-col gap-1.5 border-dashed border-primary/30 hover:border-primary hover:bg-secondary text-muted-foreground hover:text-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="w-6 h-6" />
          <span className="text-xs">Galeria</span>
        </Button>
      </div>

      <div
        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Arraste uma imagem ou toque para selecionar
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          JPG, PNG ou WEBP — máx. 5MB
        </p>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
