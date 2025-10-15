import React, { useEffect, useState } from "react";
import Sidebar from "../sub-components/sidebar";
import { toast } from "react-toastify";
import { escapeMinimal } from "../sub-components/sanitize";
import { getCsrfToken } from "../sub-components/csrfToken.tsx";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import type { User } from "../types/usersFTypes.tsx";
import { escapeHTML } from "../sub-components/sanitize.tsx";


import {
  Plus,
  Trash,
  X
} from "lucide-react";

interface Milestone {
  milestone_id?: number;
  milestone_name: string;
  milestone_completed?: boolean;
  milestone_due_date?: string | null;
}

interface ProjectsProps {
  user?: User | null;
}

interface Project {
  project_id: number;
  project_name: string;
  project_status: string;
  progress_percentage: number;
  project_due_date?: string | null;
  milestones: Milestone[];
}

const emptyNewProject = (): { project_name: string; status: string; due_date: string; milestones: Milestone[] } => ({
  project_name: "",
  status: "pending",
  due_date: "",
  milestones: [],
});

// Helper function to format ISO date to yyyy-MM-dd
const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return "";
  }
};

// Helper function to format date for display
const formatDateForDisplay = (dateString: string | null | undefined): string => {
  if (!dateString) return "No due date";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return "Invalid date";
  }
};



/* -------------------------------------------------------------------------- */
/*                              DELETE TASK MODAL                             */
/* -------------------------------------------------------------------------- */
const DeleteTaskModal: React.FC<{
  showDeleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmDelete: () => Promise<void>;
  isLoading: boolean;
}> = ({ showDeleteModal, setDeleteModal, handleConfirmDelete, isLoading }) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
          <button
            onClick={() => setDeleteModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this Project? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteModal(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800  rounded-sm hover:bg-gray-400 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-sm hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Skeleton Project Card Component
const SkeletonProjectCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex flex-col justify-between animate-pulse">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
          <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3 mt-1"></div>
        </div>

        {/* Milestones */}
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
};

//MAIN FUNCTION----
const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState(emptyNewProject());
  const [removedMilestoneIds, setRemovedMilestoneIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    setTimeout(async () => {


      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.append("status", statusFilter);
        if (dateFilter) params.append("date", dateFilter);

        const response = await fetch(`${apiUrl}/api/users/projects?${params.toString()}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!data.success) {
          toast.error(data.error || "Failed to load projects.");
          setProjects([]);
          return;
        }

        const grouped: Record<number, Project> = {};

        (data.projects || data.projectRows || []).forEach((row: Project & { [key: string]: unknown }) => {
          const pid = Number(row.project_id);

          if (!grouped[pid]) {
            grouped[pid] = {
              project_id: pid,
              project_name: row.project_name || row.project_name,
              project_status: typeof row.project_status === "string"
                ? row.project_status
                : typeof row.status === "string"
                  ? row.status
                  : "pending",
              progress_percentage: Number(row.progress_percentage || 0),
              project_due_date: typeof row.project_due_date === "string"
                ? row.project_due_date
                : typeof row.due_date === "string"
                  ? row.due_date
                  : null,
              milestones: [],
            };
          }

          if (row.milestone_id) {
            grouped[pid].milestones.push({
              milestone_id: typeof row.milestone_id === "number" ? row.milestone_id : Number(row.milestone_id),
              milestone_name: typeof row.milestone_name === "string" ? row.milestone_name : "",
              milestone_completed: !!row.milestone_completed,
              milestone_due_date: typeof row.milestone_due_date === "string"
                ? row.milestone_due_date
                : typeof row.due_date === "string"
                  ? row.due_date
                  : null,
            });
          }
        });

        setProjects(Object.values(grouped));
      } catch (err) {
        console.error(err);
        toast.error("Error fetching projects.");
        setProjects([]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }, 1000);
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFilter]);

  // Create project
  const createProject = async () => {
    if (!newProject.project_name.trim()) {
      toast.error("Project name is required.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/users/createProject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": await getCsrfToken() },
        body: JSON.stringify({
          project_name: newProject.project_name,
          status: newProject.status,
          due_date: newProject.due_date || null,
          milestones: newProject.milestones.map((m) => ({
            milestone_name: m.milestone_name,
            completed: m.milestone_completed || false,
            due_date: m.milestone_due_date || null,
          })),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setShowCreateModal(false);
        toast.error(data.error || "Failed to create project.");
        return;
      }

      toast.success("Project created");
      setShowCreateModal(false);
      setNewProject(emptyNewProject());
      await fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Error creating project.");
    }
  };

  const openEditModal = (p: Project) => {
    setEditingProject(JSON.parse(JSON.stringify(p)));
    setRemovedMilestoneIds([]);
    setShowEditModal(true);
  };

  const openViewModal = (p: Project) => {
    setViewingProject(p);
    setShowViewModal(true);
  };

  const showDeleteProjectModal = (p: number) => {
    setShowEditModal(false);
    setDeleteModal(true);

    setProjectId(p);
  }



  const handleDeleteTask = async () => {

    if (!projectId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/users/deleteProject`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": await getCsrfToken(),
        },
        credentials: "include",
        body: JSON.stringify({ project_id: escapeHTML(String(projectId)) }),
      });

      let msg;
      const data2 = await res.json();

      if (data2.success === false && data2.error) {

        setProjectId(null);
        msg = data2.error;
        toast.error(msg || "Failed to Project task.");

        return
      }

      if (!res.ok) {

        setProjectId(null);
        toast.error("Failed to delete project.");
        return
      }

      toast.success("Project deleted");
      await fetchProjects();
    } catch (error) {

      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
      setDeleteModal(false);
    }
  }




  const updateProject = async () => {
    if (!editingProject) return;

    try {
      const res = await fetch(`${apiUrl}/api/users/updateProject`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": await getCsrfToken() },
        body: JSON.stringify({
          project_id: editingProject.project_id,
          project_name: editingProject.project_name,
          status: editingProject.project_status,
          due_date: editingProject.project_due_date || null,
          milestones: editingProject.milestones.map((m) => ({
            milestone_id: m.milestone_id || undefined,
            milestone_name: m.milestone_name,
            completed: m.milestone_completed || false,
            due_date: m.milestone_due_date || null,
          })),
          removed_milestone_ids: removedMilestoneIds,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to update project.");
        return;
      }

      toast.success("Project updated");
      setShowEditModal(false);
      setEditingProject(null);
      setRemovedMilestoneIds([]);
      await fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Error updating project.");
    }
  };

  const addNewMilestone = () => {
    setNewProject((prev) => ({ ...prev, milestones: [...prev.milestones, { milestone_name: "", milestone_completed: false, milestone_due_date: "" }] }));
  };

  const removeNewMilestone = (i: number) => {
    setNewProject((prev) => ({ ...prev, milestones: prev.milestones.filter((_, idx) => idx !== i) }));
  };

  const addEditMilestone = () => {
    if (!editingProject) return;
    setEditingProject({ ...editingProject, milestones: [...editingProject.milestones, { milestone_name: "", milestone_completed: false, milestone_due_date: "" }] });
  };

  const removeEditMilestone = (i: number) => {
    if (!editingProject) return;
    const milestone = editingProject.milestones[i];
    if (milestone.milestone_id) {
      setRemovedMilestoneIds((prev) => [...prev, milestone.milestone_id!]);
    }
    setEditingProject({ ...editingProject, milestones: editingProject.milestones.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
      <Sidebar user={user} />
      <main className="p-8  sm:mb-8 mt-15  content-area flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className=" text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-500 mt-1 mb-1 text-sm sm:text-base">Manage your projects, track progress, and collaborate with your team.</p>
          </header>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-8 pr-4 py-2 w-full sm:w-auto bg-white border outline-0 border-gray-300 rounded-lg text-gray-700 focus:ring-primary focus:border-primary text-sm sm:text-base"
                >
                  <option value="all">Status: All</option>
                  <option value="on_track">On Track</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-8 pr-4 py-2 w-full sm:w-auto bg-white border outline-0 border-gray-300 rounded-lg text-gray-700 focus:ring-primary focus:border-primary text-sm sm:text-base"
                />
              </div>
            </div>

            {/* New Project Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className=" flex items-center justify-center cursor-pointer rounded-sm bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              <span>Create Project</span>
            </button>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {loading ? (
              // Display skeleton cards while loading
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonProjectCard key={index} />
              ))
            ) : projects.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6M3 7h18" />
                </svg>
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-800">No projects created yet</h4>
                  <p className="text-sm text-gray-500">Create your first project to track milestones and progress.</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">Create Project</button>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.project_id}
                  className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">{escapeMinimal(project.project_name)}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 capitalize">{project.project_status.replace("_", " ")}</span>
                        <button onClick={() => openEditModal(project)} className="text-sm text-primary hover:underline cursor-pointer">Edit</button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${project.progress_percentage}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{project.progress_percentage}% complete</p>
                    </div>

                    {/* Milestones */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Milestones</p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {project.milestones.length === 0 ? (
                          <li className="text-gray-500">No milestones</li>
                        ) : (
                          project.milestones.slice(0, 3).map((m) => (
                            <li key={m.milestone_id || m.milestone_name} className="flex items-center gap-2">
                              <svg
                                className={`h-4 w-4 ${m.milestone_completed ? "text-green-500" : "text-gray-400"}`}
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{escapeMinimal(m.milestone_name)}</span>
                            </li>
                          ))
                        )}
                      </ul>
                      {project.milestones.length > 3 && (
                        <p className="text-xs text-gray-500 mt-2">+{project.milestones.length - 3} more milestones</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => openViewModal(project)}
                    className="text-primary hover:underline text-sm font-semibold text-left cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Delete Modal */}
        <DeleteTaskModal
          showDeleteModal={showDeleteModal}
          setDeleteModal={setDeleteModal}
          handleConfirmDelete={handleDeleteTask}
          isLoading={isLoading}
        />

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-sm max-w-2xl w-full p-6 shadow-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Create Project</h3>
              <div className="space-y-3">
                <input
                  value={newProject.project_name}
                  onChange={(e) => setNewProject((p) => ({ ...p, project_name: e.target.value }))}
                  placeholder="Project name"
                  className="w-full border rounded px-3 py-2"
                />

                <div className="flex gap-2">
                  <select value={newProject.status} onChange={(e) => setNewProject((p) => ({ ...p, status: e.target.value }))} className="border rounded px-3 py-2">
                    <option value="pending">Pending</option>
                    <option value="on_track">On Track</option>
                    <option value="completed">Completed</option>
                  </select>

                  <input type="date" value={newProject.due_date} onChange={(e) => setNewProject((p) => ({ ...p, due_date: e.target.value }))} className="border rounded px-3 py-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Milestones</h4>
                    <button onClick={addNewMilestone} className="text-sm text-blue-600 cursor-pointer hover:underline transition-all" >Add</button>
                  </div>

                  <div className="space-y-2">
                    {newProject.milestones.map((m, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input value={m.milestone_name} onChange={(e) => setNewProject((p) => ({ ...p, milestones: p.milestones.map((mm, i) => (i === idx ? { ...mm, milestone_name: e.target.value } : mm)) }))} placeholder="Milestone name" className="flex-1 border rounded px-3 py-2" />
                        <input type="date" value={m.milestone_due_date || ""} onChange={(e) => setNewProject((p) => ({ ...p, milestones: p.milestones.map((mm, i) => (i === idx ? { ...mm, milestone_due_date: e.target.value } : mm)) }))} className="border rounded px-2 py-1" />
                        <button onClick={() => removeNewMilestone(idx)} className="text-red-500 hover:underline cursor-pointer">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4">
                  <button onClick={() => setShowCreateModal(false)} className="cursor-pointer px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                  <button onClick={createProject} className="flex items-center justify-center cursor-pointer rounded bg-blue-600 px-4 py-2  font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">Create</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-sm max-w-2xl w-full p-6 shadow-lg max-h-[90vh] overflow-y-auto">
              <span className="flex justify-between items-center ">
                <h3 className="text-xl font-semibold mb-4">Edit Project</h3>
                <button onClick={() => showDeleteProjectModal(editingProject.project_id)}>
                  <Trash size={28} className="cursor-pointer rounded-full text-red-600 p-1 hover:bg-red-200" />

                </button>

              </span>

              <div className="space-y-3">
                <input value={editingProject.project_name} onChange={(e) => setEditingProject({ ...editingProject, project_name: e.target.value })} placeholder="Project name" className="w-full border rounded px-3 py-2" />

                <div className="flex gap-2">
                  <select value={editingProject.project_status} onChange={(e) => setEditingProject({ ...editingProject, project_status: e.target.value })} className="border rounded px-3 py-2">
                    <option value="pending">Pending</option>
                    <option value="on_track">On Track</option>
                    <option value="completed">Completed</option>
                  </select>

                  <input
                    type="date"
                    value={formatDateForInput(editingProject.project_due_date)}
                    onChange={(e) => setEditingProject({ ...editingProject, project_due_date: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Milestones</h4>
                    <button onClick={addEditMilestone} className="text-sm text-blue-600 cursor-pointer hover:underline">Add</button>
                  </div>

                  <div className="space-y-2">
                    {editingProject.milestones.map((m, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input value={m.milestone_name} onChange={(e) => setEditingProject({ ...editingProject, milestones: editingProject.milestones.map((mm, i) => (i === idx ? { ...mm, milestone_name: e.target.value } : mm)) })} placeholder="Milestone name" className="flex-1 border rounded px-3 py-2" />
                        <input
                          type="date"
                          value={formatDateForInput(m.milestone_due_date)}
                          onChange={(e) => setEditingProject({ ...editingProject, milestones: editingProject.milestones.map((mm, i) => (i === idx ? { ...mm, milestone_due_date: e.target.value } : mm)) })}
                          className="border rounded px-2 py-1"
                        />
                        <label className="flex items-center gap-1">
                          <input type="checkbox" checked={!!m.milestone_completed} onChange={(e) => setEditingProject({ ...editingProject, milestones: editingProject.milestones.map((mm, i) => (i === idx ? { ...mm, milestone_completed: e.target.checked } : mm)) })} />
                          <span className="text-sm">Done</span>
                        </label>
                        <button onClick={() => removeEditMilestone(idx)} className="text-red-500 cursor-pointer">                <Trash size={28} className="cursor-pointer rounded-full text-red-600 p-1 hover:bg-red-200" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4">
                  <button onClick={() => { setShowEditModal(false); setEditingProject(null); setRemovedMilestoneIds([]); }} className="cursor-pointer px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                  <button onClick={updateProject} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showViewModal && viewingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-sm max-w-3xl w-full p-6 shadow-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{escapeMinimal(viewingProject.project_name)}</h3>
                  <p className="text-sm text-gray-500 mt-1">Project ID: {viewingProject.project_id}</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Status and Due Date */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 capitalize">
                    {viewingProject.project_status.replace("_", " ")}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Due Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateForDisplay(viewingProject.project_due_date)}
                  </p>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">Overall Progress</h4>
                  <span className="text-2xl font-bold text-green-600">{viewingProject.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${viewingProject.progress_percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {viewingProject.milestones.filter(m => m.milestone_completed).length} of {viewingProject.milestones.length} milestones completed
                </p>
              </div>

              {/* Milestones Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h4>
                {viewingProject.milestones.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No milestones added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {viewingProject.milestones.map((milestone, idx) => (
                      <div
                        key={milestone.milestone_id || idx}
                        className={`border rounded-lg p-4 ${milestone.milestone_completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              {milestone.milestone_completed ? (
                                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className={`font-medium ${milestone.milestone_completed ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                                {escapeMinimal(milestone.milestone_name)}
                              </h5>
                              {milestone.milestone_due_date && (
                                <p className="text-xs text-gray-600 mt-1">
                                  Due: {formatDateForDisplay(milestone.milestone_due_date)}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${milestone.milestone_completed ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                            {milestone.milestone_completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(viewingProject);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                >
                  Edit Project
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;