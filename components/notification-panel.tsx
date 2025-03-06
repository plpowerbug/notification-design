"use client"

import { useState, useCallback, useMemo } from "react"
import { Bell,X,Info, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type {  Notification, TimeFilter } from "../types"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NotificationPreview } from "./notification-preview"
import { NotificationDetail } from "./notification-detail"
import { AnimatePresence, motion } from "framer-motion"
import Image from 'next/image'

interface NotificationPanelProps {
  notifications: Notification[]
  onMarkAsRead: (commentId: string) => void
  onMarkAllAsRead: () => void
  onViewDetails: (notification: Notification) => void
}
export const getNotificationStyles = (type: Notification["type"]) => {
  switch (type) {
    case "EVENT":
      return "bg-green-50 text-green-700 border-green-200"
    case "REMINDER":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    default:
      return "bg-blue-50 text-blue-700 border-blue-200"
  }
}


export const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "EVENT":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "REMINDER":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    default:
      return <Info className="h-5 w-5 text-blue-500" />
  }
}
type NotificationType =  "all"|"EVENT"  | "REMINDER"
export function NotificationPanel({ notifications, onMarkAsRead, onMarkAllAsRead,onViewDetails }: NotificationPanelProps) {
  const [open, setOpen] = useState(false)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30days")
  const [hoveredNotification, setHoveredNotification] = useState<string | null>(null)
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([])
  const [activeTypeFilter, setActiveTypeFilter] = useState<NotificationType>("all")
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const closePreview = () => {
    setSelectedNotification(null)
  }
  const handleMouseEnter = (notificationId: string) => {
    setHoveredNotification(notificationId);
  };
  
  const handleMouseLeave = () => {
    setHoveredNotification(null);
  };

  // Apply type filter
  const typeFilteredNotifications =
    activeTypeFilter === "all" ? notifications : notifications.filter((n) => n.type === activeTypeFilter)
  // Count by type
  const typeCounts = {
    EVENT: notifications.filter((n) => n.type === "EVENT" && !n.read).length,
    REMINDER: notifications.filter((n) => n.type === "REMINDER"  && !n.read).length,
  }
  // Count by time
  const getTimeFilterDate = (filter: TimeFilter) => {
    const now = new Date()
    switch (filter) {
      case "today":
        return new Date(now.setHours(0, 0, 0, 0))
      case "7days":
        return new Date(now.setDate(now.getDate() - 7))
      case "30days":
        return new Date(now.setDate(now.getDate() - 30))
      default:
        return new Date(0)
    }
  }
  
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year}/${month}/${day} ${hours}:${minutes}`
  }
  const filteredNotifications = useMemo(() => {
    const filterDate = getTimeFilterDate(timeFilter)
    return typeFilteredNotifications
     // ✅ Apply type filter
    .filter((notification) => {
      const notificationDate = new Date(notification.createTime)
    if (notificationDate < filterDate) {
      return false
    }
    if (showUnreadOnly) {
      return !notification.read
    }
    return true
  })
}, [notifications, timeFilter, showUnreadOnly,activeTypeFilter]) // Removed getTimeFilterDate from dependencies

  const getTimeFilterMessage = () => {
    switch (timeFilter) {
      case "today":
        return "today"
      case "7days":
        return "from the last 7 days"
      case "30days":
        return "from the last 30 days"
      default:
        return "from all time"
    }
  }
const handleDismissNotification = useCallback((id: string) => {
  setDismissedNotifications((prev) => [...prev, id])
}, [])

const getAuthorData = (notification: Notification) => {
  return {
    creatorId: notification.creatorId,
    avatar: "/placeholder.svg",
  }
}
const handleNotificationClick = (notification: Notification) => {
  setSelectedNotification(notification)
  if (!notification.read) {
    onMarkAsRead(notification.notificationId)
  }
}

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          setSelectedNotification(null)
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
      {selectedNotification ? (
          // Notification Detail
          <NotificationDetail
            title={selectedNotification.title}
            message={selectedNotification.message}
            author={getAuthorData(selectedNotification)}
            createTime={formatDate(selectedNotification.createTime)}
            type={selectedNotification.type}
            closePreview={closePreview}
          />
        ) : (
          // Notification List
          <>
            <div className="p-3 border-b">
              <div className="flex items-center justify-between p-1 ">
                <h4 className="text-sm font-semibold">Notifications</h4>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Only show unread</span>
                    <Switch checked={showUnreadOnly} onCheckedChange={setShowUnreadOnly} />
                </div>
              </div>
            
              <div className="mt-1">
                  <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
              </div> 
            </div> 
            <div className="p-2 border-b">
              <Tabs
                defaultValue="all"
                value={activeTypeFilter}
                onValueChange={(value) => setActiveTypeFilter(value as NotificationType)}
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="all" className="text-xs">
                    All
                    <Badge variant="secondary" className="ml-1">
                      {unreadCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="EVENT" className="text-xs">
                    Event
                    <Badge variant="secondary" className="ml-1">
                      {typeCounts.EVENT}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="REMINDER" className="text-xs">
                    Reminder
                    <Badge variant="secondary" className="ml-1">
                      {typeCounts.REMINDER}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
        
            {filteredNotifications?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-20 mb-1 relative">
                    <Image
                      src="https://static.vecteezy.com/system/resources/previews/047/468/654/non_2x/no-notifications-empty-state-illustration-free-vector.jpg"
                      alt="No notifications"
                      fill={true}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {showUnreadOnly ? "No unread notifications" : "You've read all your notifications"}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">{activeTypeFilter === "all"
                    ? `No notifications${timeFilter !== "all" ? ` in the ${getTimeFilterMessage().toLowerCase()}` : ""}`
                    : `No ${activeTypeFilter} notifications${timeFilter !== "all" ? ` in the ${getTimeFilterMessage().toLowerCase()}` : ""}`}.</p>
                </div>
            )}
            {filteredNotifications.length > 0 && (
              <div className="divide-y">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <button
                      key={notification.notificationId}
                      className={cn(
                      "flex flex-col gap-1 p-4 text-left text-sm transition-colors hover:bg-accent",
                      !notification.read && getNotificationStyles(notification.type),
                      )}
                      onClick={() => {        
                        handleNotificationClick(notification)
                      }}
                    >
                      <motion.div
                        key={notification.notificationId}
                        initial={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(notification.notificationId)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div
                              className="p-4 hover:bg-accent cursor-pointer"
                              onClick={() => {
                                handleDismissNotification(notification.notificationId)
                                onViewDetails(notification)
                              }}
                        >
                          <div className="flex items-start gap-4">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              {!notification.read && getNotificationIcon(notification.type)}
                            </h4>
                            <div>
                              <div className="font-medium">{notification.title}</div>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {new Date(notification.createTime).toLocaleDateString()}
                              </div>
                            </div>
                          </div>  
                        </div>
                      
                        {hoveredNotification === notification.notificationId && (
                          <div
                          className="absolute left-full top-0 ml-2 z-50"
                          style={{
                            transform: "translateY(-20%)",
                          }}
                          >
                          <NotificationPreview
                            title={notification.title}
                            message={notification.message}
                            author={getAuthorData(notification)}
                            createTime={notification.createTime}
                            type={notification.type}
                          />
                          </div>  
                        )} 
                      </motion.div>
                    </button>
                    )
                  )}
                </AnimatePresence>
              </div>
            )}
          </>      
        )}   
      </PopoverContent>
    </Popover>
  )
}

