"use client"

import { useState,useEffect } from "react"
import { CommentList } from "./components/comment-list"
import { AddCommentForm } from "./components/add-comment-form"
import { NotificationPanel } from "./components/notification-panel"
import {
    fetchComments,
    addComment as apiAddComment,
    updateComment as apiUpdateComment,
    deleteComment as apiDeleteComment,
  } from "./services/api"
import type { Comment, ApiResponse,Notification, NotificationResonse } from "./types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"
import { fetchNotifications } from "./services/notification_api"
const currentUser = {
  id: "f02c7994-0c6f-4151-85a2-3413b562a5e9",
  firstName: "Jamie",
  lastName: "Zhang",
  email: "consultant01@aigeducation.com",
  avatarUrl: "/icon/consultant01@aigeducation.com",
}
export default function CommentPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  loadNotifications()
  loadComments()
    
}, [])
const loadNotifications = async () => {
  try {
  setIsLoading(true)
  setError(null)
  const response: NotificationResonse = await fetchNotifications()
  if (response.code === 200) {
    setNotifications(response.body)
  } else {
      setError(response.message)
  }
  } catch (err) {
  setError(err instanceof Error ? err.message : "Failed to load comments")
  } finally {
  setIsLoading(false)
  }
  fetchNotifications()
}

const loadComments = async () => {
    try {
    setIsLoading(true)
    setError(null)
    const response: ApiResponse = await fetchComments()
    if (response.code === 200) {
      setComments(response.body)
    } else {
        setError(response.message)
    }
    } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load Notifications")
    } finally {
    setIsLoading(false)
    }
    fetchComments()
}

const addComment = async (text: string) => {
    
  try {
        setError(null)
        const response: ApiResponse = await apiAddComment(text)
        if (response.code === 200) {
            await loadComments() // Reload comments after adding
        } else {
            setError(response.message)
        }
    } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to add comment")
    }
}
  /*const editComment = (commentId: string, newText: string, isViewed?: boolean,) => {
    setComments(comments.map((comment) => (String(comment.commentId) === commentId ?
      { ...comment, content: newText ,isViewed: isViewed  ?? comment.isViewed,views: isViewed && !comment.isViewed ? comment.views + 1 : comment.views } : comment)))
  }*/
const editComment = async (commentId: string, newText: string) => {
    try {
        setError(null)
        const response: ApiResponse = await apiUpdateComment(commentId, newText)
        if (response.code === 200) {
        await loadComments() // Reload comments after editing
        } else {
        setError(response.message)
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update comment")
    }
}

  /*const deleteComment = (commentId: string) => {
    setComments(comments.filter((comment) => String(comment.commentId) !== commentId))
  }*/
  const deleteCommentHandler = async (commentId: string) => {
      try {
          setError(null)
          const response: ApiResponse = await apiDeleteComment(commentId)
          if (response.code === 200) {
          await loadComments() // Reload comments after deleting
          } else {
          setError(response.message)
          }
      } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to delete comment")
      }
  }
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) => (notification.notificationId === notificationId ? { ...notification, read: true } : notification)),
    )
  }
  const handleViewDetails = (notification: Notification) => {
    console.log("Viewing details for notification:", notification)
    // Add your navigation logic here
  }
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Discussion</h1>
        <NotificationPanel
          notifications={notifications}
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
          onViewDetails={handleViewDetails}
        />
      </div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <ReloadIcon className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>       
            <CommentList
                comments={comments}
                currentUser={currentUser.id}
                onEditComment={editComment}
                onDeleteComment={deleteCommentHandler}
            />
            <div className="mt-8">
                <AddCommentForm onAddComment={addComment} />
            </div>  
        </>
      )}
    </div>
  )
}

function setIsLoading(arg0: boolean) {
  throw new Error("Function not implemented.")
}

function setError(arg0: null) {
  throw new Error("Function not implemented.")
}

