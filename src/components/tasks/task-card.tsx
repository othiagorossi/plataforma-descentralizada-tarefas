import React from 'react'
import { Task } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Coins, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const getStatusBorder = () => {
    switch (task.status) {
      case 'todo':
        return 'status-border-todo'
      case 'in-progress':
        return 'status-border-in-progress'
      case 'review':
        return 'status-border-review'
      case 'done':
        return 'status-border-done'
      default:
        return ''
    }
  }

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(task)}
      className={cn(
        'cursor-pointer hover:shadow-md transition-all duration-200 mb-3 bg-card',
        getStatusBorder(),
      )}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h4>
        </div>

        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center -space-x-2">
            {task.assignees.length > 0 ? (
              task.assignees.map((user, i) => (
                <Avatar
                  key={user.id}
                  className="w-6 h-6 border-2 border-background ring-background"
                >
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-[10px]">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-muted flex items-center justify-center bg-muted/30">
                <span className="text-[10px] text-muted-foreground">?</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            <Coins className="w-3 h-3" />
            {task.credits}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
