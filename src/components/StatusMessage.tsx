import type { RequestStatus } from '../types/api';

interface StatusMessageProps {
  status: RequestStatus;
  message: string;
  onRetry?: () => void;
}

export function StatusMessage({ status, message, onRetry }: StatusMessageProps) {
  return (
    <div className={`status status--${status}`} role={status === 'error' ? 'alert' : 'status'}>
      <p>{message}</p>
      {status === 'error' && onRetry && (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Volver a intentar
        </button>
      )}
    </div>
  );
}
