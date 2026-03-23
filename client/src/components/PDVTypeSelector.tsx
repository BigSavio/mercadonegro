/**
 * PDV Reporter — PDVTypeSelector
 * Design: Verde Campo — cards visuais grandes para seleção de tipo de PDV
 */

import { PDVType } from "@/hooks/useReports";
import { ShoppingCart, Store, Tent, Leaf } from "lucide-react";

interface PDVTypeSelectorProps {
  value: PDVType | "";
  onChange: (type: PDVType) => void;
}

const PDV_TYPES: {
  id: PDVType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    id: "feira_livre",
    label: "Feira Livre",
    icon: Tent,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
  },
  {
    id: "varejista_nao_credenciado",
    label: "Varejista Não Credenciado",
    icon: ShoppingCart,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
  },
  {
    id: "banca_de_rua",
    label: "Banca de Rua",
    icon: Store,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
  },
  {
    id: "loja_hortifruti",
    label: "Loja Hortifruti",
    icon: Leaf,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
  },
];

export default function PDVTypeSelector({ value, onChange }: PDVTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PDV_TYPES.map((type) => {
        const Icon = type.icon;
        const isSelected = value === type.id;
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={`
              relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 
              transition-all duration-200 text-center min-h-[90px]
              ${isSelected
                ? `border-primary bg-secondary shadow-md scale-[1.02]`
                : `border-border bg-card hover:border-accent/50 hover:bg-secondary/40`
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${isSelected ? "bg-primary/10" : type.bgColor}
            `}>
              <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : type.color}`} />
            </div>
            <span className={`text-xs font-medium leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
              {type.label}
            </span>
            {isSelected && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { PDV_TYPES };
