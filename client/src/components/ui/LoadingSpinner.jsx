import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex justify-center items-center py-12 ${className}`}>
      <Loader2 className="animate-spin text-amber-500" size={32} />
    </div>
  );
}
