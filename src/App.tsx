import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import AppRouter from "./routes/AppRoutes";



const App = () => {

  return (
    <>
    <ErrorBoundary>
        <Toaster richColors position="top-right" />
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

      <AppRouter />
        </GoogleOAuthProvider>
    </ErrorBoundary>
    </>
  );
};

export default App;
