import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Image as ImageIcon } from 'lucide-react'
import useMainStore from '@/stores/main'
import { toast } from 'sonner'

export default function SpacesPage() {
  const { spaces } = useMainStore()
  const mainSpace = spaces[0]

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!')
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Espaço</h1>
        <p className="text-muted-foreground">
          Configure as definições do seu grupo descentralizado.
        </p>
      </div>

      <div className="grid gap-6 animate-fade-in-up">
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Espaço</CardTitle>
            <CardDescription>Informações públicas visíveis para todos os membros.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-muted bg-muted flex items-center justify-center">
                  <img
                    src={mainSpace.icon}
                    alt="Space Icon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="name">Nome do Espaço</Label>
                <Input id="name" defaultValue={mainSpace.name} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Qual o propósito deste espaço?"
                defaultValue="O hub central de coordenação para os contribuidores."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistema de Créditos</CardTitle>
            <CardDescription>Como o valor flui dentro da comunidade.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="space-y-0.5">
                <div className="font-medium">Aprovação Manual (Atual)</div>
                <div className="text-sm text-muted-foreground">
                  Admins avaliam as tarefas em revisão e liberam os créditos.
                </div>
              </div>
              <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">
                Ativo
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/10 opacity-70">
              <div className="space-y-0.5">
                <div className="font-medium">Aprovação por Pares (Em breve)</div>
                <div className="text-sm text-muted-foreground">
                  Necessita de aprovação de 2 membros de mesmo nível para liberar créditos.
                </div>
              </div>
              <Badge variant="outline">Breve</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}
