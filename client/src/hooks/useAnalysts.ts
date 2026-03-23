/**
 * PDV Reporter — useAnalysts Hook
 * Gerencia lista de analistas e seleção
 */

import { useState, useEffect } from "react";

const DEFAULT_ANALYSTS = [
  "Lilian Morais",
  "Cesar Garcia",
  "Ruan Santos",
  "Tiier Silva",
  "Luis Ferreira",
  "Vaga SP Mambo+",
  "Vaga SP Americana+",
  "Diogo Pimentel",
  "Rhansses Consolini",
  "Marcos Santos",
  "Leonardo Phillip",
  "Rodrigo Coimbra",
  "Poliana Martins",
  "Vaga SC Passarela+",
  "Ivan Rodrigues",
  "Rodnir Almeida",
  "Vinicius Andrade",
  "Alan Almeida",
  "Savio Sousa",
  "Gabriel Junior",
  "Raimundo Junior",
  "Rubenilson Monteiro",
  "Marcelo Silva",
  "José Santos",
];

export function useAnalysts() {
  const [analysts, setAnalysts] = useState<string[]>([]);
  const [selectedAnalyst, setSelectedAnalyst] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega dados do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pdv_analysts_list");

      if (saved) {
        setAnalysts(JSON.parse(saved));
      } else {
        setAnalysts(DEFAULT_ANALYSTS);
        localStorage.setItem("pdv_analysts_list", JSON.stringify(DEFAULT_ANALYSTS));
      }

      // Carrega seleção apenas se existir
      const selected = localStorage.getItem("pdv_selected_analyst");
      if (selected) {
        setSelectedAnalyst(selected);
      }
    } catch (error) {
      console.error("Erro ao carregar analistas:", error);
      setAnalysts(DEFAULT_ANALYSTS);
      setSelectedAnalyst(null);
      localStorage.removeItem("pdv_selected_analyst");
    } finally {
      setLoading(false);
    }
  }, []);

  // Seleciona um analista
  const selectAnalyst = (name: string) => {
    console.log("Selecionando analista:", name);
    setSelectedAnalyst(name);
    localStorage.setItem("pdv_selected_analyst", name);
    localStorage.setItem("pdv_analyst_selection_time", Date.now().toString());
  };

  // Adiciona novo analista
  const addAnalyst = (name: string): boolean => {
    const trimmed = name.trim();

    if (!trimmed) return false;
    if (analysts.includes(trimmed)) return false;

    const updated = [...analysts, trimmed].sort();
    setAnalysts(updated);
    localStorage.setItem("pdv_analysts_list", JSON.stringify(updated));

    return true;
  };

  // Remove analista
  const removeAnalyst = (name: string): boolean => {
    const updated = analysts.filter((a) => a !== name);
    setAnalysts(updated);
    localStorage.setItem("pdv_analysts_list", JSON.stringify(updated));

    // Se o analista removido estava selecionado, desseleciona
    if (selectedAnalyst === name) {
      setSelectedAnalyst(null);
      localStorage.removeItem("pdv_selected_analyst");
    }

    return true;
  };

  // Limpa seleção
  const clearSelection = () => {
    setSelectedAnalyst(null);
    localStorage.removeItem("pdv_selected_analyst");
  };

  return {
    analysts,
    selectedAnalyst,
    loading,
    selectAnalyst,
    addAnalyst,
    removeAnalyst,
    clearSelection,
  };
}
