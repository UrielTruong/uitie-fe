import React from 'react'

type Props = {
  fullName: string
}

const UserAvatar = ({ fullName }: Props) => {
  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center bg-body-secondary flex-shrink-0"
      style={{ width: '40px', height: '40px' }}
    >
      <span className="text-secondary small">
        {fullName?.charAt(0).toUpperCase() ?? '?'}
      </span>
    </div>
  )
}

export default UserAvatar
