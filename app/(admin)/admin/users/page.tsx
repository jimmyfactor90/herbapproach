import { AdminService } from "@/features/admin/services/admin.service";
import { format } from "date-fns";
import { FaUserShield, FaUserEdit, FaTrash, FaPlus, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { updateUserRoleAction, deleteUserAction } from "@/features/admin/actions/user.actions";
import DeleteButton from "@/features/admin/components/DeleteButton";
import RoleSelect from "@/features/admin/components/RoleSelect";

export default async function AdminUsersPage() {
  const adminService = new AdminService();
  const users = await adminService.getAllUsers();

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">User Management</h2>
          <p className="text-muted small">Manage roles and permissions for all registered users</p>
        </div>
        <button className="btn btn-plant d-flex align-items-center gap-2" disabled>
          <FaPlus /> Add New User
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted">User</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Email</th>
                <th className="py-3 border-0 small text-uppercase text-muted text-center">Role</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Joined Date</th>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 border-0">
                    <div className="d-flex align-items-center gap-3">
                      {user.image ? (
                        <img src={user.image} className="rounded-circle border" style={{ width: '40px', height: '40px', objectFit: 'cover' }} alt={user.name} />
                      ) : (
                        <div className="bg-light rounded-circle border d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: '40px', height: '40px' }}>
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h6 className="mb-0 fw-bold">{user.name}</h6>
                        <span className="text-muted extra-small">ID: {user.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 border-0 small">
                    <div className="d-flex align-items-center gap-2">
                       <FaEnvelope className="text-muted" /> {user.email}
                    </div>
                  </td>
                  <td className="py-3 border-0 text-center">
                    <RoleSelect 
                       userId={user.id} 
                       currentRole={user.role} 
                       action={updateUserRoleAction} 
                    />
                  </td>
                  <td className="py-3 border-0 small text-muted">
                    <div className="d-flex align-items-center gap-2">
                       <FaCalendarAlt /> {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-0 text-end">
                    <div className="d-flex justify-content-end gap-2">
                       <DeleteButton id={user.id} action={deleteUserAction} confirmMessage="Permanently delete this user?" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
