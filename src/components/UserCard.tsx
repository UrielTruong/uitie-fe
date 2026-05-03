import { Card, Image, Badge, Button } from 'react-bootstrap'
import { Mail, ShieldCheck, Lock, UserRound } from 'lucide-react'
import type { User } from '#/types/user'
import UserAvatar from './UserAvatar'

const ROLE_ICON: Record<User['role'], React.ReactNode> = {
  'Super Admin': <ShieldCheck size={14} />,
  Admin: <Lock size={14} />,
  Student: <UserRound size={14} />,
}

interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (user: User) => void
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card className="mb-4 shadow-sm border-0 rounded-4">
      <Card.Body className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
            <UserAvatar fullName={user.full_name ?? ''} />
            <div>
              <h6 className="mb-0 fw-bold">{user.full_name ?? '—'}</h6>
              <div className="text-muted small d-flex align-items-center gap-1">
                <Mail size={12} />
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="d-flex align-items-center gap-2 text-muted small mb-4">
          {ROLE_ICON[user.role]}
          <span>{user.role.replace('_', ' ')}</span>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="d-flex align-items-center gap-2 pt-3 border-top">
            {onEdit && (
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-3"
                onClick={() => onEdit(user)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline-danger"
                size="sm"
                className="rounded-3"
                onClick={() => onDelete(user)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
