/**
 * PDV Reporter — Home Page
 * Design: Verde Campo — lista de registros com FAB para novo registro
 * Features: listagem simples, exportar CSV/XLSX, estatísticas rápidas
 */

import { useState } from "react";
import { useLocation } from "wouter";
import {
  Plus, Download, ClipboardList, MapPin, Calendar, Package,
  ChevronRight, ShoppingCart, Store, Tent, Leaf, Building2,
  FileSpreadsheet, FileText, Settings, CheckCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReports, PDVType } from "@/hooks/useReports";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { useAnalysts } from "@/hooks/useAnalysts";
import { toast } from "sonner";

const PDV_ICONS: Record<PDVType, React.ComponentType<{ className?: string }>> = {
  feira_livre: Tent,
  varejista_nao_credenciado: ShoppingCart,
  banca_de_rua: Store,
  loja_hortifruti: Leaf,
};

const PDV_COLORS: Record<PDVType, { icon: string; bg: string }> = {
  feira_livre: { icon: "text-amber-600", bg: "bg-amber-50" },
  varejista_nao_credenciado: { icon: "text-blue-600", bg: "bg-blue-50" },
  banca_de_rua: { icon: "text-orange-600", bg: "bg-orange-50" },
  loja_hortifruti: { icon: "text-green-600", bg: "bg-green-50" },
};

const DEFAULT_SHEET_URL = "https://script.google.com/macros/s/AKfycbwYpvuEaQKuRNGyhsNYBHziIuD0URHeSIQWcrW3pe8QEq45ENaS55F3x7XOwbBeKJD4rg/exec";

export default function Home() {
  const [, navigate] = useLocation();
  const { reports, downloadCSV, downloadXLSX, PDV_TYPE_LABELS } = useReports();
  const { testConnection } = useGoogleSheets();
  const { selectedAnalyst, clearSelection } = useAnalysts();
  const [showSettings, setShowSettings] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(() => {
    const stored = localStorage.getItem("google_sheets_script_url");
    if (!stored) {
      localStorage.setItem("google_sheets_script_url", DEFAULT_SHEET_URL);
      return DEFAULT_SHEET_URL;
    }
    return stored;
  });
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);



  const handleExportCSV = () => {
    const ok = downloadCSV();
    if (ok) {
      toast.success("Planilha CSV exportada!", {
        description: `${reports.length} registro(s) exportado(s).`,
      });
    } else {
      toast.error("Nenhum registro para exportar.");
    }
  };

  const handleExportXLSX = () => {
    const ok = downloadXLSX();
    if (ok) {
      toast.success("Planilha Excel exportada!", {
        description: `${reports.length} registro(s) exportado(s).`,
      });
    } else {
      toast.error("Nenhum registro para exportar.");
    }
  };

  const handleSaveSheetUrl = () => {
    if (sheetUrl.trim()) {
      localStorage.setItem("google_sheets_script_url", sheetUrl);
      toast.success("URL do Google Sheets salva!");
      setConnectionStatus(null);
    } else {
      toast.error("Informe a URL do script.");
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    const result = await testConnection();
    setConnectionStatus(result);
    setTestingConnection(false);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="app-container">
      {/* Header com gradiente verde */}
      <header className="app-header">
        <div
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #166534 0%, #16A34A 100%)" }}
        >
          <div className="relative px-4 pt-5 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-xs font-medium uppercase tracking-widest">
                    PDV Reporter
                  </span>
                </div>
                <h1
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Registros
                </h1>
                <p className="text-white/70 text-sm mt-0.5">
                  {selectedAnalyst}
                </p>
              </div>

              {/* Export dropdown */}
              <div className="flex gap-1.5 mt-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Exportar planilha
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleExportXLSX} className="gap-2 cursor-pointer">
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-sm">Excel (.xlsx)</div>
                        <div className="text-xs text-muted-foreground">Abre no Excel / Sheets</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">CSV (.csv)</div>
                        <div className="text-xs text-muted-foreground">Compatível com qualquer app</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className={`${
            sheetUrl ? "bg-green-500/20 border-green-300 text-green-600 hover:bg-green-500/30" : "bg-white/10 border-white/30 text-white hover:bg-white/20"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
        </Button>
              </div>
            </div>

            {/* Stats row */}
            {reports.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {(["feira_livre", "varejista_nao_credenciado", "banca_de_rua", "loja_hortifruti"] as PDVType[]).map((type) => {
                  const count = reports.filter((r) => r.pdvType === type).length;
                  const Icon = PDV_ICONS[type];
                  return (
                    <div key={type} className="bg-white/10 rounded-xl p-2 text-center">
                      <Icon className="w-4 h-4 text-white/80 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white leading-none">{count}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-secondary border-b border-border p-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              URL do Google Sheets (Apps Script)
            </label>
            <input
              type="text"
              placeholder="https://script.google.com/macros/d/..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              URL do Google Apps Script para sincronizar automaticamente com a planilha.
            </p>
            <p className="text-xs text-green-600 font-medium mt-1">
              ✓ Já configurada e pronta para usar
            </p>

            {connectionStatus && (
              <div className={`flex items-start gap-2 p-3 rounded-lg mt-3 ${
                connectionStatus.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}>
                {connectionStatus.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                )}
                <span className={`text-xs ${
                  connectionStatus.success ? "text-green-700" : "text-red-700"
                }`}>
                  {connectionStatus.message}
                </span>
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleSaveSheetUrl}
                className="flex-1"
              >
                Salvar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleTestConnection}
                disabled={testingConnection || !sheetUrl.trim()}
                className="flex-1"
              >
                {testingConnection ? "Testando..." : "Testar"}
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/setup-sheets")}
              className="w-full mt-2"
            >
              Ver Instruções
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="w-full mt-2"
            >
              Fechar
            </Button>
            <div className="border-t border-border pt-3 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("pdv_selected_analyst");
                  localStorage.removeItem("pdv_analyst_selection_time");
                  setShowSettings(false);
                  setTimeout(() => {
                    window.location.reload();
                  }, 300);
                }}
                className="w-full text-blue-600 hover:text-blue-700 gap-2"
              >
                Trocar de Analista
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ClipboardList className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3
              className="font-semibold text-foreground mb-1"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Nenhum registro ainda
            </h3>
            <p className="text-sm text-muted-foreground">
              Toque no botão abaixo para registrar um novo ponto de venda.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {reports.map((report) => {
              const Icon = PDV_ICONS[report.pdvType] ?? Building2;
              const colors = PDV_COLORS[report.pdvType] ?? { icon: "text-primary", bg: "bg-secondary" };

              return (
                <button
                  key={report.id}
                  onClick={() => navigate(`/registro/${report.id}`)}
                  className="w-full text-left section-card hover:shadow-md transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-sm text-foreground leading-tight"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {PDV_TYPE_LABELS[report.pdvType]}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {report.cidade}{report.estado ? `, ${report.estado}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(report.dataReporte + "T12:00:00").toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {report.quantidadeCaixas} cx
                          </span>
                        </div>
                        {report.nomeAnalista && (
                          <span className="text-xs text-muted-foreground truncate">
                            {report.nomeAnalista.split(" ")[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-1" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB — Novo Registro */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button
          onClick={() => navigate("/novo")}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <Plus className="w-5 h-5" />
          Novo Registro
        </Button>
      </div>
    </div>
  );
}
