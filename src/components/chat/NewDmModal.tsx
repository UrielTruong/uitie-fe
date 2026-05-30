import axiosClient from '#/api/axiosClient'
import type { ActiveConversation } from '#/types/chat'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Form, InputGroup, Modal } from 'react-bootstrap'
import UserAvatar from '../UserAvatar'

interface Props {
  show: boolean
  onHide: () => void
  onSelect: (conv: ActiveConversation) => void
}

interface UserSearchResult {
  id: number
  full_name: string
  email: string
}

export default function NewDmModal({ show, onHide, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserSearchResult[]>([])
  const [searching, setSearching] = useState(false)

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.trim().length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const res = await axiosClient.get('/user/search', { params: { keyword: q } })
      setResults(res.data.data ?? [])
    } finally {
      setSearching(false)
    }
  }

  function handleClose() {
    setQuery('')
    setResults([])
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6">New Message</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-3">
        <InputGroup size="sm">
          <InputGroup.Text>
            <Search size={12} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => void handleSearch(e.target.value)}
            autoFocus
          />
        </InputGroup>

        {searching && <div className="small text-secondary">Searching…</div>}

        {!searching && query.trim().length >= 2 && results.length === 0 && (
          <div className="small text-secondary text-center py-2">No users found</div>
        )}

        {results.length > 0 && (
          <div className="border rounded overflow-hidden">
            {results.map((u) => (
              <button
                key={u.id}
                type="button"
                className="w-100 d-flex align-items-center gap-2 p-2 border-0 bg-body text-start border-bottom"
                onClick={() => {
                  onSelect({ type: 'dm', userId: u.id })
                  handleClose()
                }}
              >
                <UserAvatar fullName={u.full_name} size={36} />
                <div>
                  <div className="small fw-semibold">{u.full_name}</div>
                  <div className="text-secondary" style={{ fontSize: 11 }}>
                    {u.email}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}
