import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Coins, Layers } from 'lucide-react'
import useMainStore from '@/stores/main'
import { cn } from '@/lib/utils'

export default function Index() {
  const { tasks, currentUser, activities, users } = useMainStore()

  const activeTasks = tasks.filter((t) => t.status !== 'done').length
  const pendingCredits = tasks
    .filter((t) => t.status === 'review' && t.assignees.some((a) => a.id === currentUser.id))
    .reduce((acc, t) => acc + t.credits, 0)

  const myAssignedTasks = tasks.filter(
    (t) => t.status !== 'done' && t.assignees.some((a) => a.id === currentUser.id),
  )

  const topUsers = [...users].sort((a, b) => b.credits - a.credits).slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">
          Acompanhe suas tarefas e contribuições nos seus espaços.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Ativas</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks}</div>
            <p className="text-xs text-muted-foreground">Em todos os espaços</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{pendingCredits}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Créditos</CardTitle>
            <Coins className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{currentUser.credits}</div>
            <p className="text-xs text-muted-foreground">Acumulados este mês</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((t) => t.status === 'done').length}
            </div>
            <p className="text-xs text-muted-foreground">No histórico global</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Minhas Tarefas Atuais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAssignedTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma tarefa atribuída no momento.
                </p>
              ) : (
                myAssignedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.tags.join(' • ')}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="font-semibold text-accent border-accent/20 bg-accent/10"
                    >
                      {task.credits} C
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className="col-span-full lg:col-span-3 animate-fade-in-up"
          style={{ animationDelay: '500ms' }}
        >
          <CardHeader>
            <CardTitle>Top Contribuidores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topUsers.map((user, i) => (
                <div key={user.id} className="flex items-center">
                  <div className="flex items-center justify-center w-6 text-sm font-bold text-muted-foreground mr-2">
                    {i + 1}
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                  <div className="font-medium text-sm text-accent">{user.credits} C</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
