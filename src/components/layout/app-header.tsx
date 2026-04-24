import { Bell, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import useMainStore from '@/stores/main'
import { Badge } from '@/components/ui/badge'

export function AppHeader() {
  const { activities } = useMainStore()
  const recentActivities = activities.slice(0, 3)

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="lg:hidden" />
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tarefas, pessoas ou espaços..."
            className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b text-sm font-medium">Notificações</div>
            {recentActivities.map((act) => (
              <DropdownMenuItem
                key={act.id}
                className="p-3 flex flex-col items-start gap-1 cursor-default"
              >
                <p className="text-sm line-clamp-2">
                  <span className="font-semibold">{act.user.name}</span> {act.action}{' '}
                  <span className="font-medium text-primary">{act.target}</span>
                </p>
                <span className="text-xs text-muted-foreground">{act.date}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Criar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Nova Tarefa</DropdownMenuItem>
            <DropdownMenuItem>Convidar Membro</DropdownMenuItem>
            <DropdownMenuItem>Novo Espaço</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
