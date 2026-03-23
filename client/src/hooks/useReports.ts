/**
 * PDV Reporter — useReports Hook
 * Design: Verde Campo
 * Manages PDV reports stored in localStorage with Google Sheets integration
 * 
 * Campo order: Estabelecimento, Nome, Cidade, Rua, CEP, UF, Caixas, Data, Analista, Fornecedor, Código, Timestamp, Localização
 */

import { useState, useCallback } from "react";
import * as XLSX from "xlsx";

export type PDVType =
  | "feira_livre"
  | "varejista_nao_credenciado"
  | "banca_de_rua"
  | "loja_hortifruti";

export type ReportStatus = "pending" | "synced" | "error";

export interface PDVReport {
  id: string;
  // Tipo de estabelecimento
  pdvType: PDVType;
  // Localização
  cidade: string;
  estado: string;
  endereco: string;
  cep: string;
  latitude?: number;
  longitude?: number;
  // Detalhes do reporte
  quantidadeCaixas: number;
  dataReporte: string;
  nomeAnalista: string;
  // Fornecedor (opcional)
  nomeFornecedor?: string;
  codigoFornecedor?: string;
  // Foto (opcional)
  fotoBase64?: string;
  fotoNome?: string;
  // Metadados
  status: ReportStatus;
  criadoEm: string;
}

const STORAGE_KEY = "pdv_reports";

export const PDV_TYPE_LABELS: Record<PDVType, string> = {
  feira_livre: "Feira Livre",
  varejista_nao_credenciado: "Varejista Não Credenciado",
  banca_de_rua: "Banca de Rua",
  loja_hortifruti: "Loja Hortifruti",
};

function loadReports(): PDVReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReports(reports: PDVReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function useReports() {
  const [reports, setReports] = useState<PDVReport[]>(() => loadReports());

  const addReport = useCallback((data: Omit<PDVReport, "id" | "criadoEm" | "status">) => {
    const newReport: PDVReport = {
      ...data,
      id: `pdv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      criadoEm: new Date().toISOString(),
      status: "pending",
    };
    setReports((prev) => {
      const updated = [newReport, ...prev];
      saveReports(updated);
      return updated;
    });
    return newReport;
  }, []);

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveReports(updated);
      return updated;
    });
  }, []);

  const markAllAsSynced = useCallback(() => {
    setReports((prev) => {
      const updated = prev.map((r) => ({ ...r, status: "synced" as ReportStatus }));
      saveReports(updated);
      return updated;
    });
  }, []);

  /**
   * Constrói as linhas no formato esperado para Google Sheets
   * Ordem: Estabelecimento, Nome, Cidade, Rua, CEP, UF, Caixas, Data, Analista, Fornecedor, Código, Timestamp, Localização
   */
  const buildRows = useCallback((list: PDVReport[]) => {
    return list.map((r) => ({
      "Estabelecimento": PDV_TYPE_LABELS[r.pdvType] ?? r.pdvType,
      "Nome": r.endereco, // Nome/endereço do local
      "Cidade": r.cidade,
      "Rua": r.endereco,
      "CEP": r.cep,
      "UF": r.estado,
      "Caixas": r.quantidadeCaixas,
      "Data": r.dataReporte,
      "Analista": r.nomeAnalista,
      "Fornecedor": r.nomeFornecedor ?? "",
      "Código": r.codigoFornecedor ?? "",
      "Timestamp": new Date(r.criadoEm).toLocaleString("pt-BR"),
      "Localização": r.latitude && r.longitude
        ? `${r.latitude.toFixed(6)}, ${r.longitude.toFixed(6)}`
        : "",
    }));
  }, []);

  const downloadCSV = useCallback(() => {
    if (reports.length === 0) return false;

    const rows = buildRows(reports);
    const ws = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `pdv_reporter_${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    markAllAsSynced();
    return true;
  }, [reports, buildRows, markAllAsSynced]);

  const downloadXLSX = useCallback(() => {
    if (reports.length === 0) return false;

    const rows = buildRows(reports);
    const ws = XLSX.utils.json_to_sheet(rows);

    // Column widths
    ws["!cols"] = [
      { wch: 28 }, // Estabelecimento
      { wch: 35 }, // Nome
      { wch: 20 }, // Cidade
      { wch: 35 }, // Rua
      { wch: 12 }, // CEP
      { wch: 6 },  // UF
      { wch: 8 },  // Caixas
      { wch: 12 }, // Data
      { wch: 25 }, // Analista
      { wch: 25 }, // Fornecedor
      { wch: 15 }, // Código
      { wch: 22 }, // Timestamp
      { wch: 28 }, // Localização
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros PDV");

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `pdv_reporter_${date}.xlsx`);
    markAllAsSynced();
    return true;
  }, [reports, buildRows, markAllAsSynced]);

  /**
   * Envia os dados para o Google Sheets via Apps Script
   * O usuário precisa configurar o script web no Google Sheets
   */
  const sendToGoogleSheets = useCallback(async (report: PDVReport): Promise<boolean> => {
    try {
      const row = {
        "Estabelecimento": PDV_TYPE_LABELS[report.pdvType] ?? report.pdvType,
        "Nome": report.endereco,
        "Cidade": report.cidade,
        "Rua": report.endereco,
        "CEP": report.cep,
        "UF": report.estado,
        "Caixas": report.quantidadeCaixas,
        "Data": report.dataReporte,
        "Analista": report.nomeAnalista,
        "Fornecedor": report.nomeFornecedor ?? "",
        "Código": report.codigoFornecedor ?? "",
        "Timestamp": new Date(report.criadoEm).toLocaleString("pt-BR"),
        "Localização": report.latitude && report.longitude
          ? `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`
          : "",
      };

      // Tenta enviar para o Apps Script (se configurado)
      const scriptUrl = localStorage.getItem("google_sheets_script_url");
      if (scriptUrl) {
        const response = await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        });
        // no-cors não retorna response útil, então apenas consideramos enviado
        return true;
      }

      return false;
    } catch (err) {
      console.error("Erro ao enviar para Google Sheets:", err);
      return false;
    }
  }, []);

  return {
    reports,
    addReport,
    deleteReport,
    markAllAsSynced,
    downloadCSV,
    downloadXLSX,
    sendToGoogleSheets,
    PDV_TYPE_LABELS,
  };
}
