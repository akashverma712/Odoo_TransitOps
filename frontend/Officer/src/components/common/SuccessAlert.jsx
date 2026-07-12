// src/components/common/SuccessAlert.jsx
import { CheckCircle, X } from "lucide-react";

const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-green-700">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-green-400 hover:text-green-600">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SuccessAlert;