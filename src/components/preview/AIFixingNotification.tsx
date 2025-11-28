import { Bot, Loader2 } from 'lucide-react';

interface AIFixingNotificationProps {
  message?: string;
}

export function AIFixingNotification({ message = "AI is fixing the issue..." }: AIFixingNotificationProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 animate-fixing-notification-slide-up">
      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-3 border border-primary-foreground/20">
        <Bot className="w-5 h-5" />
        <span className="font-medium text-sm">{message}</span>
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    </div>
  );
}
