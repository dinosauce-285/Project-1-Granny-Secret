import { LuX, LuCircleCheck, LuCircleAlert } from "react-icons/lu";
import { useEffect } from "react";

function Toast({
  isOpen,
  message,
  onClose,
  duration = 3000,
  type = "success",
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const isSuccess = type === "success";
  const iconBgColor = isSuccess ? "bg-green-100" : "bg-red-100";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";
  const Icon = isSuccess ? LuCircleCheck : LuCircleAlert;

  return (
    <div className="fixed top-4 right-4 z-[999] animate-in slide-in-from-top-5 fade-in duration-300">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 pr-12 max-w-sm flex items-center gap-3">
        <div
          className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <p className="text-gray-900 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <LuX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
