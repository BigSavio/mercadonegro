/**
 * PDV Reporter — ReportDetail Page
 * Design: Verde Campo — visualização detalhada de um registro
 */

import { useLocation, useParams } from "wouter";
import { ChevronLeft, MapPin, Calendar, User, Package, Building2, Image, Navigation, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/useReports";
import { useExportImage } from "@/hooks/useExportImage";
import { PDV_TYPES as PDV_TYPE_CONFIGS } from "@/components/PDVTypeSelector";
import { toast } from "sonner";
import { useState } from "react";

function DetailRow({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { reports, deleteReport, PDV_TYPE_LABELS } = useReports();
  const { exportReportAsImage } = useExportImage();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-muted-foreground">Registro não encontrado.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const pdvConfig = PDV_TYPE_CONFIGS.find((t) => t.id === report.pdvType);
  const Icon = pdvConfig?.icon ?? Building2;

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    deleteReport(report.id);
    toast.success("Registro excluído.");
    navigate("/");
  };

  const handleExportImage = async () => {
    const ok = await exportReportAsImage(report);
    if (ok) {
      toast.success("Registro exportado como imagem!", {
        description: "Você pode compartilhar por WhatsApp, email, etc.",
      });
    } else {
      toast.error("Erro ao exportar como imagem.");
    }
  };

  const statusLabel =
    report.status === "synced"
      ? "Exportado"
      : report.status === "error"
      ? "Erro"
      : "Pendente";

  const statusClass =
    report.status === "synced"
      ? "status-badge synced"
      : report.status === "error"
      ? "status-badge error"
      : "status-badge pending";

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
              Detalhes do Registro
            </h1>
            <p className="text-xs text-white/70">
              {new Date(report.criadoEm).toLocaleDateString("pt-BR", {
                day: "2-digit", month: "short", year: "numeric"
              })}
            </p>
          </div>
          <span className={statusClass}>{statusLabel}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        <div id="report-card" className="p-4 space-y-4">

          {/* PDV Type Hero */}
          <div className={`section-card overflow-hidden`}>
            <div className="p-5 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pdvConfig?.bgColor ?? "bg-secondary"}`}>
                <Icon className={`w-7 h-7 ${pdvConfig?.color ?? "text-primary"}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tipo de Estabelecimento</p>
                <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {PDV_TYPE_LABELS[report.pdvType]}
                </h2>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="section-card">
            <div className="section-header">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Localização</span>
            </div>
            <div className="px-4">
              <DetailRow label="Endereço" value={report.endereco} />
              <DetailRow label="Cidade" value={report.cidade} />
              <DetailRow label="Estado" value={report.estado} />
              <DetailRow label="CEP" value={report.cep} />
              {report.latitude && report.longitude && (
                <div className="flex flex-col gap-0.5 py-2.5">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Coordenadas GPS</span>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm text-foreground font-medium font-mono">
                      {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                    </span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${report.latitude},${report.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary underline mt-0.5"
                  >
                    Ver no Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Detalhes do Reporte */}
          <div className="section-card">
            <div className="section-header">
              <Package className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Detalhes do Reporte</span>
            </div>
            <div className="px-4">
              <DetailRow label="Nome do Analista" value={report.nomeAnalista} />
              <DetailRow
                label="Data do Reporte"
                value={new Date(report.dataReporte + "T12:00:00").toLocaleDateString("pt-BR", {
                  day: "2-digit", month: "long", year: "numeric"
                })}
              />
              <DetailRow label="Quantidade de Caixas" value={report.quantidadeCaixas} />
            </div>
          </div>

          {/* Fornecedor */}
          {(report.nomeFornecedor || report.codigoFornecedor) && (
            <div className="section-card">
              <div className="section-header">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Fornecedor</span>
              </div>
              <div className="px-4">
                <DetailRow label="Nome do Fornecedor" value={report.nomeFornecedor} />
                <DetailRow label="Código do Fornecedor" value={report.codigoFornecedor} />
              </div>
            </div>
          )}

          {/* Foto */}
          {report.fotoBase64 && (
            <div className="section-card">
              <div className="section-header">
                <Image className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Foto do Local</span>
              </div>
              <div className="p-4">
                <img
                  src={report.fotoBase64}
                  alt="Foto do PDV"
                  className="w-full rounded-xl object-cover max-h-64"
                />
                {report.fotoNome && (
                  <p className="text-xs text-muted-foreground mt-2 truncate">{report.fotoNome}</p>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="section-card">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Criado em {new Date(report.criadoEm).toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <User className="w-3.5 h-3.5" />
                <span>ID: {report.id}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action buttons */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-background/95 backdrop-blur-sm border-t border-border space-y-2">
        <Button
          variant="outline"
          onClick={handleExportImage}
          className="w-full h-11 gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar como Imagem
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          className={`w-full h-11 gap-2 transition-all ${
            confirmDelete
              ? "border-destructive text-destructive hover:bg-destructive/10"
              : "border-border text-muted-foreground hover:text-destructive hover:border-destructive/50"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {confirmDelete ? "Toque novamente para confirmar" : "Excluir Registro"}
        </Button>
      </div>
    </div>
  );
}
