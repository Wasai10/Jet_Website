import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Layers, RefreshCw, UserPlus, FolderPlus, Search } from "lucide-react";
import { leadershipService, type Leader } from "@/api/leadership.service";
import { departmentService, type Department } from "@/api/department.service";
import jetSwal from "@/lib/swal";
import LeaderTable from "./Components/LeaderTable";
import DepartmentGrid from "./Components/DepartmentGrid";
import LeaderModal from "./Components/LeaderModal";
import DepartmentModal from "./Components/DepartmentModal";

type Tab = "leaders" | "departments";

export default function DepartmentalLeadership() {
  const [activeTab, setActiveTab] = useState<Tab>("leaders");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [leaderModal, setLeaderModal] = useState<Leader | "new" | null>(null);
  const [deptModal, setDeptModal] = useState<Department | "new" | null>(null);

  const fetchAll = async () => {
    try {
      const [l, d] = await Promise.all([
        leadershipService.getAll(),
        departmentService.getAll(),
      ]);
      setLeaders(l);
      setDepartments(d);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => { setLoading(true); void fetchAll(); };

  useEffect(() => { void fetchAll(); }, []);

  // ── Leader handlers ────────────────────────────────────────────────────────
  const handleLeaderSave = async (id: string | null, form: FormData) => {
    if (id === null) {
      await leadershipService.create(form);
    } else {
      await leadershipService.update(id, form);
    }
    setLeaderModal(null);
    await fetchAll();
    jetSwal.fire({
      icon: "success",
      title: id === null ? "Leader Added!" : "Leader Updated!",
      timer: 2200,
      showConfirmButton: false,
    });
  };

  const handleLeaderDelete = async (leader: Leader) => {
    const result = await jetSwal.fire({
      title: "Remove Leader?",
      html: `Are you sure you want to remove <strong>${leader.name}</strong>?<br/><span style="font-size:0.8125rem;opacity:0.45;display:block;margin-top:4px">Departments led by this person must be reassigned first.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
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
      title: "Removing leader…",
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: { popup: "jet-swal-popup", title: "jet-swal-title" },
      didOpen: () => jetSwal.showLoading(),
    });
    try {
      await leadershipService.remove(leader.id);
      setLeaders((prev) => prev.filter((l) => l.id !== leader.id));
      jetSwal.fire({ icon: "success", title: "Removed!", text: `${leader.name} has been removed.`, timer: 2200, showConfirmButton: false });
    } catch (err) {
      jetSwal.fire({ icon: "error", title: "Failed to Remove", text: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  // ── Department handlers ────────────────────────────────────────────────────
  const handleDeptSave = async (id: string | null, form: FormData) => {
    if (id === null) {
      await departmentService.create(form);
    } else {
      await departmentService.update(id, form);
    }
    setDeptModal(null);
    await fetchAll();
    jetSwal.fire({
      icon: "success",
      title: id === null ? "Ministry Created!" : "Ministry Updated!",
      timer: 2200,
      showConfirmButton: false,
    });
  };

  const handleDeptDelete = async (dept: Department) => {
    const result = await jetSwal.fire({
      title: "Remove Ministry?",
      html: `Are you sure you want to remove <strong>${dept.name}</strong>?<br/><span style="font-size:0.8125rem;opacity:0.45;display:block;margin-top:4px">This action cannot be undone.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
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
      title: "Removing ministry…",
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: { popup: "jet-swal-popup", title: "jet-swal-title" },
      didOpen: () => jetSwal.showLoading(),
    });
    try {
      await departmentService.remove(dept.id);
      setDepartments((prev) => prev.filter((d) => d.id !== dept.id));
      jetSwal.fire({ icon: "success", title: "Removed!", text: `${dept.name} has been removed.`, timer: 2200, showConfirmButton: false });
    } catch (err) {
      jetSwal.fire({ icon: "error", title: "Failed to Remove", text: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filteredLeaders = leaders.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.role.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.leader.name.toLowerCase().includes(search.toLowerCase())
  );

  const editLeader = leaderModal === "new" || leaderModal === null ? null : leaderModal;
  const editDept = deptModal === "new" || deptModal === null ? null : deptModal;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">Departmental Leadership</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {leaders.length} leaders · {departments.length} ministries
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5 w-52">
            <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === "leaders" ? "Search leaders…" : "Search ministries…"}
              className="bg-transparent text-sm text-foreground placeholder-muted-foreground/40 outline-none w-full"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={refresh}
            title="Refresh"
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* Context-sensitive add button */}
          {activeTab === "leaders" ? (
            <button
              onClick={() => setLeaderModal("new")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.25)] cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Leader</span>
            </button>
          ) : (
            <button
              onClick={() => setDeptModal("new")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.25)] cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Add Ministry</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Tab switcher */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-1 bg-card border border-border rounded-2xl p-1 w-fit"
      >
        {[
          { key: "leaders" as Tab, label: "Leaders", icon: Users, count: leaders.length },
          { key: "departments" as Tab, label: "Ministries", icon: Layers, count: departments.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setSearch(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === key
                ? "bg-[#0096FF] text-white shadow-[0_0_12px_rgba(0,150,255,0.25)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === key ? "bg-white/20 text-white" : "bg-muted text-muted-foreground/60"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-[#0096FF]/15 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-[#0096FF] rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground/60 text-sm">Loading…</p>
          </div>
        ) : activeTab === "leaders" ? (
          <LeaderTable
            leaders={filteredLeaders}
            onEdit={(l) => setLeaderModal(l)}
            onDelete={handleLeaderDelete}
          />
        ) : (
          <DepartmentGrid
            departments={filteredDepts}
            onEdit={(d) => setDeptModal(d)}
            onDelete={handleDeptDelete}
          />
        )}

        {!loading && (
          <div className="px-4 py-3 border-t border-border">
            <p className="text-muted-foreground/60 text-xs">
              {activeTab === "leaders"
                ? `Showing ${filteredLeaders.length} of ${leaders.length} leaders`
                : `Showing ${filteredDepts.length} of ${departments.length} ministries`}
            </p>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <LeaderModal
        open={leaderModal !== null}
        leader={editLeader}
        onClose={() => setLeaderModal(null)}
        onSave={handleLeaderSave}
      />

      <DepartmentModal
        open={deptModal !== null}
        department={editDept}
        leaders={leaders}
        onClose={() => setDeptModal(null)}
        onSave={handleDeptSave}
      />
    </div>
  );
}
