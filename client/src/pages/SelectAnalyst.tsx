/**
 * PDV Reporter — SelectAnalyst Page
 * Design: Verde Campo — seleção de analista com modal elegante
 */

import { useState } from "react";
import { useAnalysts } from "@/hooks/useAnalysts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, X, Check } from "lucide-react";

export default function SelectAnalyst() {
  const { analysts, selectAnalyst, addAnalyst } = useAnalysts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAnalystName, setNewAnalystName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectAnalyst = (name: string) => {
    selectAnalyst(name);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const handleAddAnalyst = () => {
    if (!newAnalystName.trim()) {
      toast.error("Digite o nome do analista");
      return;
    }

    if (addAnalyst(newAnalystName)) {
      toast.success(`${newAnalystName} adicionado!`);
      setNewAnalystName("");
      setShowAddForm(false);
    } else {
      toast.error("Este analista já existe");
    }
  };

  const filteredAnalysts = analysts.filter((a) =>
    a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Card Principal */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/ifco-logo.png"
            alt="IFCO System"
            className="h-16 w-auto mx-auto mb-6 drop-shadow-md"
          />
          <h1
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            PDV Reporter
          </h1>
          <p className="text-gray-600 text-base">
            Selecione seu nome para começar
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar analista..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-base transition-all"
          />
        </div>

        {/* Lista de Analistas */}
        <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
          {filteredAnalysts.length > 0 ? (
            filteredAnalysts.map((analyst) => (
              <button
                key={analyst}
                onClick={() => handleSelectAnalyst(analyst)}
                className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all font-medium text-gray-800 flex items-center justify-between group"
              >
                <span>{analyst}</span>
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-green-500 flex items-center justify-center transition-all">
                  <Check className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum analista encontrado
            </div>
          )}
        </div>

        {/* Adicionar Novo */}
        {!showAddForm ? (
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold gap-2 text-base rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Adicionar Novo Analista
          </Button>
        ) : (
          <div className="bg-white border-2 border-green-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Novo Analista</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewAnalystName("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={newAnalystName}
              onChange={(e) => setNewAnalystName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddAnalyst();
                }
              }}
              placeholder="Digite o nome"
              autoFocus
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-base"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddAnalyst}
                className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
              >
                Adicionar
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewAnalystName("");
                }}
                variant="outline"
                className="flex-1 h-10 font-semibold rounded-lg"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
