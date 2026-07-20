"use client";

import { useTransition } from "react";
import { toast } from "react-hot-toast";

interface StatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  action: (id: string, status: string) => Promise<void>;
}

export default function StatusUpdater({ orderId, currentStatus, action }: StatusUpdaterProps) {
  const [isPending, startTransition] = useTransition();

  const statuses = [
    { value: "PENDING", label: "Pending", class: "status-pending" },
    { value: "PROCESSING", label: "Processing", class: "status-processing" },
    { value: "SHIPPED", label: "Shipped", class: "status-shipped" },
    { value: "DELIVERED", label: "Delivered", class: "status-delivered" },
    { value: "CANCELLED", label: "Cancelled", class: "status-cancelled" },
  ];

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      try {
        await action(orderId, newStatus);
        toast.success(`Order status updated to ${newStatus}`);
      } catch (error: any) {
        toast.error(error.message || "Update failed");
      }
    });
  };

  const currentClass = statuses.find(s => s.value === currentStatus)?.class || "bg-light";

  return (
    <div className="status-updater-wrapper d-inline-block">
      <select 
        value={currentStatus} 
        onChange={onChange}
        disabled={isPending}
        className={`form-select form-select-sm fw-bold border-0 ${currentClass} shadow-none`}
        style={{ width: 'auto', minWidth: '120px' }}
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      {isPending && <div className="spinner-border spinner-border-sm ms-2" role="status"></div>}
    </div>
  );
}
