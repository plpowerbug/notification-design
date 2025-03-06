import { Button } from "@/components/ui/button"
import {X,Info, CheckCircle, AlertTriangle } from "lucide-react"
import { getNotificationIcon } from "./notification-panel"
interface NotificationDetailProps {
    title: string
    message: string
    author: {
        creatorId: string
        avatar?: string
    }
    createTime: string
    type: "EVENT" | "REMINDER"
    closePreview: () => void
}

export function NotificationDetail({
    title,
    message,
    author,
    createTime,
    type,
    closePreview
  }: NotificationDetailProps) {
    return (
        <div className="flex flex-col h-[400px]">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                {getNotificationIcon(type)}
                {title}
              </h4>
              <Button variant="ghost" size="icon" onClick={closePreview}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <div className="text-xs text-muted-foreground mb-4">{createTime}</div>
              <p className="text-sm">{message}</p>
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" size="sm" className="w-full" onClick={closePreview}>
                Back to notifications
              </Button>
            </div>
          </div>
    )
  }