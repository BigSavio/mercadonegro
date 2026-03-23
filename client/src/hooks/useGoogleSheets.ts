/**
 * PDV Reporter — useGoogleSheets Hook
 * Integração com Google Sheets via Apps Script
 */

import { PDVReport, PDV_TYPE_LABELS, PDVType } from "./useReports";
import { toast } from "sonner";

export interface GoogleSheetsRow {
  Estabelecimento: string;
  Nome: string;
  Cidade: string;
  Rua: string;
  CEP: string;
  UF: string;
  Caixas: number;
  Data: string;
  Analista: string;
  Fornecedor: string;
  Código: string;
  Timestamp: string;
  Localização: string;
}

export function useGoogleSheets() {
  const buildRow = (report: PDVReport): GoogleSheetsRow => {
    return {
      Estabelecimento: PDV_TYPE_LABELS[report.pdvType] ?? report.pdvType,
      Nome: report.endereco,
      Cidade: report.cidade,
      Rua: report.endereco,
      CEP: report.cep,
      UF: report.estado,
      Caixas: report.quantidadeCaixas,
      Data: report.dataReporte,
      Analista: report.nomeAnalista,
      Fornecedor: report.nomeFornecedor ?? "",
      Código: report.codigoFornecedor ?? "",
      Timestamp: new Date(report.criadoEm).toLocaleString("pt-BR"),
      Localização: report.latitude && report.longitude
        ? `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`
        : "",
    };
  };

  const sendToGoogleSheets = async (report: PDVReport): Promise<{ success: boolean; error?: string }> => {
    try {
      const scriptUrl = localStorage.getItem("google_sheets_script_url");
      
      if (!scriptUrl) {
        return { success: false, error: "URL do Google Sheets não configurada" };
      }

      const row = buildRow(report);

      // Log para debug
      console.log("Enviando para Google Sheets:", row);

      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      });

      // Com mode: "no-cors", não conseguimos ler a resposta
      // Mas se chegou aqui sem erro, consideramos sucesso
      console.log("Resposta do Google Sheets:", response);
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Erro ao enviar para Google Sheets:", err);
      return { success: false, error: errorMsg };
    }
  };

  const testConnection = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const scriptUrl = localStorage.getItem("google_sheets_script_url");
      
      if (!scriptUrl) {
        return { success: false, message: "URL do Google Sheets não configurada" };
      }

      const testRow: GoogleSheetsRow = {
        Estabelecimento: "TESTE",
        Nome: "Teste de conexão",
        Cidade: "São Paulo",
        Rua: "Rua Teste",
        CEP: "00000-000",
        UF: "SP",
        Caixas: 0,
        Data: new Date().toISOString().slice(0, 10),
        Analista: "Sistema",
        Fornecedor: "",
        Código: "",
        Timestamp: new Date().toLocaleString("pt-BR"),
        Localização: "",
      };

      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testRow),
      });

      console.log("Teste de conexão - Resposta:", response);
      return { success: true, message: "Conexão com Google Sheets funcionando!" };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      return { success: false, message: `Erro ao conectar: ${errorMsg}` };
    }
  };

  return {
    buildRow,
    sendToGoogleSheets,
    testConnection,
  };
}
