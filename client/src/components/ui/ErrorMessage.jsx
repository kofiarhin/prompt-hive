import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message = "Something went wrong" }) {
  return (
    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      <AlertCircle size={20} />
      <p>{message}</p>
    </div>
  );
}
