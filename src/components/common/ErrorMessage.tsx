import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}