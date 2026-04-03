import { Inbox } from "lucide-react";

export default function EmptyState({ message = "Nothing here yet", icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon size={48} strokeWidth={1.5} />
      <p className="mt-3 text-lg">{message}</p>
    </div>
  );
}
