import React, { useState, useEffect } from 'react';

export const CommunityFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exploratory' | 'followers'>('exploratory');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFeedData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Định tuyến linh hoạt Endpoint dựa trên Tab người dùng đang đứng
        const endpoint = activeTab === 'followers'
          ? `http://127.0.0.1:8000/api/posts/feed/followers?time=${timeFilter}`
          : `http://127.0.0.1:8000/api/posts/feed?time=${timeFilter}`; // Cổng nạp bảng tin chung hệ thống

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        const data = await response.json();
        if (response.ok && data.status) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error("Lỗi đồng bộ dữ liệu bảng tin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [activeTab, timeFilter]); // Tự động nạp lại khi click chuyển tab hoặc chọn mốc thời gian khác

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Khối quản lý điều hướng điều khiển (Tabs & Dropdown) */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-5">
        
        {/* Thanh chuyển đổi Tab dữ liệu */}
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('exploratory')}
            className={`pb-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'exploratory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
            }`}
          >
            Khám phá (Exploratory)
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`pb-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'followers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
            }`}
          >
            Đang theo dõi (Followers)
          </button>
        </div>

        {/* Thanh chọn lọc thời gian hiển thị bài viết */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 font-medium">Lọc:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-md border border-gray-200 p-1.5 text-xs bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>
        </div>
      </div>

      {/* Vùng đổ dữ liệu danh sách bài viết từ CSDL Azure/SQL Server */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-400 animate-pulse">Đang kết nối hệ thống dữ liệu...</div>
      ) : posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                {/* Hiển thị tên sinh viên viết bài dựa trên bảng users thực tế */}
                <span className="font-bold text-sm text-gray-800">@{post.user?.full_name || 'Sinh viên'}</span>
                <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200 p-6 text-gray-400 text-sm">
          Không tìm thấy bài viết nào hiển thị trong mốc thời gian này.
        </div>
      )}
    </div>
  );
};