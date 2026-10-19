import type { ChatMessage, Team } from '@/types';

/** Thread replies stay out of the room stream, including after a root is deleted. */
export function getChannelMessages(messages: readonly ChatMessage[], roomId: string): ChatMessage[] {
  return messages.filter((message) => message.room_id === roomId && !message.parent_id);
}

export function getThreadRoot(
  messages: readonly ChatMessage[],
  roomId: string,
  rootId: string,
): ChatMessage | undefined {
  return messages.find((message) => message.id === rootId && message.room_id === roomId && !message.parent_id);
}

export function getThreadMessages(
  messages: readonly ChatMessage[],
  roomId: string,
  rootId: string,
): ChatMessage[] {
  if (!getThreadRoot(messages, roomId, rootId)) return [];
  return messages.filter((message) => message.room_id === roomId && message.parent_id === rootId);
}

/** Validate the local demo's posting rules before adding a message to state. */
export function getMessagePostError(
  userId: string | undefined,
  teams: readonly Team[],
  roomId: string,
  messages: readonly ChatMessage[],
  parentId?: string,
): string | null {
  if (!userId) return 'Sign in to post a message.';
  const team = teams.find((candidate) => candidate.rooms.some((room) => room.id === roomId && room.team_id === candidate.id));
  if (!team) return 'This room is no longer available.';
  if (!team.members.some((member) => member.user.id === userId)) {
    return 'Join this squad before posting in its rooms.';
  }
  if (parentId !== undefined && !getThreadRoot(messages, roomId, parentId)) {
    return 'This thread is no longer available. Choose a message in this room.';
  }
  return null;
}
