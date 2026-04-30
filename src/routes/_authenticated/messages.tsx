import { Card, Form, InputGroup, Badge, Button } from 'react-bootstrap'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  Image as ImageIcon,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
} from 'lucide-react'
import {
  FAKE_CONVERSATIONS,
  FAKE_MESSAGES,
  PROFILES,
} from '#/lib/fake-api'
import type { ChatMessage } from '#/lib/fake-api'

export const Route = createFileRoute('/_authenticated/messages')({
  component: MessagesPage,
})

function MessagesPage() {
  const [activeId, setActiveId] = useState(FAKE_CONVERSATIONS[0].id)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(
    FAKE_MESSAGES,
  )

  const active = FAKE_CONVERSATIONS.find((c) => c.id === activeId)!
  const activeUser = PROFILES[active.userId]
  const messages = threads[activeId] ?? []

  const conversations = useMemo(
    () =>
      FAKE_CONVERSATIONS.filter(
        (c) =>
          !search ||
          PROFILES[c.userId]?.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  )

  function send() {
    const text = draft.trim()
    if (!text) return
    const now = new Date()
    const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setThreads((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), { from: 'me', text, time: hm }],
    }))
    setDraft('')
    setTimeout(() => {
      setThreads((prev) => ({
        ...prev,
        [activeId]: [
          ...(prev[activeId] ?? []),
          { from: active.userId, text: 'Đã nhận được tin nhắn của bạn 👍', time: hm },
        ],
      }))
    }, 1200)
  }

  return (
    <div className="container-fluid p-3" style={{ height: 'calc(100vh - 56px)' }}>
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
        <div className="d-flex h-100">
          {/* Conversation list */}
          <aside
            className="border-end d-flex flex-column flex-shrink-0"
            style={{ width: 320 }}
          >
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Tin nhắn</h5>
                <Button
                  size="sm"
                  variant="light"
                  className="border d-flex align-items-center justify-content-center"
                  style={{ width: 32, height: 32 }}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <InputGroup>
                <InputGroup.Text className="bg-body-secondary border-0">
                  <Search size={14} />
                </InputGroup.Text>
                <Form.Control
                  size="sm"
                  placeholder="Tìm cuộc trò chuyện…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-body-secondary border-0"
                />
              </InputGroup>
            </div>

            <div className="overflow-y-auto flex-grow-1">
              {conversations.map((c) => {
                const u = PROFILES[c.userId]
                const isActive = c.id === activeId
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`w-100 d-flex align-items-center gap-2 p-3 border-bottom border-0 text-start ${isActive ? 'bg-primary-subtle' : 'bg-body'}`}
                    style={{
                      borderLeft: isActive
                        ? '3px solid var(--bs-warning)'
                        : '3px solid transparent',
                    }}
                  >
                    <div className="position-relative flex-shrink-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        width={44}
                        height={44}
                        className="rounded-circle border bg-body-secondary"
                      />
                      {c.online && (
                        <span
                          className="position-absolute bottom-0 end-0 rounded-circle border border-2 border-white bg-success"
                          style={{ width: 12, height: 12 }}
                        />
                      )}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-baseline">
                        <span className="fw-bold text-truncate">{u.name}</span>
                        <span className="small text-secondary ms-2 flex-shrink-0">
                          {c.time}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`small text-truncate flex-grow-1 ${c.unread ? 'fw-semibold text-body' : 'text-secondary'}`}
                        >
                          {c.lastMsg}
                        </span>
                        {c.unread > 0 && (
                          <Badge bg="warning" text="dark" pill>
                            {c.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Chat */}
          <section className="d-flex flex-column flex-grow-1 min-w-0 bg-body-tertiary">
            <header className="d-flex align-items-center gap-3 p-3 border-bottom bg-body">
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                width={40}
                height={40}
                className="rounded-circle border"
              />
              <div className="flex-grow-1">
                <div className="fw-bold">{activeUser.name}</div>
                <div className="small text-secondary d-flex align-items-center gap-1">
                  <span
                    className={`rounded-circle ${active.online ? 'bg-success' : 'bg-secondary'}`}
                    style={{ width: 7, height: 7, display: 'inline-block' }}
                  />
                  {active.online ? 'Đang hoạt động' : 'Không trực tuyến'}
                </div>
              </div>
              <Button variant="light" size="sm" className="border">
                <Search size={16} />
              </Button>
              <Button variant="light" size="sm" className="border">
                <MoreHorizontal size={16} />
              </Button>
            </header>

            <div className="flex-grow-1 overflow-y-auto p-3 d-flex flex-column gap-2">
              <div className="text-center small text-secondary py-2">Hôm nay</div>
              {messages.map((m, i) => {
                const mine = m.from === 'me'
                const prev = messages[i - 1]
                const showAvatar = !mine && (!prev || prev.from !== m.from)
                const fromUser = PROFILES[m.from]
                return (
                  <div
                    key={i}
                    className={`d-flex align-items-end gap-2 ${mine ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    {!mine && (
                      <div style={{ width: 28, flexShrink: 0 }}>
                        {showAvatar && fromUser && (
                          <img
                            src={fromUser.avatar}
                            alt={fromUser.name}
                            width={28}
                            height={28}
                            className="rounded-circle"
                          />
                        )}
                      </div>
                    )}
                    <div style={{ maxWidth: '70%' }}>
                      <div
                        className={`px-3 py-2 shadow-sm ${mine ? 'bg-primary text-white' : 'bg-body border'}`}
                        style={{
                          borderRadius: mine
                            ? '16px 16px 4px 16px'
                            : '16px 16px 16px 4px',
                          fontSize: 14,
                        }}
                      >
                        {m.attachment ? (
                          <div className="d-flex align-items-center gap-2">
                            <Badge
                              bg={mine ? 'light' : 'danger-subtle'}
                              text={mine ? 'primary' : 'danger-emphasis'}
                              className="fw-bold"
                            >
                              PDF
                            </Badge>
                            <div>
                              <div className="fw-semibold">{m.attachment.name}</div>
                              <div className="small opacity-75">
                                {m.attachment.size}
                              </div>
                            </div>
                          </div>
                        ) : (
                          m.text
                        )}
                      </div>
                      <div
                        className={`small text-secondary mt-1 ${mine ? 'text-end' : ''}`}
                      >
                        {m.time}
                        {mine && <span className="text-primary"> · Đã xem</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
              {messages.length === 0 && (
                <div className="text-center text-secondary py-5">
                  Bắt đầu cuộc trò chuyện với {activeUser.name}
                </div>
              )}
            </div>

            <div className="p-3 border-top bg-body">
              <InputGroup className="rounded-pill border bg-body-secondary px-2">
                <Button variant="link" className="text-secondary px-2">
                  <Paperclip size={18} />
                </Button>
                <Button variant="link" className="text-secondary px-2">
                  <ImageIcon size={18} />
                </Button>
                <Form.Control
                  placeholder="Nhập tin nhắn…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  className="border-0 bg-transparent shadow-none"
                />
                <Button
                  variant={draft.trim() ? 'primary' : 'secondary'}
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 36, height: 36 }}
                  disabled={!draft.trim()}
                  onClick={send}
                >
                  <Send size={16} />
                </Button>
              </InputGroup>
            </div>
          </section>
        </div>
      </Card>
    </div>
  )
}
