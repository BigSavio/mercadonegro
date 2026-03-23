/**
 * PDV Reporter — NewReport Page
 * Design: Verde Campo — formulário em seções com scroll vertical
 * Seções: Tipo de PDV → Localização → Detalhes → Fornecedor (opt) → Foto (opt)
 */

import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ChevronLeft, Save, ChevronDown, ChevronUp, User, Package, Building2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PDVTypeSelector from "@/components/PDVTypeSelector";
import LocationInput from "@/components/LocationInput";
import PhotoUpload from "@/components/PhotoUpload";
import { useReports, PDVType, PDV_TYPE_LABELS } from "@/hooks/useReports";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { useAnalysts } from "@/hooks/useAnalysts";

interface FormData {
  pdvType: PDVType | "";
  cidade: string;
  estado: string;
  endereco: string;
  cep: string;
  latitude?: number;
  longitude?: number;
  quantidadeCaixas: string;
  dataReporte: string;
  nomeAnalista: string;
  nomeFornecedor: string;
  codigoFornecedor: string;
  fotoBase64?: string;
  fotoNome?: string;
}

const today = new Date().toISOString().slice(0, 10);

const PDV_TYPE_LABELS_LOCAL = PDV_TYPE_LABELS;

function SectionCard({
  title,
  icon: Icon,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="section-card animate-slide-up">
      <div
        className={`section-header ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-sm text-foreground flex-1" style={{ fontFamily: "Poppins, sans-serif" }}>
          {title}
        </span>
        {collapsible && (
          open
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      {(!collapsible || open) && (
        <div className="p-4">{children}</div>
      )}
    </div>
  );
}

export default function NewReport() {
  const [, navigate] = useLocation();
  const { addReport } = useReports();
  const { sendToGoogleSheets } = useGoogleSheets();
  const { selectedAnalyst } = useAnalysts();
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    pdvType: "",
    cidade: "",
    estado: "",
    endereco: "",
    cep: "",
    quantidadeCaixas: "",
    dataReporte: today,
    nomeAnalista: "",
    nomeFornecedor: "",
    codigoFornecedor: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Atualiza o nome do analista quando selectedAnalyst muda
  useEffect(() => {
    if (selectedAnalyst) {
      setForm((prev) => ({ ...prev, nomeAnalista: selectedAnalyst }));
    }
  }, [selectedAnalyst]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.pdvType) errs.pdvType = "Selecione o tipo de estabelecimento.";
    if (!form.endereco.trim()) errs.endereco = "Informe o endereço.";
    if (!form.cidade.trim()) errs.cidade = "Informe a cidade.";
    if (!form.estado) errs.estado = "Selecione o estado.";
    if (!form.quantidadeCaixas || isNaN(Number(form.quantidadeCaixas)) || Number(form.quantidadeCaixas) < 0) {
      errs.quantidadeCaixas = "Informe uma quantidade válida.";
    }
    if (!form.dataReporte) errs.dataReporte = "Informe a data do reporte.";
    // Nome do analista eh preenchido automaticamente
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Preencha os campos obrigatórios.");
      // Scroll to top of form
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setSaving(true);
    try {
      // Nome do analista já vem da seleção

      const newReport = addReport({
        pdvType: form.pdvType as PDVType,
        cidade: form.cidade,
        estado: form.estado,
        endereco: form.endereco,
        cep: form.cep,
        latitude: form.latitude,
        longitude: form.longitude,
        quantidadeCaixas: Number(form.quantidadeCaixas),
        dataReporte: form.dataReporte,
        nomeAnalista: form.nomeAnalista,
        nomeFornecedor: form.nomeFornecedor || undefined,
        codigoFornecedor: form.codigoFornecedor || undefined,
        fotoBase64: form.fotoBase64,
        fotoNome: form.fotoNome,
      });

      // Tenta enviar para Google Sheets
      const result = await sendToGoogleSheets(newReport);
      if (result.success) {
        console.log("Registro enviado para Google Sheets com sucesso");
      } else {
        console.warn("Erro ao enviar para Google Sheets:", result.error);
      }

      toast.success("Registro salvo com sucesso!", {
        description: "O reporte foi adicionado à lista.",
      });

      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  const setLocation = (loc: {
    cidade: string; estado: string; endereco: string; cep: string;
    latitude?: number; longitude?: number;
  }) => {
    setForm((f) => ({ ...f, ...loc }));
    setErrors((e) => ({ ...e, cidade: undefined, estado: undefined, endereco: undefined }));
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
              Novo Registro
            </h1>
            <p className="text-xs text-white/70">Preencha os dados do PDV</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <div ref={formRef} className="flex-1 overflow-y-auto pb-28">
        <div className="p-4 space-y-4">

          {/* Tipo de PDV */}
          <SectionCard title="Tipo de Estabelecimento" icon={Building2}>
            <PDVTypeSelector
              value={form.pdvType}
              onChange={(type) => {
                setForm((f) => ({ ...f, pdvType: type }));
                setErrors((e) => ({ ...e, pdvType: undefined }));
              }}
            />
            {errors.pdvType && (
              <p className="text-xs text-destructive mt-2">{errors.pdvType}</p>
            )}
          </SectionCard>

          {/* Localização */}
          <SectionCard title="Localização" icon={Package}>
            <LocationInput
              value={{
                cidade: form.cidade,
                estado: form.estado,
                endereco: form.endereco,
                cep: form.cep,
                latitude: form.latitude,
                longitude: form.longitude,
              }}
              onChange={setLocation}
            />
            {(errors.cidade || errors.estado || errors.endereco) && (
              <p className="text-xs text-destructive mt-2">
                {errors.endereco || errors.cidade || errors.estado}
              </p>
            )}
          </SectionCard>

          {/* Detalhes do Reporte */}
          <SectionCard title="Detalhes do Reporte" icon={User}>
            <div className="space-y-3">
              {/* Nome do Analista - Somente Leitura */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Analista
                </Label>
                <div className="h-11 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <span className="font-medium text-green-900">{form.nomeAnalista}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  ✓ Selecionado no início
                </p>
              </div>

              {/* Data do Reporte */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Data do Reporte <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.dataReporte}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, dataReporte: e.target.value }));
                    setErrors((e2) => ({ ...e2, dataReporte: undefined }));
                  }}
                  className="h-11"
                />
                {errors.dataReporte && (
                  <p className="text-xs text-destructive">{errors.dataReporte}</p>
                )}
              </div>

              {/* Quantidade de Caixas */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Quantidade de Caixas <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="Ex: 10"
                  value={form.quantidadeCaixas}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, quantidadeCaixas: e.target.value }));
                    setErrors((e2) => ({ ...e2, quantidadeCaixas: undefined }));
                  }}
                  className="h-11"
                />
                {errors.quantidadeCaixas && (
                  <p className="text-xs text-destructive">{errors.quantidadeCaixas}</p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Informações do Fornecedor (opcional) */}
          <SectionCard
            title="Informações do Fornecedor"
            icon={Building2}
            collapsible
            defaultOpen={false}
          >
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Opcional — preencha se disponível.</p>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Nome do Fornecedor</Label>
                <Input
                  placeholder="Ex: Distribuidora XYZ"
                  value={form.nomeFornecedor}
                  onChange={(e) => setForm((f) => ({ ...f, nomeFornecedor: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Código do Fornecedor</Label>
                <Input
                  placeholder="Ex: FORN-001"
                  value={form.codigoFornecedor}
                  onChange={(e) => setForm((f) => ({ ...f, codigoFornecedor: e.target.value }))}
                  className="h-11"
                />
              </div>
            </div>
          </SectionCard>

          {/* Foto (opcional) */}
          <SectionCard
            title="Foto do Local"
            icon={ImageIcon}
            collapsible
            defaultOpen={false}
          >
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Opcional — anexe uma foto do ponto de venda.</p>
              <PhotoUpload
                value={form.fotoBase64}
                fileName={form.fotoNome}
                onChange={(base64, name) =>
                  setForm((f) => ({ ...f, fotoBase64: base64, fotoNome: name }))
                }
              />
            </div>
          </SectionCard>

        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar Registro
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
