'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import { Project, ProjectTask, TaskStatus, TaskPriority } from '@/types';
import {
  FolderGit2,
  PlusCircle,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  CheckSquare,
  Square,
  X,
  Filter,
  User,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'text-slate-400' },
  { id: 'todo', label: 'To Do', color: 'text-cyan-400' },
  { id: 'in_progress', label: 'In Progress', color: 'text-purple-400' },
  { id: 'review', label: 'Review', color: 'text-amber-400' },
  { id: 'done', label: 'Done', color: 'text-emerald-400' },
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const {
    teams,
    projects,
    currentTeam,
    updateTaskStatus,
    createTask,
    toggleTaskChecklist,
    createProject,
    showToast,
  } = useCommunity();

  const team = currentTeam || teams[0];
  const teamProjects = projects.filter((p) => p.team_id === team?.id) || projects;
  const [activeProject, setActiveProject] = useState<Project>(teamProjects[0] || projects[0]);

  // Modals state
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<ProjectTask | null>(null);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('todo');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskLabelsInput, setTaskLabelsInput] = useState('Frontend, React');
  const [taskAssigneeId, setTaskAssigneeId] = useState(user?.id || '');

  // New project form state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('https://github.com/myteam/hackathon-build');
  const [newProjStack, setNewProjStack] = useState('Next.js, TypeScript, Rust, Supabase');

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !taskTitle.trim()) return;

    const labels = taskLabelsInput.split(',').map((l) => l.trim()).filter(Boolean);
    const assignee = team?.members.find((m) => m.user.id === taskAssigneeId)?.user || user || undefined;

    createTask(activeProject.id, {
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      priority: taskPriority,
      status: taskStatus,
      due_date: taskDueDate || '2026-11-05',
      labels,
      assignee,
      checklist: [
        { id: `c_${Date.now()}_1`, text: 'Initial design & requirements', completed: false },
        { id: `c_${Date.now()}_2`, text: 'Code implementation & tests', completed: false },
      ],
    });

    setShowCreateTaskModal(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    const stack = newProjStack.split(',').map((s) => s.trim()).filter(Boolean);

    createProject({
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      github_url: newProjGithub.trim(),
      tech_stack: stack,
    });

    setShowCreateProjectModal(false);
    setNewProjTitle('');
    setNewProjDesc('');
  };

  const completedCount = activeProject?.tasks.filter((t) => t.status === 'done').length || 0;
  const totalTasks = activeProject?.tasks.length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-white selection:bg-cyan-500/25 selection:text-cyan-300 relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Project Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0C152C] via-[#091024] to-[#070B14] shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {team?.name || 'Squad'} Project
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  ● Status: {activeProject?.status || 'in_progress'}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeProject?.title || 'NeuroPulse Swarm Engine'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {activeProject?.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {activeProject?.github_url && (
                <a
                  href={activeProject.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon className="w-4 h-4 text-cyan-400" />
                  GitHub Repository
                </a>
              )}

              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-400 text-black hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] font-heading"
              >
                <PlusCircle className="w-4 h-4" />
                Add Sprint Task
              </button>
            </div>
          </div>

          {/* Progress Bar & Tech Stack */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Sprint Roadmap Completion:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {progressPercent}% ({completedCount}/{totalTasks} tasks)
                </span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
              {activeProject?.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* KANBAN BOARD (5 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const columnTasks = activeProject?.tasks.filter((t) => t.status === col.id) || [];

            return (
              <div
                key={col.id}
                className="rounded-2xl border border-white/10 bg-[#090E1D] p-3.5 flex flex-col min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-bold uppercase tracking-wider ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/5 text-slate-400">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto min-h-[300px]">
                  {columnTasks.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-white/5 text-slate-600 text-xs">
                      No tasks
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl border border-white/10 bg-[#0C1222] hover:border-cyan-500/40 transition-all space-y-2.5 group cursor-pointer shadow-lg"
                        onClick={() => setSelectedTaskDetail(task)}
                      >
                        {/* Priority Chip & Actions */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                              task.priority === 'urgent'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : task.priority === 'high'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : task.priority === 'medium'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}
                          >
                            {task.priority}
                          </span>

                          {/* Quick status cycle button */}
                          <select
                            value={task.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              updateTaskStatus(activeProject.id, task.id, e.target.value as TaskStatus);
                            }}
                            className="text-[10px] font-mono bg-black/60 border border-white/10 rounded px-1 text-slate-300 focus:outline-none"
                          >
                            {COLUMNS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Title & Desc */}
                        <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Labels */}
                        <div className="flex flex-wrap gap-1">
                          {task.labels.map((lbl) => (
                            <span key={lbl} className="text-[9px] font-mono px-1.5 rounded bg-white/5 text-slate-400">
                              {lbl}
                            </span>
                          ))}
                        </div>

                        {/* Card bottom: Checklist count & Assignee */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                          <div className="flex items-center gap-1">
                            <CheckSquare className="w-3 h-3 text-cyan-400" />
                            <span>
                              {task.checklist.filter((c) => c.completed).length}/{task.checklist.length}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {task.due_date && <span>📅 {task.due_date}</span>}
                            {task.assignee && (
                              <img
                                src={task.assignee.avatar_url}
                                alt={task.assignee.full_name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
                                title={task.assignee.full_name}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* TASK DETAIL & CHECKLIST MODAL */}
        {selectedTaskDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                  {selectedTaskDetail.priority} Priority · {selectedTaskDetail.status.toUpperCase()}
                </span>
                <h3 className="font-heading text-xl font-bold text-white mt-2">
                  {selectedTaskDetail.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedTaskDetail.description || 'No detailed instructions provided.'}
                </p>
              </div>

              {/* Subtask Checklists */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Sprint Subtasks & Criteria
                </h4>
                <div className="space-y-2">
                  {selectedTaskDetail.checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        toggleTaskChecklist(activeProject.id, selectedTaskDetail.id, item.id);
                        // Local update for modal
                        setSelectedTaskDetail({
                          ...selectedTaskDetail,
                          checklist: selectedTaskDetail.checklist.map((c) =>
                            c.id === item.id ? { ...c, completed: !c.completed } : c
                          ),
                        });
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-left text-xs transition-colors"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Update bar */}
              <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Move column:</span>
                  <select
                    value={selectedTaskDetail.status}
                    onChange={(e) => {
                      const newSt = e.target.value as TaskStatus;
                      updateTaskStatus(activeProject.id, selectedTaskDetail.id, newSt);
                      setSelectedTaskDetail({ ...selectedTaskDetail, status: newSt });
                    }}
                    className="px-2 py-1 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSelectedTaskDetail(null)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-400 text-black font-semibold text-xs hover:bg-cyan-300"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE TASK MODAL */}
        {showCreateTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <h3 className="font-heading text-xl font-bold text-white">Create Sprint Task</h3>
                <p className="text-xs text-slate-400 mt-1">Assign work, deadline, and checklist items.</p>
              </div>

              <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Implement WebRTC NAT traversal fallback"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Description & Acceptance Criteria</label>
                  <textarea
                    rows={3}
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Provide context and links..."
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="urgent">🔴 Urgent</option>
                      <option value="high">🟠 High</option>
                      <option value="medium">🔵 Medium</option>
                      <option value="low">⚪ Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Initial Status</label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Assignee</label>
                    <select
                      value={taskAssigneeId}
                      onChange={(e) => setTaskAssigneeId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-cyan-400"
                    >
                      {team?.members.map((m) => (
                        <option key={m.user.id} value={m.user.id}>
                          {m.user.full_name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Labels (comma separated)</label>
                  <input
                    type="text"
                    value={taskLabelsInput}
                    onChange={(e) => setTaskLabelsInput(e.target.value)}
                    placeholder="Networking, Rust, WebRTC"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCreateTaskModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-cyan-400 text-black rounded-xl hover:bg-cyan-300 font-heading"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
