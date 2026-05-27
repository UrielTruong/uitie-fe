import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCreateUserReport } from '#/api/useReport'; 
import { toast } from 'react-hot-toast';

interface ReportUserModalProps {
  userId: number | string; // ID của tài khoản bị báo cáo
  userName?: string;       // Tên hiển thị (nếu có) để hiện lên cho thân thiện
  onClose: () => void;
}

export default function ReportUserModal({ userId, userName, onClose }: ReportUserModalProps) {
  const [reason, setReason] = useState('');
  
  // Sử dụng Hook Mutation dành riêng cho User
  const { mutate: createUserReport, isPending } = useCreateUserReport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      toast.error('Vui lòng nhập lý do báo cáo tài khoản này!');
      return; 
    }

    // Gửi tham số lên API thực tế
    createUserReport(
      { 
        userId: userId, 
        reason: trimmedReason 
      },
      {
        onSuccess: () => {
          setReason('');
          onClose(); // Chỉ đóng cửa sổ khi thành công
        },
      }
    );
  };

  return (
    <Modal show={true} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="text-danger fw-bold h5">
          <i className="fa-solid fa-user-slash me-2"></i> 
          Báo cáo tài khoản vi phạm
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="reportUserReason">
            <Form.Label className="fw-bold text-dark">
              Bạn đang báo cáo tài khoản: <span className="text-primary">{userName || `#${userId}`}</span>
            </Form.Label>
            <p className="small text-secondary mb-3">
              Vui lòng cung cấp lý do chi tiết (ví dụ: giả mạo, quấy rối, lừa đảo...) để Admin có cơ sở xử lý:
            </p>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Nhập lý do báo cáo tại đây..."
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
            variant="light" 
            onClick={onClose} 
            disabled={isPending}
          >
            Hủy bỏ
          </Button>
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
              'Gửi báo cáo User'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}