import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCreateReport } from '#/api/useReport'; // Hook gọi API báo cáo bài viết của thành viên khác

// ==========================================
// 1. COMPONENT CỦA BẠN: BÁO CÁO NGƯỜI DÙNG (USER REPORT)
// ==========================================
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert('Vui lòng chọn phân loại lý do vi phạm!');
      return;
    }

    setIsSubmitting(true);

    try {
      const reasonLabels: Record<string, string> = {
        spam: 'Spam / Quảng cáo thương mại',
        fraud: 'Thông tin giả mạo / Lừa đảo',
        toxic: 'Ngôn từ không phù hợp / Vi phạm chuẩn mực',
        other: 'Lý do khác'
      };

      const selectedLabel = reasonLabels[reason] || reason;
      const fullReasonText = `[${selectedLabel}] ${description}`.trim();
      const token = localStorage.getItem('token');

      const response = await fetch(`http://127.0.0.1:8000/api/user/${targetUserId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          reason: fullReasonText,
        }),
      });

      const contentType = response.headers.get("content-type");
      let result: any = {};
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      }

      if (response.status === 201 || response.ok || result.status === true) {
        alert('Gửi báo cáo người dùng thành công!');
        setReason('');
        setDescription('');
        onClose(); 
      } else {
        alert(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Không thể kết nối đến hệ thống Backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl to-gray-900">
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-bold text-gray-900">Báo cáo người dùng</h3>
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Bạn đang thực hiện báo cáo tài khoản: <span className="font-semibold text-blue-600">@{targetUsername}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do vi phạm <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
              required
            >
              <option value="">-- Chọn lý do --</option>
              <option value="spam">Spam / Quảng cáo thương mại</option>
              <option value="fraud">Thông tin giả mạo / Lừa đảo</option>
              <option value="toxic">Ngôn từ không phù hợp / Vi phạm chuẩn mực</option>
              <option value="other">Lý do khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chi tiết hành vi vi phạm
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Nhập thêm thông tin mô tả hành vi vi phạm..."
              maxLength={500}
              rows={4}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {description.length}/500 ký tự
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 flex items-center justify-center min-w-[100px]"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. COMPONENT CỦA ĐỒNG ĐỘI: BÁO CÁO BÀI VIẾT (POST REPORT)
// ==========================================
interface ReportPostModalProps {
  postId: number;
  onClose: () => void;
}

export default function ReportPostModal({ postId, onClose }: ReportPostModalProps) {
  const [reason, setReason] = useState('');
  const { mutate: createReport, isPending } = useCreateReport();

  const handleSubmit = () => {
    if (!reason.trim()) return;

    createReport(
      { post_id: postId, reason: reason },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> Báo cáo vi phạm bài viết
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label className="fw-bold">Lý do báo cáo bài viết #{postId}:</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Ví dụ: Nội dung lừa đảo, xúc phạm, spam, sai sự thật..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            autoFocus
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isPending}>Hủy bỏ</Button>
        <Button variant="danger" onClick={handleSubmit} disabled={isPending || !reason.trim()}>
          {isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}