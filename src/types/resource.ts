import { Users } from 'lucide-react'

export type Resource = {
  id: number
  name: string
  type: string
  domain: 'Auth' | 'Finance'
  status: 'Active' | 'Draft'
  updated: string
  owner: string
  icon: typeof Users
}
