import { Task, User, Activity, Space, MacroArea } from '@/types'

export const mockMacroAreas: MacroArea[] = [
  { id: 'area1', name: 'Área 1', costCenter: 'CC-1001' },
  { id: 'area2', name: 'Área 2', costCenter: 'CC-1002' },
  { id: 'area3', name: 'Área 3', costCenter: 'CC-1003' },
  { id: 'area4', name: 'Área 4', costCenter: 'CC-1004' },
  { id: 'area5', name: 'Área 5', costCenter: 'CC-1005' },
  { id: 'area6', name: 'Área 6', costCenter: 'CC-1006' },
]

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Ana Silva',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    role: 'Project Manager',
    credits: 1250,
    skills: ['Design', 'UX', 'Management'],
  },
  {
    id: 'u2',
    name: 'Carlos Mendes',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
    role: 'Contribuidor',
    credits: 840,
    skills: ['Frontend', 'React'],
  },
  {
    id: 'u3',
    name: 'Beatriz Costa',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
    role: 'Area Leader',
    credits: 2100,
    skills: ['Copywriting', 'Marketing'],
    assignedAreas: ['area1', 'area3'],
  },
  {
    id: 'u4',
    name: 'João Pedro',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
    role: 'Contribuidor',
    credits: 450,
    skills: ['Backend', 'Node.js'],
  },
]

export const currentUser = null

export const mockSpaces: Space[] = [
  {
    id: 's1',
    name: 'Coordina Core',
    icon: 'https://img.usecurling.com/i?q=planet&color=gradient',
    memberCount: 12,
  },
  {
    id: 's2',
    name: 'Design Guild',
    icon: 'https://img.usecurling.com/i?q=palette&color=violet',
    memberCount: 8,
  },
  {
    id: 's3',
    name: 'Marketing Squad',
    icon: 'https://img.usecurling.com/i?q=megaphone&color=orange',
    memberCount: 15,
  },
]

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Criar wireframes da nova landing page',
    description:
      'Precisamos de wireframes de alta fidelidade para a nova página principal focada em conversão.',
    status: 'in-progress',
    credits: 150,
    assignees: [mockUsers[0], mockUsers[1]],
    tags: ['Design', 'Urgente'],
    dueDate: '2026-05-01',
    macroAreaId: 'area1',
  },
  {
    id: 't2',
    title: 'Implementar autenticação JWT',
    description: 'Configurar o fluxo de login e renovação de tokens no backend.',
    status: 'review',
    credits: 300,
    assignees: [mockUsers[3]],
    tags: ['Dev', 'Backend'],
    dueDate: '2026-04-28',
    macroAreaId: 'area2',
  },
  {
    id: 't3',
    title: 'Escrever copy para anúncios de Redes Sociais',
    description: 'Criar 5 variações de copy para a nova campanha de aquisição.',
    status: 'done',
    credits: 50,
    assignees: [mockUsers[2]],
    tags: ['Marketing'],
    dueDate: '2026-04-20',
    macroAreaId: 'area3',
  },
  {
    id: 't4',
    title: 'Otimizar performance de imagens',
    description: 'Implementar lazy loading e webp em todas as imagens da plataforma.',
    status: 'todo',
    credits: 100,
    assignees: [],
    tags: ['Dev', 'Frontend'],
  },
  {
    id: 't5',
    title: 'Atualizar documentação do Onboarding',
    description: 'Revisar o guia de primeiros passos para novos contribuidores.',
    status: 'todo',
    credits: 80,
    assignees: [mockUsers[2]],
    tags: ['Comunidade'],
    macroAreaId: 'area1',
  },
]

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    user: mockUsers[1],
    action: 'concluiu a tarefa',
    target: 'Componente de Navegação',
    date: 'Há 2 horas',
  },
  {
    id: 'a2',
    user: mockUsers[2],
    action: 'ganhou 50 créditos em',
    target: 'Revisão de Artigo',
    date: 'Há 5 horas',
  },
  {
    id: 'a3',
    user: mockUsers[3],
    action: 'moveu para revisão',
    target: 'Implementar autenticação JWT',
    date: 'Ontem',
  },
  {
    id: 'a4',
    user: mockUsers[0],
    action: 'criou o espaço',
    target: 'Design Guild',
    date: 'Há 2 dias',
  },
]
