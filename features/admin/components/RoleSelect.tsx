"use client";

import { useTransition } from "react";
import { toast } from "react-hot-toast";

interface RoleSelectProps {
  userId: string;
  currentRole: string;
  action: (id: string, role: string) => Promise<void>;
}

export default function RoleSelect({ userId, currentRole, action }: RoleSelectProps) {
  const [isPending, startTransition] = useTransition();

  const roles = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "ADMIN", label: "Admin" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
  ];

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    startTransition(async () => {
      try {
        await action(userId, newRole);
        toast.success(`Role updated to ${newRole}`);
      } catch (error: any) {
        toast.error(error.message || "Role update failed");
      }
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch(role) {
      case "SUPER_ADMIN": return "bg-danger text-white";
      case "ADMIN": return "bg-primary text-white";
      default: return "bg-light text-dark border";
    }
  };

  return (
    <div className="d-inline-block">
      <select 
        value={currentRole} 
        onChange={onChange}
        disabled={isPending}
        className={`form-select form-select-sm fw-bold ${getRoleBadgeClass(currentRole)} shadow-none`}
        style={{ width: 'auto', minWidth: '120px' }}
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value} className="bg-white text-dark">
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
