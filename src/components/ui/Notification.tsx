import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

interface NotificationProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Notification({ message, duration = 2000, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-3 text-white shadow-sm shadow-purple-300"
        >
          <motion.div
            initial={{ rotate: -20 }}
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Bell size={24} />
          </motion.div>
          <span className="text-lg font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 🔹 Hook to trigger notifications
export function useNotification() {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
  };

  // ✅ make it a component function
  const NotificationComponent: React.FC = () =>
    notification ? (
      <Notification
        message={notification}
        onClose={() => setNotification(null)}
      />
    ) : null;

  return { showNotification, NotificationComponent };
}
