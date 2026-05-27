import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCreateReport } from '#/api/useReport'; 
import { toast } from 'react-hot-toast'; // Thêm import toast nếu chưa có

interface ReportModalProps {
  postId: number;
  onClose: () => void;
}

export default function ReportModal({ postId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const { mutate: createReport, isPending } = useCreateReport();

  // Đổi sang handle bằng Form Event để bắt được phím Enter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      toast.error('Vui lòng nhập lý do báo cáo bài viết!');
      return; 
    }

    // Truyền đúng cấu trúc tham số mới đã sửa ở Hook
    createReport(
      { 
        postId: postId, 
        reason: trimmedReason 
      },
      {
        onSuccess: () => {
          setReason('');
          onClose(); // Chỉ đóng cửa sổ khi API trả về thành công
        },
      }
    );
  };

  return (
    <Modal show={true} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="text-danger fw-bold h5">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> 
          Báo cáo vi phạm
        </Modal.Title>
      </Modal.Header>
      
      {/* Bọc Form bắt sự kiện onSubmit ở đây */}
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="reportReason">
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
              required
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
          {/* Chuyển button sang type="submit" */}
          <Button 
            variant="danger" 
            type="submit" 
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
      </Form>
    </Modal>
  );
}