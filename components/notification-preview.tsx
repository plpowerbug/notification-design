
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Share2 } from "lucide-react"
import {getNotificationStyles} from "./notification-panel"
interface NotificationPreviewProps {
    title: string
    message: string
    author: {
        creatorId: string
        avatar?: string
    }
    createTime: string
    type: "EVENT" | "REMINDER"
}
export function NotificationPreview({
    title,
    message,
    author,
    createTime,
    type,
  }: NotificationPreviewProps) {
    return (
        <Card className="w-[400px] overflow-hidden">
            <div className="px-6 py-4 bg-muted/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={author.avatar} />
                            <AvatarFallback>{author.creatorId}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium text-sm">{author.creatorId}</div>
                            <div className="text-xs text-muted-foreground">{new Date(createTime).toLocaleString()}</div> 
                        </div>
                    </div>
                    <Badge variant="outline" className={getNotificationStyles(type)}>
                        {type}
                    </Badge>
                </div>
            </div>
            <Separator />
            <div className="p-6">
                <h4 className="font-semibold mb-2">{title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{message}
                </p>    
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="h-8">
                         <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div> 
                </div>
            </div>
        </Card>    
    )
  }
