import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Coins } from 'lucide-react'
import useMainStore from '@/stores/main'

export default function PeoplePage() {
  const { users } = useMainStore()
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pessoas</h1>
          <p className="text-muted-foreground">O capital humano do seu ecossistema.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou skill..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" /> Convidar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in-up">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 mb-4 border-4 border-background shadow-sm">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg mb-1">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{user.role}</p>

              <div className="flex items-center gap-1.5 text-accent font-bold bg-accent/10 px-4 py-1.5 rounded-full mb-5">
                <Coins className="w-4 h-4" />
                {user.credits}
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 w-full">
                {user.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs font-normal text-muted-foreground bg-muted/50 border-muted"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
