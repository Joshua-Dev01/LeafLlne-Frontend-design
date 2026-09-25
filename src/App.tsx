import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import AppRouter from "./routes/AppRoutes";
import { ThemeProvider } from "./context/theme";



const App = () => {

  return (
    <>
    <ThemeProvider>
    <ErrorBoundary>
        <Toaster richColors position="top-right" />
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

      <AppRouter />
        </GoogleOAuthProvider>
    </ErrorBoundary>
    </ThemeProvider>
    </>
  );
};

export default App;