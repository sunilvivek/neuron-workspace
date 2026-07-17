export type TeamMemberStatus = "online" | "offline" | "away"

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  status: TeamMemberStatus
  lastActive: string
}
