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
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function AppSidebar() {
  const { spaces } = useMainStore()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [dbSpaces, setDbSpaces] = useState<any[]>([])

  useEffect(() => {
    if (user?.id) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data)
        })
    }

    supabase
      .from('spaces')
      .select('*')
      .then(({ data }) => {
        if (data) setDbSpaces(data)
      })
  }, [user?.id])

  const displaySpaces = dbSpaces.length > 0 ? dbSpaces : spaces || []
  const role = profile?.role || 'Member'

  const navItems = [
    { title: 'Início', url: '/', icon: LayoutDashboard },
    { title: 'Minhas Tarefas', url: '/tarefas', icon: CheckSquare },
    { title: 'Explorar Pessoas', url: '/pessoas', icon: Users },
    { title: 'Gerenciar Espaços', url: '/espacos', icon: Hexagon },
  ]

  if (role === 'Project Manager' || role === 'Admin') {
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
              {displaySpaces.map((space: any) => (
                <SidebarMenuItem key={space.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/espacos?id=${space.id}`}>
                      <img
                        src={space.icon || 'https://img.usecurling.com/i?q=workspace'}
                        alt={space.name}
                        className="w-4 h-4 rounded-sm object-cover mr-2 bg-muted"
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

      {user && (
        <SidebarFooter className="border-t p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={profile?.avatar || user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {(profile?.name || user?.user_metadata?.name || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="text-sm font-medium truncate">
                {profile?.name || user?.user_metadata?.name || 'Usuário'}
              </span>
              <span className="text-xs text-muted-foreground truncate">{role}</span>
              <div className="flex items-center text-xs text-accent font-semibold mt-0.5">
                <Coins className="w-3 h-3 mr-1" />
                {profile?.credits || 0} Créditos
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="text-xs text-muted-foreground hover:text-foreground text-left w-full py-1 font-medium transition-colors"
          >
            Sair da conta
          </button>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
