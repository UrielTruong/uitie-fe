import React, { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUsername: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUsername,
}) => {
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Nếu Modal không được gọi mở thì không hiển thị gì cả
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert('Vui lòng chọn phân loại lý do vi phạm!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn hóa nội dung hiển thị tiếng Việt để lưu vào database của Backend
      const reasonLabels: Record<string, string> = {
        spam: 'Spam / Quảng cáo thương mại',
        fraud: 'Thông tin giả mạo / Lừa đảo',
        toxic: 'Ngôn từ không phù hợp / Vi phạm chuẩn mực',
        other: 'Lý do khác'
      };

      const selectedLabel = reasonLabels[reason] || reason;
      const fullReasonText = `[${selectedLabel}] ${description}`.trim();

      // Lấy mã xác thực tài khoản từ trình duyệt (Backend dùng cái này để biết ai gửi)
      const token = localStorage.getItem('token');

      // Thực hiện gửi dữ liệu đến server Backend của nhóm
      const response = await fetch(`http://127.0.0.1:8000/api/user/${targetUserId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          reason: fullReasonText, // Gửi duy nhất trường "reason" như Backend yêu cầu
        }),
      });

      // Đọc kết quả trả về từ Server
      const contentType = response.headers.get("content-type");
      let result: any = {};
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      }

      // Nếu tạo thành công (Mã 201 từ Django)
      if (response.status === 201 || response.ok || result.status === true) {
        alert('Gửi báo cáo thành công! Ban quản trị sẽ xử lý trong thời gian sớm nhất.');
        setReason('');       // Reset ô chọn lý do
        setDescription('');  // Reset ô nhập chữ
        onClose();           // Đóng cửa sổ báo cáo
      } else {
        alert(result.message || 'Có lỗi xảy ra hoặc phiên đăng nhập hết hạn. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Không thể kết nối đến hệ thống Backend. Vui lòng báo các bạn Backend bật Server.');
    } finally {
      setIsSubmitting(false); // Mở khóa các nút bấm
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-fade-in">
        
        {/* Tiêu đề cửa sổ (Header) */}
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-bold text-gray-900">Báo cáo người dùng</h3>
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Thông tin ngữ cảnh */}
        <div className="mb-4 text-sm text-gray-600">
          Bạn đang thực hiện báo cáo tài khoản: <span className="font-semibold text-blue-600">@{targetUsername}</span>
        </div>

        {/* Form nhập dữ liệu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Ô chọn lý do vi phạm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do vi phạm <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none bg-white disabled:bg-gray-50"
              required
            >
              <option value="">-- Chọn lý do --</option>
              <option value="spam">Spam / Quảng cáo thương mại</option>
              <option value="fraud">Thông tin giả mạo / Lừa đảo</option>
              <option value="toxic">Ngôn từ không phù hợp / Vi phạm chuẩn mực</option>
              <option value="other">Lý do khác</option>
            </select>
          </div>

          {/* Ô nhập chi tiết */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chi tiết hành vi vi phạm
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Nhập thêm thông tin mô tả hành vi vi phạm (nếu có)..."
              maxLength={500}
              rows={4}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none resize-none disabled:bg-gray-50"
            />
            {/* Bộ đếm ký tự */}
            <div className="text-right text-xs text-gray-400 mt-1">
              {description.length}/500 ký tự
            </div>
          </div>

          {/* Các nút bấm hành động */}
          <div className="flex justify-end space-x-3 border-t pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-1">
                  {/* Hiệu ứng vòng xoay khi đang xử lý */}
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang gửi...</span>
                </span>
              ) : 'Gửi báo cáo'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};