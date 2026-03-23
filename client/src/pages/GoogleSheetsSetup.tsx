/**
 * PDV Reporter — Google Sheets Setup
 * Design: Verde Campo — instruções para configurar a integração com Google Sheets
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Copy, Check, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSheet();
    
    const row = [
      payload.Estabelecimento || "",
      payload.Nome || "",
      payload.Cidade || "",
      payload.Rua || "",
      payload.CEP || "",
      payload.UF || "",
      payload.Caixas || "",
      payload.Data || "",
      payload.Analista || "",
      payload.Fornecedor || "",
      payload.Código || "",
      payload.Timestamp || "",
      payload.Localização || ""
    ];
    
    sheet.appendRow(row);
    Logger.log("Linha adicionada: " + JSON.stringify(row));
    
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Dados registrados com sucesso",
        row: row
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Erro: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "ok",
      message: "PDV Reporter Google Apps Script está funcionando"
    })
  ).setMimeType(ContentService.MimeType.JSON);
}`;

export default function GoogleSheetsSetup() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2000);
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
              Integrar Google Sheets
            </h1>
            <p className="text-xs text-white/70">Sincronize os registros automaticamente</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-6">

          {/* Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Importante</p>
              <p className="text-xs text-amber-800 mt-0.5">
                Se a conexão está funcionando mas os dados não aparecem na planilha, siga estas instruções para atualizar o script.
              </p>
            </div>
          </div>

          {/* Step 1 */}
          <div className="section-card">
            <div className="section-header">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Abra o Google Apps Script
              </span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground">
                Na sua planilha do Google Sheets:
              </p>
              <div className="bg-secondary p-3 rounded-lg text-xs text-muted-foreground space-y-1">
                <p><strong>1.</strong> Clique em <strong>"Extensões"</strong> no menu superior</p>
                <p><strong>2.</strong> Selecione <strong>"Apps Script"</strong></p>
                <p><strong>3.</strong> Uma aba nova abrirá com o editor de scripts</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="section-card">
            <div className="section-header">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Apague o código padrão
              </span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground">
                No editor do Apps Script, selecione TODO o código padrão (Ctrl+A) e apague.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                ⚠️ Certifique-se de apagar TUDO o que está lá
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="section-card">
            <div className="section-header">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Cole o novo código
              </span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground">
                Copie o código abaixo e cole no editor:
              </p>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
                <pre>{APPS_SCRIPT_CODE}</pre>
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="w-full gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar código
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="section-card">
            <div className="section-header">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                4
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Salve o script
              </span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground">
                Clique em <strong>"Save"</strong> (Ctrl+S) para salvar o código.
              </p>
              <div className="bg-secondary p-3 rounded-lg text-xs text-muted-foreground">
                Você verá uma confirmação de que foi salvo
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="section-card">
            <div className="section-header">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                5
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Faça o Deploy
              </span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground">
                Clique em <strong>"Deploy"</strong> (canto superior direito):
              </p>
              <div className="bg-secondary p-3 rounded-lg text-xs text-muted-foreground space-y-1">
                <p><strong>1.</strong> Clique em <strong>"Deploy"</strong></p>
                <p><strong>2.</strong> Selecione <strong>"New deployment"</strong></p>
                <p><strong>3.</strong> Clique no ícone de engrenagem e escolha <strong>"Web app"</strong></p>
                <p><strong>4.</strong> Configure:</p>
                <div className="ml-4 mt-1 space-y-0.5">
                  <p>• Execute como: <strong>sua conta</strong></p>
                  <p>• Quem tem acesso: <strong>Qualquer pessoa</strong></p>
                </div>
                <p className="mt-1"><strong>5.</strong> Clique em <strong>"Deploy"</strong></p>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="section-card">
            <div className="section-header">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                6
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Copie a nova URL
              </span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground">
                Após o deploy, uma URL será exibida. Copie-a.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                ✓ Esta é a URL que você deve usar no PDV Reporter
              </div>
            </div>
          </div>

          {/* Step 7 */}
          <div className="section-card">
            <div className="section-header">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                7
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Configure no PDV Reporter
              </span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground">
                Volte ao PDV Reporter:
              </p>
              <div className="bg-secondary p-3 rounded-lg text-xs text-muted-foreground space-y-1">
                <p><strong>1.</strong> Clique no ícone de <strong>Configurações</strong> (engrenagem)</p>
                <p><strong>2.</strong> Cole a nova URL do Web App</p>
                <p><strong>3.</strong> Clique em <strong>"Testar"</strong> para verificar</p>
                <p><strong>4.</strong> Clique em <strong>"Salvar"</strong></p>
              </div>
            </div>
          </div>

          {/* Success */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              <strong>✓ Pronto!</strong> Agora quando você criar um novo registro, os dados aparecerão automaticamente na sua planilha do Google Sheets.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button
          onClick={() => navigate("/")}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Voltar aos Registros
        </Button>
      </div>
    </div>
  );
}
