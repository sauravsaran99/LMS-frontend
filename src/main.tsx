import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
          containerStyle={{
            top: 80, // Offset it so it appears below your navbar
            zIndex: 99999, // Ensure it's above the navbar's z-index
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
