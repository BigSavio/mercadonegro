/**
 * PDV Reporter — Splash Screen
 * Design: Verde Campo com Logo IFCO System
 */

import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Splash() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Mostra a splash screen por 2 segundos
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-600 to-green-700">
      {/* Logo IFCO */}
      <div className="mb-8 animate-fade-in">
        <img
          src="/ifco-logo.png"
          alt="IFCO System"
          className="h-24 w-auto drop-shadow-lg"
        />
      </div>

      {/* Título */}
      <h1
        className="text-3xl font-bold text-white mb-2"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        PDV Reporter
      </h1>

      {/* Subtítulo */}
      <p className="text-white/80 text-sm mb-12">
        Registro de Pontos de Venda
      </p>

      {/* Loading spinner */}
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.2s" }} />
        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}
