import React, { useState } from 'react';

interface FollowButtonProps {
  targetUserId: number;
  initialIsFollowing: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId, initialIsFollowing }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(initialIsFollowing);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Gọi chính xác đến cổng API Laravel bảo mật Sanctum của nhóm
      const response = await fetch(`http://127.0.0.1:8000/api/user/${targetUserId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await response.json();
      if (response.ok && data.status) {
        setIsFollowing(data.is_following);
      }
    } catch (error) {
      console.error("Lỗi kết nối API Follow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
        isFollowing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {loading ? '...' : isFollowing ? '✓ Đang theo dõi' : '+ Theo dõi'}
    </button>
  );
};