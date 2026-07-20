"use client";

import { useTransition } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
  confirmMessage?: string;
}

export default function DeleteButton({ id, action, confirmMessage = "Are you sure you want to delete this?" }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (window.confirm(confirmMessage)) {
      startTransition(async () => {
        try {
          await action(id);
          toast.success("Deleted successfully");
        } catch (error: any) {
          toast.error(error.message || "Failed to delete");
        }
      });
    }
  };

  return (
    <button 
      onClick={onDelete}
      disabled={isPending}
      className="btn btn-sm btn-outline-danger" 
      title="Delete"
    >
      {isPending ? <span className="spinner-border spinner-border-sm"></span> : <FaTrash size={12} />}
    </button>
  );
}
