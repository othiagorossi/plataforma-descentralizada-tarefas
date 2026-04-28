import { useState } from 'react'
import { Task } from '@/types'
import { TaskKanban } from '@/components/tasks/task-kanban'
import { TaskDialog } from '@/components/tasks/task-dialog'
import { Button } from '@/components/ui/button'
import { Kanban, List, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useMainStore from '@/stores/main'

export default function TasksPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { addTask, currentUser } = useMainStore()

  // New task state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [credits, setCredits] = useState(10)

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleCreateTask = async () => {
    if (!title) return
    await addTask({
      title,
      description,
      credits,
      status: 'todo',
    })
    setIsCreateOpen(false)
    setTitle('')
    setDescription('')
    setCredits(10)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">Coordene o trabalho de forma descentralizada.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-muted p-1 rounded-md flex items-center">
            <Button
              variant={view === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setView('kanban')}
            >
              <Kanban className="w-4 h-4 mr-2" /> Quadro
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setView('list')}
            >
              <List className="w-4 h-4 mr-2" /> Lista
            </Button>
          </div>

          {(currentUser?.role === 'Admin' || currentUser?.role === 'Project Manager') && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9">
                  <Plus className="w-4 h-4 mr-1" /> Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Desenvolver nova funcionalidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detalhes da tarefa..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Créditos de Recompensa</Label>
                    <Input
                      type="number"
                      value={credits}
                      onChange={(e) => setCredits(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateTask} disabled={!title}>
                    Criar Tarefa
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden animate-fade-in">
        {view === 'kanban' ? (
          <TaskKanban onTaskClick={handleTaskClick} />
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
            Visualização em lista em desenvolvimento. Por favor, use o modo Kanban.
          </div>
        )}
      </div>

      {isDialogOpen && (
        <TaskDialog task={selectedTask} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      )}
    </div>
  )
}
