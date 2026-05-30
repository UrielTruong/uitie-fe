import { useGroupDetail, useInviteMember, useLeaveGroup, useRemoveMember } from '#/integrations/useChat'
import { useStore } from '@tanstack/react-store'
import { authStore } from '#/lib/auth'
import { Search, Trash2, UserMinus, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { Button, Form, InputGroup, ListGroup, Modal, Spinner } from 'react-bootstrap'
import axiosClient from '#/api/axiosClient'

interface Props {
  groupId: number
  onDeleteGroup: () => void
  onClose: () => void
}

interface UserSearchResult {
  id: number
  full_name: string
  email: string
}

export default function GroupInfoPanel({ groupId, onDeleteGroup, onClose }: Props) {
  const user = useStore(authStore, (s) => s.user)
  const { data: group, isLoading } = useGroupDetail(groupId)
  const inviteMember = useInviteMember(groupId)
  const removeMember = useRemoveMember(groupId)
  const leaveGroup = useLeaveGroup()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isOwner = group?.created_by === Number(user?.id)

  async function handleSearch(q: string) {
    setSearchQuery(q)
    if (q.trim().length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const res = await axiosClient.get('/user/search', { params: { keyword: q } })
      setSearchResults(res.data.data ?? [])
    } finally {
      setSearching(false)
    }
  }

  function handleInvite(userId: number) {
    inviteMember.mutate(userId, {
      onSuccess: () => {
        setSearchQuery('')
        setSearchResults([])
      },
    })
  }

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (!group) return null

  const memberIds = new Set(group.members.map((m) => m.user.id))

  return (
    <div className="d-flex flex-column h-100 p-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold mb-0">Group Info</h6>
        <Button variant="link" className="p-0 text-secondary" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <h5 className="fw-bold text-center mb-1">{group.group_name}</h5>
      <p className="text-secondary small text-center mb-3">
        {group.members.length} member{group.members.length !== 1 ? 's' : ''}
      </p>

      {/* Invite member search (owner only) */}
      {isOwner && (
        <div className="mb-3">
          <p className="small fw-semibold mb-1">Invite member</p>
          <InputGroup size="sm">
            <InputGroup.Text>
              <Search size={12} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search users…"
              value={searchQuery}
              onChange={(e) => void handleSearch(e.target.value)}
            />
          </InputGroup>
          {searching && <div className="small text-secondary mt-1">Searching…</div>}
          {searchResults.length > 0 && (
            <ListGroup className="mt-1" style={{ maxHeight: 140, overflowY: 'auto' }}>
              {searchResults
                .filter((u) => !memberIds.has(u.id))
                .map((u) => (
                  <ListGroup.Item
                    key={u.id}
                    className="d-flex justify-content-between align-items-center py-1 px-2"
                  >
                    <div>
                      <div className="small fw-semibold">{u.full_name}</div>
                      <div className="text-secondary" style={{ fontSize: 11 }}>
                        {u.email}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="py-0 px-2"
                      onClick={() => handleInvite(u.id)}
                      disabled={inviteMember.isPending}
                    >
                      <UserPlus size={12} />
                    </Button>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          )}
        </div>
      )}

      {/* Member list */}
      <p className="small fw-semibold mb-1">Members</p>
      <div className="flex-grow-1 overflow-y-auto">
        <ListGroup>
          {group.members.map((m) => (
            <ListGroup.Item
              key={m.id}
              className="d-flex justify-content-between align-items-center py-2 px-2"
            >
              <div>
                <div className="small fw-semibold">
                  {m.user.full_name}
                  {m.user.id === group.created_by && (
                    <span className="ms-1 badge bg-warning text-dark" style={{ fontSize: 9 }}>
                      Owner
                    </span>
                  )}
                </div>
                <div className="text-secondary" style={{ fontSize: 11 }}>
                  {m.status}
                </div>
              </div>
              {isOwner && m.user.id !== group.created_by && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="py-0 px-2"
                  onClick={() => removeMember.mutate(m.user.id)}
                  disabled={removeMember.isPending}
                >
                  <UserMinus size={12} />
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {/* Actions */}
      <div className="mt-3 d-flex flex-column gap-2">
        {!isOwner && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => leaveGroup.mutate(groupId)}
            disabled={leaveGroup.isPending}
          >
            {leaveGroup.isPending ? <Spinner animation="border" size="sm" /> : 'Leave Group'}
          </Button>
        )}
        {isOwner && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={14} className="me-1" />
            Delete Group
          </Button>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fs-6">Delete group?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small">
          This will permanently delete the group and all its messages.
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button size="sm" variant="danger" onClick={onDeleteGroup}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
