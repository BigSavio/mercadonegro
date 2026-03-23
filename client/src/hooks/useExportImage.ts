/**
 * PDV Reporter — useExportImage Hook
 * Exporta um registro como imagem (PNG) para compartilhar
 * Usa iframe isolado para evitar interferência de CSS
 */

import html2canvas from "html2canvas";
import { PDVReport, PDV_TYPE_LABELS } from "./useReports";

export function useExportImage() {
  const exportReportAsImage = async (report: PDVReport): Promise<boolean> => {
    try {
      // Cria um iframe completamente isolado
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      iframe.style.width = "500px";
      iframe.style.height = "auto";
      iframe.style.border = "none";
      iframe.style.visibility = "hidden";
      document.body.appendChild(iframe);

      // HTML puro sem qualquer CSS externo
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: white; }
            .container { border: 3px solid #166534; border-radius: 12px; padding: 25px; background: white; width: 500px; }
            .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #166534; padding-bottom: 15px; }
            .header h2 { margin: 0; color: #166534; font-size: 24px; font-weight: bold; }
            .header p { margin: 8px 0 0 0; color: #666; font-size: 13px; }
            .section { margin-bottom: 20px; }
            .section-title { margin: 0; font-weight: bold; color: #166534; font-size: 13px; }
            .section-divider { border-top: 2px solid #ddd; padding-top: 15px; }
            .row { margin: 8px 0 3px 0; font-size: 13px; }
            .footer { border-top: 2px solid #ddd; padding-top: 15px; text-align: center; color: #999; font-size: 11px; }
            .footer p { margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>PDV Reporter</h2>
              <p>IFCO System</p>
            </div>

            <div class="section">
              <p class="section-title">TIPO DE ESTABELECIMENTO</p>
              <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #333;">${PDV_TYPE_LABELS[report.pdvType] || report.pdvType}</p>
            </div>

            <div class="section section-divider">
              <p class="section-title">📍 LOCALIZAÇÃO</p>
              <p class="row"><strong>Endereço:</strong> ${report.endereco || "-"}</p>
              <p class="row"><strong>Cidade:</strong> ${report.cidade || "-"}</p>
              <p class="row"><strong>Estado:</strong> ${report.estado || "-"}</p>
              <p class="row"><strong>CEP:</strong> ${report.cep || "-"}</p>
              ${report.latitude && report.longitude ? `
                <p class="row"><strong>GPS:</strong> ${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}</p>
              ` : ""}
            </div>

            <div class="section section-divider">
              <p class="section-title">📦 DETALHES DO REPORTE</p>
              <p class="row"><strong>Analista:</strong> ${report.nomeAnalista || "-"}</p>
              <p class="row"><strong>Data:</strong> ${new Date(report.dataReporte + "T12:00:00").toLocaleDateString("pt-BR") || "-"}</p>
              <p class="row"><strong>Caixas:</strong> ${report.quantidadeCaixas || "-"}</p>
            </div>

            ${report.nomeFornecedor || report.codigoFornecedor ? `
              <div class="section section-divider">
                <p class="section-title">🏢 FORNECEDOR</p>
                <p class="row"><strong>Nome:</strong> ${report.nomeFornecedor || "-"}</p>
                <p class="row"><strong>Código:</strong> ${report.codigoFornecedor || "-"}</p>
              </div>
            ` : ""}

            <div class="footer section-divider">
              <p>Gerado em ${new Date(report.criadoEm).toLocaleString("pt-BR")}</p>
              <p style="margin-top: 5px;">ID: ${report.id}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Escreve o conteúdo no iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error("Não foi possível acessar o iframe");

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Aguarda o iframe carregar completamente
      await new Promise((resolve) => {
        iframe.onload = resolve;
        setTimeout(resolve, 500);
      });

      // Captura o conteúdo do iframe
      const canvas = await html2canvas(iframeDoc.body, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 10000,
      });

      // Remove o iframe
      document.body.removeChild(iframe);

      // Converte para imagem e faz download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const date = new Date(report.criadoEm).toISOString().slice(0, 10);
      link.href = image;
      link.download = `pdv_${report.pdvType}_${date}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error("Erro ao exportar como imagem:", error);
      return false;
    }
  };

  return {
    exportReportAsImage,
  };
}
