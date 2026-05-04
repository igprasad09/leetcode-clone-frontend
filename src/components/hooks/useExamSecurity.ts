import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useExamSecurity = (isEnabled: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEnabled) return;

    const preventClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Copy/Paste is disabled during the test!");
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("Tab switched or browser minimized");
      }
    };

    const handleBlur = () => {
      handleViolation("Window focus lost (App switching detected)");
    };

    const handleViolation = (reason: string) => {
      toast.error(`Security Violation: ${reason}. Redirecting...`);
      
      // Force exit fullscreen before navigating away
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.error(err));
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    };

    document.addEventListener("copy", preventClipboard);
    document.addEventListener("paste", preventClipboard);
    document.addEventListener("cut", preventClipboard);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("copy", preventClipboard);
      document.removeEventListener("paste", preventClipboard);
      document.removeEventListener("cut", preventClipboard);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isEnabled, navigate]);
};