import type { Project, ProjectTask, TaskPriority, TaskStatus, Team } from '../types';

export type TaskFocus = 'all' | 'mine' | 'due_soon' | 'overdue';
export type TaskDueState = 'none' | 'upcoming' | 'due_soon' | 'overdue';

/** A date input represents a local calendar day, never midnight in UTC. */
export function localDayKey(date: Date): string {
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function calendarDayNumber(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.getUTCFullYear() !== year || parsed.getUTCMonth() + 1 !== month || parsed.getUTCDate() !== day) return null;
  return Math.floor(parsed.getTime() / 86_400_000);
}

/** Due soon includes today through seven calendar days ahead; done work is never late. */
export function taskDueState(dueDate: string | undefined, status: TaskStatus, now = new Date()): TaskDueState {
  if (!dueDate || status === 'done') return 'none';
  const dueDay = calendarDayNumber(dueDate);
  const today = calendarDayNumber(localDayKey(now));
  if (dueDay === null || today === null) return 'none';
  const daysRemaining = dueDay - today;
  if (daysRemaining < 0) return 'overdue';
  return daysRemaining <= 7 ? 'due_soon' : 'upcoming';
}

export interface TaskFilters {
  focus?: TaskFocus;
  userId?: string;
  query?: string;
  priority?: TaskPriority | 'all';
  now?: Date;
}

export function filterTasks(tasks: readonly ProjectTask[], filters: TaskFilters = {}): ProjectTask[] {
  const { focus = 'all', userId, priority = 'all', now = new Date() } = filters;
  const words = (filters.query || '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return tasks.filter((task) => {
    if (focus === 'mine' && (!userId || task.assignee?.id !== userId)) return false;
    if (focus === 'due_soon' && taskDueState(task.due_date, task.status, now) !== 'due_soon') return false;
    if (focus === 'overdue' && taskDueState(task.due_date, task.status, now) !== 'overdue') return false;
    if (priority !== 'all' && task.priority !== priority) return false;
    const searchable = [task.title, task.description, ...task.labels, task.assignee?.full_name || ''].join(' ').toLocaleLowerCase();
    return words.every((word) => searchable.includes(word));
  });
}

export function memberTeams(teams: readonly Team[], userId: string | undefined): Team[] {
  if (!userId) return [];
  return teams.filter((team) => team.owner_id === userId || team.members.some((member) => member.user.id === userId));
}

/** Resolve against current data so task mutations and team switches cannot retain stale objects. */
export function resolveProject(projects: readonly Project[], teamId: string | undefined, selectedId: string | null): Project | undefined {
  const scoped = projects.filter((project) => Boolean(teamId) && project.team_id === teamId);
  return scoped.find((project) => project.id === selectedId) || scoped[0];
}
