"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2, Edit2, User } from "lucide-react"
import type { Comment } from "../types"

interface CommentListProps {
  comments: Comment[]
  currentUser: string
  onEditComment: (commentId:
  string, newText: string, isViewed?: boolean) => void
  onDeleteComment: (commentId: string) => void
}

export function CommentList({ comments, currentUser, onEditComment, onDeleteComment }: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const startEditing = (commentId: string, text: string) => {
    setEditingId(commentId)
    setEditText(text)
  }

  const saveEdit = () => {
    if (editText.trim() && editingId !== null) {
      onEditComment(editingId, editText)
      setEditingId(null)
      setEditText("")
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
const username = (comment: Comment)=>{
  return `${comment.creatorFirstName} ${comment.creatorLastName}`.trim()
}
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Total comments: {comments.length} 
      </div>
      {comments.map((comment) => (
        <Card key={comment.commentId} className={`${comment.creatorId === currentUser ? "border-primary" : ""} shadow-md`}>
          <CardHeader className="pb-2">
            <div className="flex items-start space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.creatorId}`} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold">{username(comment)}</CardTitle>
                <p className="text-sm text-muted-foreground">{formatDate(comment.createdTime)}</p>
              </div>
            </div>
            
          </CardHeader>
          <CardContent>
            {editingId === comment.commentId ? (
              <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="mb-2 min-h-[100px]" />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            )}
          </CardContent>
          {comment.creatorId === currentUser && (
            <CardFooter className="flex justify-end space-x-2 pt-0">
              {editingId === comment.commentId ? (
                <Button onClick={saveEdit} size="sm">
                  Save
                </Button>
              ) : (
                <Button variant="outline" size="icon" onClick={() => startEditing(comment.commentId, comment.content)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="destructive" size="icon" onClick={() => onDeleteComment(comment.commentId)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}

