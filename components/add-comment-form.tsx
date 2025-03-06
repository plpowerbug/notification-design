"use client"

import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card,CardHeader, CardTitle,CardContent,CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User,Send } from "lucide-react"

interface AddCommentFormProps {
  onAddComment: (text: string) => void
  
}
const MAX_COMMENT_LENGTH = 500
export function AddCommentForm({ onAddComment }: AddCommentFormProps) {
  const [newComment, setNewComment] = useState("")
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    setCharCount(newComment.length)
  }, [newComment])
  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }
  const isCommentValid = newComment.trim().length > 0 && charCount <= MAX_COMMENT_LENGTH
  return (
    <Card className="mb-6 shadow-md add-comment-form">
      <div className="p-2 w-full">
            <div>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this topic..."
              rows={newComment?.split('\n').length>5?5:newComment?.split('\n').length}
              maxLength={MAX_COMMENT_LENGTH}         
              className="border-0 w-full shadow-none focus-visible:ring-0 resize-none text-base"         
            />
            <div
              className={`mt-2 flex justify-end text-sm ${
                charCount > MAX_COMMENT_LENGTH ? "text-red-500" : "text-gray-400"
              } justify-end`}
            >
              {charCount}/{MAX_COMMENT_LENGTH}
            </div>
            </div>
            <div className=" flex justify-between">
              <div className={'flex gap-2 pl-2'}>
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-2 flex justify-end">
                <Button mr-2 onClick={handleSubmit} size="icon" disabled={!isCommentValid}  className="px-6">
                  Post<Send />
                </Button>
              </div>
            </div>
      </div>
    </Card>
  )
}

