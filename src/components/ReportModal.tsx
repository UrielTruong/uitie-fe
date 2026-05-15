import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCreateReport } from '#/api/useReport'; // Đảm bảo đường dẫn này khớp với dự án của bạn

interface ReportModalProps {
  postId: number;
  onClose: () => void;
}

export default function ReportModal({ postId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('');
  
  // Sử dụng Hook thực tế thay vì giả lập
  const { mutate: createReport, isPending } = useCreateReport();

  const handleSubmit = () => {
    // 1. Kiểm tra dữ liệu đầu vào
    if (!reason.trim()) {
      return; // Thông báo lỗi đã được xử lý tự động hoặc bạn có thể thêm toast ở đây
    }

    // 2. Gọi API thực tế thông qua Hook
    createReport(
      { 
        post_id: postId, 
        reason: reason 
      },
      {
        onSuccess: () => {
          onClose(); // Chỉ đóng cửa sổ khi API trả về thành công
        },
      }
    );
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> 
          Báo cáo vi phạm
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form.Group>
          <Form.Label className="fw-bold">
            Lý do báo cáo bài viết #{postId}:
          </Form.Label>
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
        <Button 
          variant="secondary" 
          onClick={onClose} 
          disabled={isPending}
        >
          Hủy bỏ
        </Button>
        <Button 
          variant="danger" 
          onClick={handleSubmit} 
          disabled={isPending || !reason.trim()}
        >
          {isPending ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Đang gửi...
            </>
          ) : (
            'Gửi báo cáo'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}