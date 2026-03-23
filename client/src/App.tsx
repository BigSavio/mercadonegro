/**
 * PDV Reporter — App.tsx
 * Design: Verde Campo — rotas do aplicativo mobile-first
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NewReport from "./pages/NewReport";
import ReportDetail from "./pages/ReportDetail";
import GoogleSheetsSetup from "./pages/GoogleSheetsSetup";
import Splash from "./pages/Splash";
import SelectAnalyst from "./pages/SelectAnalyst";
import { useAnalysts } from "./hooks/useAnalysts";

function Router() {
  const { selectedAnalyst } = useAnalysts();

  if (!selectedAnalyst) {
    return <SelectAnalyst />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/novo" component={NewReport} />
      <Route path="/registro/:id" component={ReportDetail} />
      <Route path="/setup-sheets" component={GoogleSheetsSetup} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" richColors visibleToasts={3} />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
