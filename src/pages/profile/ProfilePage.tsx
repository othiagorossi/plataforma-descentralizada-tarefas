import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import useMainStore from '@/stores/main'
import { Coins, Mail, User, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { currentUser } = useMainStore()

  if (!currentUser) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Visualize suas informações e estatísticas na plataforma.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left space-y-1">
              <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
              <div className="flex items-center justify-center sm:justify-start text-muted-foreground gap-2">
                <Mail className="w-4 h-4" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge variant="secondary" className="gap-1">
                  <Shield className="w-3 h-3" /> {currentUser.role}
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-1 bg-accent/10 text-accent border-accent/20"
                >
                  <Coins className="w-3 h-3" /> {currentUser.credits} Créditos
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
              <User className="w-5 h-5" /> Habilidades
            </h3>
            {currentUser.skills && currentUser.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((skill) => (
                  <Badge key={skill} className="bg-primary/10 text-primary hover:bg-primary/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhuma habilidade cadastrada ainda.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
