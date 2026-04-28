import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Ajuste as preferências de uso da plataforma.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferências de Notificação</CardTitle>
          <CardDescription>
            Escolha como você quer ser notificado sobre as atividades.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Notificações por E-mail</Label>
              <p className="text-sm text-muted-foreground">
                Receba um resumo diário das tarefas da equipe diretamente no seu e-mail.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Novas Tarefas Atribuídas</Label>
              <p className="text-sm text-muted-foreground">
                Seja avisado imediatamente quando uma nova tarefa for delegada a você.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Modo Escuro Automático</Label>
              <p className="text-sm text-muted-foreground">
                Sincronize o tema da plataforma com as preferências do seu sistema.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
