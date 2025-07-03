import ErrorBoundary from "./components/errors/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import AppRouter from "./routes/AppRoutes";
const App = () => {
  return (
    <>
    <ErrorBoundary>
        <Toaster richColors position="top-right" />
      <AppRouter />
    </ErrorBoundary>
    </>
  );
};

export default App;
