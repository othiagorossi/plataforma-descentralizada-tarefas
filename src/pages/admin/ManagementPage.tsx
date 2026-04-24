import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import useMainStore from '@/stores/main'
import { toast } from 'sonner'
import { Shield } from 'lucide-react'

export default function ManagementPage() {
  const { macroAreas, users, updateMacroArea, updateUserRole, currentUser } = useMainStore()
  const [editingArea, setEditingArea] = useState<string | null>(null)
  const [costCenterInput, setCostCenterInput] = useState('')

  if (currentUser?.role !== 'Project Manager' && currentUser?.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-bold">Acesso Restrito</h2>
          <p className="text-muted-foreground">
            Apenas gerentes de projeto podem acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  const handleSaveCostCenter = (areaId: string) => {
    updateMacroArea(areaId, { costCenter: costCenterInput })
    setEditingArea(null)
    toast.success('Centro de custos atualizado com sucesso!')
  }

  const handleAssignLeader = (areaId: string, userId: string) => {
    if (userId === 'unassigned') {
      updateMacroArea(areaId, { leaderId: undefined })
      toast.success('Líder removido.')
      return
    }

    const user = users.find((u) => u.id === userId)
    if (user) {
      const newAreas = user.assignedAreas ? [...new Set([...user.assignedAreas, areaId])] : [areaId]
      updateUserRole(userId, 'Area Leader', newAreas)
      updateMacroArea(areaId, { leaderId: userId })
      toast.success(`${user.name} agora é líder da área.`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Áreas</h1>
        <p className="text-muted-foreground">
          Gerencie as macro áreas, centros de custo e atribua líderes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Macro Áreas (1 a 6)</CardTitle>
          <CardDescription>
            Defina os líderes e os centros de custo para as áreas de atuação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Área</TableHead>
                <TableHead>Centro de Custos</TableHead>
                <TableHead>Líder Atribuído</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {macroAreas.map((area) => {
                const leader =
                  users.find((u) => u.id === area.leaderId) ||
                  users.find((u) => u.assignedAreas?.includes(area.id))

                return (
                  <TableRow key={area.id}>
                    <TableCell className="font-medium">{area.name}</TableCell>
                    <TableCell>
                      {editingArea === area.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={costCenterInput}
                            onChange={(e) => setCostCenterInput(e.target.value)}
                            className="w-32 h-8"
                          />
                          <Button size="sm" onClick={() => handleSaveCostCenter(area.id)}>
                            Salvar
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => {
                            setEditingArea(area.id)
                            setCostCenterInput(area.costCenter)
                          }}
                        >
                          <Badge variant="outline" className="font-mono">
                            {area.costCenter}
                          </Badge>
                          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            Editar
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={leader?.id || 'unassigned'}
                        onValueChange={(val) => handleAssignLeader(area.id, val)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Selecione um líder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Sem líder</SelectItem>
                          {users.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name} {u.role === 'Project Manager' ? '(PM)' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {leader && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {leader.role}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
