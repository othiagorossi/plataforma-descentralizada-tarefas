import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { LayoutDashboard, CheckSquare, Users, Settings, Hexagon, Coins } from 'lucide-react'
import useMainStore from '@/stores/main'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AppSidebar() {
  const { currentUser, spaces, logout } = useMainStore()
  const location = useLocation()

  const navItems = [
    { title: 'Início', url: '/', icon: LayoutDashboard },
    { title: 'Minhas Tarefas', url: '/tarefas', icon: CheckSquare },
    { title: 'Explorar Pessoas', url: '/pessoas', icon: Users },
    { title: 'Gerenciar Espaços', url: '/espacos', icon: Hexagon },
  ]

  if (currentUser?.role === 'Project Manager' || currentUser?.role === 'Admin') {
    navItems.push({ title: 'Gestão de Áreas', url: '/gestao', icon: Settings })
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Hexagon className="w-6 h-6 fill-primary text-primary-foreground" />
          <span>SyncHub</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Meus Espaços</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {spaces.map((space) => (
                <SidebarMenuItem key={space.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/espacos?id=${space.id}`}>
                      <img
                        src={space.icon}
                        alt={space.name}
                        className="w-4 h-4 rounded-sm object-cover mr-2"
                      />
                      <span>{space.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {currentUser && (
        <SidebarFooter className="border-t p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="text-sm font-medium truncate">{currentUser.name}</span>
              <span className="text-xs text-muted-foreground truncate">{currentUser.role}</span>
              <div className="flex items-center text-xs text-accent font-semibold mt-0.5">
                <Coins className="w-3 h-3 mr-1" />
                {currentUser.credits} Créditos
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-xs text-muted-foreground hover:text-foreground text-left w-full py-1 font-medium transition-colors"
          >
            Sair da conta
          </button>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
