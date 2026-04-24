import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import useMainStore from '@/stores/main'
import { Coins, Hexagon, Star } from 'lucide-react'

export default function PeoplePage() {
  const { users, macroAreas } = useMainStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pessoas</h1>
        <p className="text-muted-foreground">Conheça os contribuidores e líderes da plataforma.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const userAreas = macroAreas.filter((a) => user.assignedAreas?.includes(a.id))

          return (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-accent fill-accent" />
                      <span className="font-medium text-foreground">{user.role}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{user.credits} Créditos</span>
                  </div>

                  {userAreas.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        Áreas de Responsabilidade
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {userAreas.map((area) => (
                          <Badge
                            key={area.id}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            <Hexagon className="w-3 h-3 mr-1" />
                            {area.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.skills.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        Habilidades
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {user.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
