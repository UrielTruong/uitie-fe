import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  Spinner,
  Table,
  Badge,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { exportUsersPdf, useGetUserList } from '#/api/useAdmin'
import { FileDown, Pencil, Plus, Search, Trash } from 'lucide-react'
import React, { useState } from 'react'
import UserModal from '#/components/admin/UserModal'
import type { User, UserRole, UserStatus } from '#/types/user'
import ConfirmDeleteUserModal from '#/components/admin/ConfirmDeleteUser'

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading, isError } = useGetUserList(searchQuery)
  const users = data?.data ?? []

  const ROLE_VARIANT: Record<UserRole, string> = {
    'Super Admin': 'danger',
    Admin: 'warning',
    Student: 'secondary',
  }

  const STATUS_VARIANT: Record<UserStatus, string> = {
    Active: 'success',
    Inactive: 'secondary',
    Locked: 'secondary',
  }

  const [userModalVisible, setUserModalVisible] = useState(false)
  const [confirmDeleteUserModal, setConfirmDeleteUserModal] = useState<
    string | undefined
  >(undefined)

  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [isExporting, setIsExporting] = useState(false)

  const handleOpenAddUserModal = () => {
    setUserModalVisible(true)
  }

  const handleOpenEditUserModal = (user: User) => {
    setEditingUser(user)
    setUserModalVisible(true)
  }

  const handleCloseUserModal = () => {
    setUserModalVisible(false)
    setEditingUser(null)
  }

  const handleOpenConfirmDeleteUser = (user: User) => {
    setConfirmDeleteUserModal(user.id)
  }

  const handleCloseConfirmDeleteUser = () => {
    setConfirmDeleteUserModal(undefined)
  }

  const handleExportPdf = async () => {
    setIsExporting(true)
    try {
      await exportUsersPdf()
    } finally {
      setIsExporting(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(search)
  }

  return (
    <div className="container py-4 px-3" style={{ maxWidth: '1100px' }}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-1">{t('admin_users_title')}</h4>
          <p className="text-secondary mb-4">{t('admin_users_subtitle')}</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-danger"
            className="d-flex align-items-center gap-2"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            <FileDown size={18} />
            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          </Button>

          <Button
            className="d-flex align-items-center gap-2"
            onClick={handleOpenAddUserModal}
          >
            <Plus size={18} />
            <p>{t('admin_users_add_user')}</p>
          </Button>
        </div>
      </div>

      <Form onSubmit={handleSearch} className="mb-3">
        {/* <InputGroup style={{ maxWidth: '360px' }}>
          <Form.Control
            placeholder="Tìm kiếm người dùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline-secondary" type="submit">
            <Search size={16} />
          </Button>
        </InputGroup> */}
      </Form>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : isError ? (
            <div className="p-4 text-danger">{t('error_generic')}</div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-body-tertiary">
                <tr>
                  <th className="px-4 py-3">{t('admin_users_col_name')}</th>
                  <th className="py-3">{t('admin_users_col_email')}</th>
                  <th className="py-3">{t('admin_users_col_role')}</th>
                  <th className="py-3">{t('admin_users_col_status')}</th>
                  <th className="py-3">{t('admin_users_col_action')}</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-secondary py-4">
                      {t('admin_users_empty')}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4">{u.full_name ?? '—'}</td>
                      <td>{u.email}</td>
                      <td>
                        <Badge
                          bg={ROLE_VARIANT[u.role as UserRole] ?? 'secondary'}
                        >
                          {u.role ?? 'Student'}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={
                            STATUS_VARIANT[u.status as UserStatus] ??
                            'secondary'
                          }
                        >
                          {u.status ?? 'Active'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          className="text-decoration-none p-2 rounded-3 text-secondary"
                          onClick={() => handleOpenEditUserModal(u as User)}
                        >
                          <Pencil size={18} />
                        </Button>
                        {/* <Button
                          variant="link"
                          className="text-decoration-none p-2 rounded-3 text-secondary"
                          onClick={() => handleOpenConfirmDeleteUser(u as User)}
                        >
                          <Trash size={18} />
                        </Button> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <UserModal
        visible={userModalVisible}
        onClose={handleCloseUserModal}
        user={editingUser ?? undefined}
      />

      <ConfirmDeleteUserModal
        visible={!!confirmDeleteUserModal}
        onClose={handleCloseConfirmDeleteUser}
        userId={confirmDeleteUserModal}
      />
    </div>
  )
}
