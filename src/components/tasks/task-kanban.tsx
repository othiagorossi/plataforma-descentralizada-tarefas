import { Task, TaskStatus } from '@/types'
import useMainStore from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TaskKanban({ onTaskClick }: { onTaskClick: (task: Task) => void }) {
  const { tasks, currentUser, deleteTask } = useMainStore()

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'A Fazer' },
    { id: 'in-progress', title: 'Em Progresso' },
    { id: 'done', title: 'Concluído' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {columns.map((col) => (
        <div key={col.id} className="bg-muted/30 rounded-xl p-4 flex flex-col">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
            {col.title}
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {tasks
              .filter((t) => t.status === col.id)
              .map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors group"
                >
                  <CardContent className="p-4" onClick={() => onTaskClick(task)}>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="font-medium text-sm leading-tight flex-1">{task.title}</h4>
                      {(currentUser?.role === 'Admin' ||
                        currentUser?.role === 'Project Manager') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTask(task.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="secondary" className="text-[10px]">
                        {task.credits} Créditos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
