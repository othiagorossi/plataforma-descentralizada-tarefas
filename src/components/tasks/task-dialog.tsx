import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Task } from '@/types'
import { Coins, Calendar, Tag, Play, CheckCircle } from 'lucide-react'
import useMainStore from '@/stores/main'

interface TaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDialog({ task, open, onOpenChange }: TaskDialogProps) {
  const { updateTaskStatus, awardCredits, currentUser } = useMainStore()

  if (!task) return null

  const handleAction = () => {
    if (task.status === 'todo') {
      updateTaskStatus(task.id, 'in-progress')
      onOpenChange(false)
    } else if (task.status === 'in-progress') {
      updateTaskStatus(task.id, 'review')
      onOpenChange(false)
    } else if (task.status === 'review') {
      // Approve and award
      updateTaskStatus(task.id, 'done')
      if (task.assignees.length > 0) {
        // Just award to first assignee for simplicity or current user if not assigned
        awardCredits(task.credits, task.assignees[0].id)
      } else {
        awardCredits(task.credits, currentUser.id)
      }
      onOpenChange(false)
    }
  }

  const getActionLabel = () => {
    switch (task.status) {
      case 'todo':
        return { label: 'Iniciar Tarefa', icon: Play, variant: 'default' as const }
      case 'in-progress':
        return { label: 'Enviar para Revisão', icon: CheckCircle, variant: 'secondary' as const }
      case 'review':
        return { label: 'Aprovar & Dar Créditos', icon: Coins, variant: 'default' as const }
      default:
        return null
    }
  }

  const action = getActionLabel()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6 mb-2">
            <Badge variant="outline" className="uppercase text-xs font-semibold">
              {task.status.replace('-', ' ')}
            </Badge>
            <div className="flex items-center text-accent font-bold bg-accent/10 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 mr-1.5" />
              {task.credits} Créditos
            </div>
          </div>
          <DialogTitle className="text-2xl leading-tight">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {task.description}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground font-medium">
                <Tag className="w-4 h-4 mr-2" /> Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground font-medium">
                <Calendar className="w-4 h-4 mr-2" /> Prazo
              </div>
              <div>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-medium text-sm text-muted-foreground">Responsáveis</div>
            <div className="flex flex-wrap gap-3">
              {task.assignees.length > 0 ? (
                task.assignees.map((user) => (
                  <div key={user.id} className="flex items-center bg-muted rounded-full pr-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium ml-2">{user.name}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground italic">Ninguém atribuído ainda</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end border-t pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {action && (
            <Button
              variant={action.variant}
              onClick={handleAction}
              className={cn(
                action.variant === 'default' && task.status === 'review'
                  ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                  : '',
              )}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
