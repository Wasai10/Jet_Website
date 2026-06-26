import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, UserPlus } from "lucide-react";
import {
  authService,
  type User,
  type UpdateUserPayload,
  type CreateUserAdminPayload,
} from "@/api/auth.service";
import { useAuth } from "@/context/AuthContext";
import jetSwal from "@/lib/swal";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";

type ModalTarget = User | "new" | null;

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalTarget, setModalTarget] = useState<ModalTarget>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      setUsers(await authService.getAllUsers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleModalSave = async (
    id: string | null,
    payload: UpdateUserPayload | CreateUserAdminPayload
  ) => {
    if (id === null) {
      await authService.createUserAdmin(payload as CreateUserAdminPayload);
    } else {
      await authService.updateUser(id, payload as UpdateUserPayload);
    }
    setModalTarget(null);
    await fetchUsers();
    jetSwal.fire({
      icon: "success",
      title: id === null ? "User Created!" : "User Updated!",
      text: id === null
        ? "The new user has been added successfully."
        : "User details have been updated.",
      timer: 2200,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (user: User) => {
    const result = await jetSwal.fire({
      title: "Delete User?",
      html: `Are you sure you want to remove <strong>${user.fullName}</strong>?<br/><span style="font-size:0.8125rem;opacity:0.45;display:block;margin-top:4px">This action cannot be undone.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "jet-swal-popup",
        title: "jet-swal-title",
        htmlContainer: "jet-swal-content",
        confirmButton: "jet-swal-confirm jet-swal-danger",
        cancelButton: "jet-swal-cancel",
      },
    });

    if (!result.isConfirmed) return;

    jetSwal.fire({
      title: "Deleting user…",
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: {
        popup: "jet-swal-popup",
        title: "jet-swal-title",
      },
      didOpen: () => jetSwal.showLoading(),
    });

    try {
      await authService.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      jetSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: `${user.fullName} has been removed from the system.`,
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      jetSwal.fire({
        icon: "error",
        title: "Failed to Delete",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const editUser = modalTarget === "new" || modalTarget === null ? null : modalTarget;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-white">All Users</h2>
          <p className="text-white/40 text-sm mt-0.5">{users.length} total members</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 w-52">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={fetchUsers}
            title="Refresh"
            className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* Add User */}
          <button
            onClick={() => setModalTarget("new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.25)] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-2xl overflow-hidden"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-[#0096FF]/15 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-[#0096FF] rounded-full animate-spin" />
            </div>
            <p className="text-white/30 text-sm">Loading users…</p>
          </div>
        ) : (
          <UserTable
            users={filtered}
            currentUserId={currentUser?.id ?? ""}
            onEdit={(u) => setModalTarget(u)}
            onDelete={handleDelete}
          />
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-white/[0.06]">
            <p className="text-white/30 text-xs">
              Showing {filtered.length} of {users.length} users
            </p>
          </div>
        )}
      </motion.div>

      {/* Create / Edit modal */}
      <UserModal
        open={modalTarget !== null}
        user={editUser}
        currentUserRole={currentUser?.role ?? "USER"}
        onClose={() => setModalTarget(null)}
        onSave={handleModalSave}
      />
    </div>
  );
}
