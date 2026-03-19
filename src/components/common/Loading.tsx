import { Loader2 } from "lucide-react";

export default function Loading({ message }: { message: string }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>{message}</span>
      </div>
    </div>
  )
}