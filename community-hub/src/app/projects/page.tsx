'use client';

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import { filterTasks, localDayKey, memberTeams, resolveProject, taskDueState } from '@/lib/task-filters';
import type { TaskFocus } from '@/lib/task-filters';
import type { ProjectTask, TaskStatus, TaskPriority } from '@/types';
import { FolderGit2, PlusCircle, CheckCircle2, CheckSquare, Square, X, Search, LayoutGrid, List, Calendar, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'text-slate-400' },
  { id: 'todo', label: 'To Do', color: 'text-cyan-400' },
  { id: 'in_progress', label: 'In Progress', color: 'text-purple-400' },
  { id: 'review', label: 'Review', color: 'text-amber-400' },
  { id: 'done', label: 'Done', color: 'text-emerald-400' },
];
const FOCUS_VIEWS: { id: TaskFocus; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'mine', label: 'Assigned to me' },
  { id: 'due_soon', label: 'Due soon' },
  { id: 'overdue', label: 'Overdue' },
];
const PRIORITY_CLASSES: Record<TaskPriority, string> = {
  urgent: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
  high: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  medium: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  low: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
};
const INPUT = 'w-full px-3 py-2.5 rounded-xl border border-white/10 bg-[#090E1D] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400';
const PRIMARY = 'px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-400 text-black hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300';

function subscribeToDay(onChange: () => void) {
  const interval = window.setInterval(onChange, 60_000);
  window.addEventListener('focus', onChange);
  return () => { window.clearInterval(interval); window.removeEventListener('focus', onChange); };
}
function currentDay() { return localDayKey(new Date()); }
function serverDay() { return ''; }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);
  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }} className="m-auto w-[calc(100%_-_2rem)] max-w-lg max-h-[90dvh] overflow-y-auto bg-[#0C1222] text-white border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 mb-5">
        <h2 id={titleId} className="font-heading text-xl font-bold">{title}</h2>
        <button type="button" onClick={onClose} aria-label={`Close ${title}`} className="p-1 rounded text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300"><X className="w-5 h-5" /></button>
      </div>
      {children}
    </dialog>
  );
}

function StatusSelect({ task, onChange }: { task: ProjectTask; onChange: (status: TaskStatus) => void }) {
  return (
    <select value={task.status} aria-label={`Status for ${task.title}`} onChange={(event) => onChange(event.target.value as TaskStatus)} className="max-w-full text-xs bg-[#070B14] border border-white/10 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-400">
      {COLUMNS.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
    </select>
  );
}

function DueDate({ task, now }: { task: ProjectTask; now: Date }) {
  if (!task.due_date) return <span className="text-slate-500">No due date</span>;
  const dueState = taskDueState(task.due_date, task.status, now);
  return <span className={`inline-flex items-center gap-1 ${dueState === 'overdue' ? 'text-rose-300' : dueState === 'due_soon' ? 'text-amber-300' : 'text-slate-400'}`}><Calendar className="w-3 h-3 shrink-0" />{dueState === 'overdue' && 'Overdue · '}<time dateTime={task.due_date}>{task.due_date}</time></span>;
}

function TaskCard({ task, now, onOpen, onStatusChange }: { task: ProjectTask; now: Date; onOpen: () => void; onStatusChange: (status: TaskStatus) => void }) {
  return (
    <article className="p-3.5 rounded-xl border border-white/10 bg-[#0C1222] hover:border-cyan-500/40 transition-colors space-y-3 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${PRIORITY_CLASSES[task.priority]}`}>{task.priority}</span>
        <StatusSelect task={task} onChange={onStatusChange} />
      </div>
      <button type="button" onClick={onOpen} className="block w-full text-left text-sm font-semibold text-white hover:text-cyan-300 rounded focus-visible:outline-2 focus-visible:outline-cyan-300">{task.title}</button>
      <div className="flex flex-wrap gap-1">{task.labels.map((label) => <span key={label} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{label}</span>)}</div>
      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 text-[10px]">
        <span className="flex items-center gap-1 text-slate-400" aria-label={`${task.checklist.filter((item) => item.completed).length} of ${task.checklist.length} subtasks complete`}><CheckSquare className="w-3 h-3 text-cyan-400" />{task.checklist.filter((item) => item.completed).length}/{task.checklist.length}</span>
        <DueDate task={task} now={now} />
      </div>
      <p className="text-[11px] text-slate-400 truncate">{task.assignee?.full_name || 'Unassigned'}</p>
    </article>
  );
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const { teams, projects, currentTeam, setCurrentTeam, updateTaskStatus, createTask, toggleTaskChecklist, createProject } = useCommunity();
  const availableTeams = memberTeams(teams, user?.id);
  const team = availableTeams.find((item) => item.id === currentTeam?.id) || availableTeams[0];
  const teamProjects = projects.filter((project) => project.team_id === team?.id);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const activeProject = resolveProject(projects, team?.id, activeProjectId);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const selectedTaskDetail = activeProject?.tasks.find((task) => task.id === selectedTaskId);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [focus, setFocus] = useState<TaskFocus>('all');
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<TaskPriority | 'all'>('all');
  const [view, setView] = useState<'board' | 'list'>('board');
  // Use a client snapshot so local deadlines do not disagree with server-rendered dates.
  const day = useSyncExternalStore(subscribeToDay, currentDay, serverDay);
  const now = day ? new Date(`${day}T12:00:00`) : new Date(NaN);
  const tasks = activeProject?.tasks || [];
  const visibleTasks = filterTasks(tasks, { focus, query, priority, userId: user?.id, now });
  const completedCount = tasks.filter((task) => task.status === 'done').length;
  const progressPercent = tasks.length ? Math.round(completedCount / tasks.length * 100) : 0;
  const hasFilters = focus !== 'all' || query.trim() !== '' || priority !== 'all';

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('todo');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskLabelsInput, setTaskLabelsInput] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('');
  const [newProjStack, setNewProjStack] = useState('');

  const resetFilters = () => { setFocus('all'); setQuery(''); setPriority('all'); };
  const openCreateTask = () => {
    setTaskAssigneeId(team?.members.some((member) => member.user.id === user?.id) ? user!.id : '');
    setShowCreateTaskModal(true);
  };
  const handleCreateTaskSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeProject || !team || !taskTitle.trim()) return;
    createTask(activeProject.id, {
      title: taskTitle.trim(), description: taskDesc.trim(), priority: taskPriority, status: taskStatus,
      due_date: taskDueDate || undefined,
      labels: [...new Set(taskLabelsInput.split(',').map((label) => label.trim()).filter(Boolean))],
      assignee: team.members.find((member) => member.user.id === taskAssigneeId)?.user,
      checklist: [],
    });
    setShowCreateTaskModal(false);
    setTaskTitle(''); setTaskDesc(''); setTaskLabelsInput(''); setTaskDueDate(''); setTaskStatus('todo'); setTaskPriority('medium');
    // Show newly created work even when the previous view had excluded it.
    resetFilters();
  };
  const handleCreateProjectSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!team || !newProjTitle.trim()) return;
    createProject({ team_id: team.id, title: newProjTitle.trim(), description: newProjDesc.trim(), github_url: newProjGithub.trim() || undefined, tech_stack: [...new Set(newProjStack.split(',').map((tech) => tech.trim()).filter(Boolean))] });
    setActiveProjectId(null); setSelectedTaskId(null); resetFilters();
    setShowCreateProjectModal(false); setNewProjTitle(''); setNewProjDesc(''); setNewProjGithub(''); setNewProjStack('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-white selection:bg-cyan-500/25 selection:text-cyan-300">
      <Navbar />
      <ToastContainer />
      <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div><p className="text-xs text-cyan-300 font-mono mb-2">PLAN · BUILD · SHIP</p><h1 className="font-heading text-3xl font-extrabold tracking-tight">Project workspace</h1><p className="text-sm text-slate-400 mt-2">A clear view of your team&apos;s next move.</p></div>
          {team && <button type="button" onClick={() => setShowCreateProjectModal(true)} className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold inline-flex items-center justify-center gap-2"><FolderGit2 className="w-4 h-4 text-cyan-400" />New project</button>}
        </div>

        {!team ? (
          <div className="p-10 text-center rounded-3xl border border-white/10 bg-[#090E1D] space-y-3"><FolderGit2 className="w-10 h-10 mx-auto text-cyan-400" /><h2 className="text-lg font-semibold">Find your team first</h2><p className="text-sm text-slate-400">Join or create a squad to plan projects and work together.</p><Link href="/teams" className={PRIMARY}>Explore squads<ArrowRight className="w-4 h-4" /></Link></div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="text-xs text-slate-400 flex-1 max-w-sm">Squad<select aria-label="Select squad" value={team.id} onChange={(event) => { const nextTeam = availableTeams.find((item) => item.id === event.target.value); if (nextTeam) setCurrentTeam(nextTeam); setActiveProjectId(null); setSelectedTaskId(null); resetFilters(); }} className={`${INPUT} mt-1.5`}>{availableTeams.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              {activeProject && <label className="text-xs text-slate-400 flex-1 max-w-sm">Project<select aria-label="Select project" value={activeProject.id} onChange={(event) => { setActiveProjectId(event.target.value); setSelectedTaskId(null); resetFilters(); }} className={`${INPUT} mt-1.5`}>{teamProjects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select></label>}
            </div>

            {!activeProject ? (
              <div className="p-10 text-center rounded-3xl border border-dashed border-white/15 bg-[#090E1D] space-y-3"><FolderGit2 className="w-10 h-10 mx-auto text-cyan-400" /><h2 className="text-lg font-semibold">Your next build starts here</h2><p className="text-sm text-slate-400">Create the first project for {team.name}, then add your team&apos;s tasks.</p><button type="button" onClick={() => setShowCreateProjectModal(true)} className={PRIMARY}><PlusCircle className="w-4 h-4" />Create project</button></div>
            ) : (
              <>
                <section aria-label="Project overview" className="p-5 sm:p-7 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0C152C] via-[#091024] to-[#070B14] space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0"><span className="text-[10px] font-mono px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{activeProject.status.replaceAll('_', ' ')}</span><h2 className="font-heading text-xl sm:text-2xl font-bold mt-3 break-words">{activeProject.title}</h2><p className="text-sm text-slate-400 mt-1 max-w-2xl break-words">{activeProject.description}</p></div>
                    <div className="flex flex-wrap gap-2 shrink-0">{activeProject.github_url && <a href={activeProject.github_url} target="_blank" rel="noreferrer" className="px-3 py-2.5 rounded-xl text-xs border border-white/10 bg-white/5 hover:bg-white/10 inline-flex items-center gap-2"><GithubIcon className="w-4 h-4 text-cyan-400" />Repository</a>}<button type="button" onClick={openCreateTask} className={PRIMARY}><PlusCircle className="w-4 h-4" />Add task</button></div>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="flex-1"><div className="flex items-center justify-between text-xs mb-2"><span className="text-slate-400">Project completion</span><span className="font-mono text-cyan-300">{progressPercent}% · {completedCount}/{tasks.length} tasks</span></div><div role="progressbar" aria-label="Project completion" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} /></div></div>
                    <div className="flex flex-wrap gap-1.5 md:max-w-[50%]">{activeProject.tech_stack.map((tech) => <span key={tech} className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/5">{tech}</span>)}</div>
                  </div>
                </section>

                <section aria-label="Task workspace" className="space-y-4">
                  <div className="p-3 sm:p-4 rounded-2xl border border-white/10 bg-[#090E1D] space-y-4">
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Task focus">{FOCUS_VIEWS.map((item) => {
                      const count = filterTasks(tasks, { focus: item.id, userId: user?.id, query, priority, now }).length;
                      return <button key={item.id} type="button" aria-pressed={focus === item.id} onClick={() => setFocus(item.id)} className={`px-3 py-2 rounded-xl text-xs inline-flex items-center gap-2 border transition-colors focus-visible:outline-2 focus-visible:outline-cyan-300 ${focus === item.id ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-200' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}>{item.label}<span className="font-mono text-[10px] bg-white/5 rounded px-1.5 py-0.5">{!day && (item.id === 'due_soon' || item.id === 'overdue') ? '—' : count}</span></button>;
                    })}</div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="relative flex-1"><span className="sr-only">Search tasks</span><Search aria-hidden="true" className="absolute left-3 top-3 w-4 h-4 text-slate-500" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, labels, or people…" className={`${INPUT} pl-9 text-xs`} /></label>
                      <div className="flex gap-2"><select aria-label="Filter by priority" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority | 'all')} className={`${INPUT} text-xs min-w-0 sm:w-36`}><option value="all">All priorities</option><option value="urgent">Urgent</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select><div role="group" aria-label="Task layout" className="flex shrink-0 p-1 rounded-xl border border-white/10 bg-[#070B14]">{(['board', 'list'] as const).map((layout) => <button key={layout} type="button" aria-label={`${layout === 'board' ? 'Board' : 'List'} view`} aria-pressed={view === layout} onClick={() => setView(layout)} className={`p-2 rounded-lg focus-visible:outline-2 focus-visible:outline-cyan-300 ${view === layout ? 'bg-white/10 text-cyan-300' : 'text-slate-500 hover:text-white'}`}>{layout === 'board' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}</button>)}</div></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs"><p aria-live="polite" role="status" className="text-slate-400">{visibleTasks.length} of {tasks.length} tasks{focus === 'due_soon' && ' · Today through the next 7 days'}{focus === 'overdue' && ' · Unfinished tasks past their due date'}</p>{hasFilters && <button type="button" onClick={resetFilters} className="shrink-0 text-cyan-300 hover:text-cyan-200 underline underline-offset-4">Clear filters</button>}</div>

                  {visibleTasks.length === 0 ? (
                    <div className="p-10 rounded-2xl border border-dashed border-white/15 text-center space-y-3"><CheckCircle2 className="w-9 h-9 mx-auto text-cyan-400/70" /><h3 className="font-semibold">{tasks.length === 0 ? 'Plan your first task' : focus === 'overdue' && !query && priority === 'all' ? 'No overdue tasks' : 'No tasks match this view'}</h3><p className="text-sm text-slate-400">{tasks.length === 0 ? 'Break the project into clear steps your team can own.' : 'Try another focus, priority, or search to see more work.'}</p>{tasks.length === 0 ? <button type="button" onClick={openCreateTask} className={PRIMARY}><PlusCircle className="w-4 h-4" />Add first task</button> : <button type="button" onClick={resetFilters} className="text-xs text-cyan-300 hover:underline">Show all work</button>}</div>
                  ) : view === 'board' ? (
                    <div className="overflow-x-auto pb-3 rounded-2xl" role="region" aria-label="Task board" tabIndex={0}><div className="grid grid-cols-1 sm:grid-cols-5 sm:min-w-[1280px] gap-4">{COLUMNS.map((column) => {
                      const columnTasks = visibleTasks.filter((task) => task.status === column.id);
                      return <section key={column.id} aria-label={`${column.label}, ${columnTasks.length} tasks`} className="rounded-2xl border border-white/10 bg-[#090E1D] p-3 space-y-3"><h3 className={`font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between pb-3 border-b border-white/5 ${column.color}`}>{column.label}<span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{columnTasks.length}</span></h3><div className="space-y-3 sm:min-h-48">{columnTasks.length ? columnTasks.map((task) => <TaskCard key={task.id} task={task} now={now} onOpen={() => setSelectedTaskId(task.id)} onStatusChange={(status) => updateTaskStatus(activeProject.id, task.id, status)} />) : <p className="p-5 text-center rounded-xl border border-dashed border-white/5 text-slate-500 text-xs">No tasks in {column.label.toLowerCase()}</p>}</div></section>;
                    })}</div></div>
                  ) : (
                    <ul aria-label="Task list" className="rounded-2xl border border-white/10 bg-[#090E1D] divide-y divide-white/5 overflow-hidden">{visibleTasks.map((task) => <li key={task.id} className="p-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_8rem_9rem] gap-3 items-center"><div className="min-w-0"><button type="button" onClick={() => setSelectedTaskId(task.id)} className="block text-left text-sm font-semibold hover:text-cyan-300 rounded focus-visible:outline-2 focus-visible:outline-cyan-300">{task.title}</button><p className="text-xs text-slate-500 mt-1 truncate">{task.assignee?.full_name || 'Unassigned'}{task.labels.length > 0 && ` · ${task.labels.join(', ')}`}</p></div><span className={`justify-self-start text-[10px] font-mono uppercase px-2 py-1 rounded-full border ${PRIORITY_CLASSES[task.priority]}`}>{task.priority}</span><StatusSelect task={task} onChange={(status) => updateTaskStatus(activeProject.id, task.id, status)} /><div className="text-xs"><DueDate task={task} now={now} /></div></li>)}</ul>
                  )}
                </section>
              </>
            )}
          </>
        )}

        {/* Modals are native dialogs for focus management, Escape, and keyboard access. */}
        {selectedTaskDetail && activeProject && (
          <Modal title={selectedTaskDetail.title} onClose={() => setSelectedTaskId(null)}>
            <div className="space-y-5">
              <span className={`inline-block text-[10px] font-mono uppercase px-2 py-1 rounded-full border ${PRIORITY_CLASSES[selectedTaskDetail.priority]}`}>{selectedTaskDetail.priority} priority</span>
              <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">{selectedTaskDetail.description || 'No description yet.'}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400"><span>{selectedTaskDetail.assignee?.full_name || 'Unassigned'}</span><DueDate task={selectedTaskDetail} now={now} /></div>
              <div className="border-t border-white/10 pt-4 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Subtasks · {selectedTaskDetail.checklist.filter((item) => item.completed).length}/{selectedTaskDetail.checklist.length}</h3>
                {selectedTaskDetail.checklist.length ? selectedTaskDetail.checklist.map((item) => (
                  <button key={item.id} type="button" aria-pressed={item.completed} onClick={() => toggleTaskChecklist(activeProject.id, selectedTaskDetail.id, item.id)} className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-left text-xs focus-visible:outline-2 focus-visible:outline-cyan-300">
                    {item.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-500 shrink-0" />}
                    <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200'}>{item.text}</span>
                  </button>
                )) : <p className="text-xs text-slate-500">No subtasks for this task.</p>}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"><label className="text-xs text-slate-400 flex items-center gap-2">Status<StatusSelect task={selectedTaskDetail} onChange={(status) => updateTaskStatus(activeProject.id, selectedTaskDetail.id, status)} /></label><button type="button" onClick={() => setSelectedTaskId(null)} className={PRIMARY}>Done</button></div>
            </div>
          </Modal>
        )}

        {showCreateTaskModal && activeProject && team && (
          <Modal title="Create task" onClose={() => setShowCreateTaskModal(false)}>
            <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
              <p className="text-slate-400">Add work to {activeProject.title}.</p>
              <label className="block text-slate-300">Task title<input autoFocus value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} required maxLength={200} placeholder="What needs to be done?" className={`${INPUT} mt-1.5`} /></label>
              <label className="block text-slate-300">Description<textarea value={taskDesc} onChange={(event) => setTaskDesc(event.target.value)} rows={3} placeholder="Context and acceptance criteria…" className={`${INPUT} mt-1.5`} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-slate-300">Priority<select value={taskPriority} onChange={(event) => setTaskPriority(event.target.value as TaskPriority)} className={`${INPUT} mt-1.5`}><option value="urgent">Urgent</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
                <label className="text-slate-300">Status<select value={taskStatus} onChange={(event) => setTaskStatus(event.target.value as TaskStatus)} className={`${INPUT} mt-1.5`}>{COLUMNS.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</select></label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-slate-300">Assignee<select value={taskAssigneeId} onChange={(event) => setTaskAssigneeId(event.target.value)} className={`${INPUT} mt-1.5`}><option value="">Unassigned</option>{team.members.map((member) => <option key={member.user.id} value={member.user.id}>{member.user.full_name}</option>)}</select></label>
                <label className="text-slate-300">Due date <span className="text-slate-500">(optional)</span><input type="date" value={taskDueDate} onChange={(event) => setTaskDueDate(event.target.value)} className={`${INPUT} mt-1.5`} /></label>
              </div>
              <label className="block text-slate-300">Labels <span className="text-slate-500">(comma separated)</span><input value={taskLabelsInput} onChange={(event) => setTaskLabelsInput(event.target.value)} placeholder="Frontend, Release" className={`${INPUT} mt-1.5`} /></label>
              <div className="flex justify-end gap-3 border-t border-white/10 pt-4"><button type="button" onClick={() => setShowCreateTaskModal(false)} className="text-slate-400 hover:text-white px-3">Cancel</button><button type="submit" disabled={!taskTitle.trim()} className={PRIMARY}>Add task</button></div>
            </form>
          </Modal>
        )}

        {showCreateProjectModal && team && (
          <Modal title="Create project" onClose={() => setShowCreateProjectModal(false)}>
            <form onSubmit={handleCreateProjectSubmit} className="space-y-4 text-xs">
              <p className="text-slate-400">A new workspace for {team.name}.</p>
              <label className="block text-slate-300">Project name<input autoFocus value={newProjTitle} onChange={(event) => setNewProjTitle(event.target.value)} required maxLength={120} placeholder="Your next big build" className={`${INPUT} mt-1.5`} /></label>
              <label className="block text-slate-300">Description<textarea rows={3} value={newProjDesc} onChange={(event) => setNewProjDesc(event.target.value)} placeholder="What are you building?" className={`${INPUT} mt-1.5`} /></label>
              <label className="block text-slate-300">Repository URL <span className="text-slate-500">(optional)</span><input type="url" value={newProjGithub} onChange={(event) => setNewProjGithub(event.target.value)} placeholder="https://github.com/team/project" className={`${INPUT} mt-1.5`} /></label>
              <label className="block text-slate-300">Tech stack <span className="text-slate-500">(comma separated)</span><input value={newProjStack} onChange={(event) => setNewProjStack(event.target.value)} placeholder="TypeScript, Next.js" className={`${INPUT} mt-1.5`} /></label>
              <div className="flex justify-end gap-3 border-t border-white/10 pt-4"><button type="button" onClick={() => setShowCreateProjectModal(false)} className="text-slate-400 hover:text-white px-3">Cancel</button><button type="submit" disabled={!newProjTitle.trim()} className={PRIMARY}>Create project</button></div>
            </form>
          </Modal>
        )}
      </main>
      <Footer />
    </div>
  );
}
