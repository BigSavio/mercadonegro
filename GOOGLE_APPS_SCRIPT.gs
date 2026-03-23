/**
 * PDV Reporter — Google Apps Script
 * Coloque este código no seu Google Apps Script
 * 
 * INSTRUÇÕES:
 * 1. Abra sua planilha no Google Sheets
 * 2. Vá para Extensões → Apps Script
 * 3. Apague TODO o código padrão
 * 4. Cole este código
 * 5. Clique em "Deploy" → "New deployment" → "Web app"
 * 6. Configure como:
 *    - Execute as: sua conta
 *    - Who has access: Anyone
 * 7. Copie a URL do Web App e use no PDV Reporter
 */

function doPost(e) {
  try {
    // Pega os dados do POST
    const payload = JSON.parse(e.postData.contents);
    
    // Acessa a planilha ativa
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Cria a linha com os dados na ordem correta
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
    
    // Adiciona a linha na planilha
    sheet.appendRow(row);
    
    // Log para debug
    Logger.log("Linha adicionada: " + JSON.stringify(row));
    
    // Retorna sucesso
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Dados registrados com sucesso",
        row: row
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log de erro
    Logger.log("Erro: " + error.toString());
    
    // Retorna erro
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
}
