# BuildSpace workflow update

19 October 2026

## What changed

### A task workspace that stays current

The project board previously held copied project and task objects. Updating a task changed the shared store while leaving the visible board and details behind. Both selections now resolve by ID from current data, so status, completion progress and checklist changes appear immediately.

- Switch between squads you belong to and their projects.
- Use All work, Assigned to me, Due soon and Overdue views.
- Combine text search with a priority filter, in board or list layout.
- Create projects and tasks from accessible dialogs, including unassigned tasks with no deadline.
- Date-only deadlines use the viewer's calendar day. Due soon includes today through seven days ahead; completed tasks are never overdue.

The concepts are inspired by [Linear My issues](https://linear.app/docs/my-issues), [Linear filters](https://linear.app/docs/filters) and [GitHub Projects views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views).

### Focused message threads

“Reply in thread” now opens a separate, responsive conversation panel. Replies reference a root message with `parent_id`, show their own count and remain outside the main room timeline. Quoting a message in the room is still available as a separate action.

Threads include the original message, a reply composer, sample attachment cards, reply deletion and close/Escape controls. Posting checks squad membership, the room and a valid same-room root message. Squad navigation only displays the current user's memberships. Timestamps render safely on the server before displaying in the viewer's locale.

The conversation model is inspired by [Discord threads](https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ).

### Saved hackathons and calendar dates

Save an event from its card or details, then find it under Saved events. Each profile has a separate watchlist in this browser, including when switching demo personas.

Download an `.ics` file containing a registration-deadline milestone and a competition event with its start/end time. Files use stable event IDs, explicit UTC timestamps, escaped text, CRLF lines, UTF-8 line folding and safe filenames. Invalid or ambiguous dates produce an error. Import the file into your calendar; the export does not subscribe to schedule changes, register for an event or send notifications.

This follows the participant-planning needs described in [Devpost's submission guide](https://help.devpost.com/article/126-know-your-submission-steps).

### Demo continuity and navigation

Versioned, validated local snapshots preserve the demo campus across refreshes. Corrupt or incompatible snapshots fall back to seed data. Blocked/full storage keeps the latest work in memory for the current visit and displays a warning. Tabs observe browser-storage changes; competing edits use the browser's last-write-wins behavior.

The dashboard and command palette surface the new workflows. Navigation collapses before desktop links crowd the header.

## Run and verify

Use Node.js 22.23 or newer for the built-in TypeScript test support. From the repository root:

```sh
npm install
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
```

For a clean install using the existing application lockfile:

```sh
cd community-hub
npm ci --workspaces=false
npm run dev
```

New tests import production helpers for task filtering/date boundaries, thread selection/posting, calendar escaping/date validation, watchlist behavior, campus validation and storage failure/recovery. The original permission tests remain simulated and should not be treated as proof of database security.

Browser checks cover task filters/list layout, immediate status/progress updates and refresh persistence; posting/reopening a thread after refresh; saved-event filtering and persona isolation; and locale-safe hydration. Build and lint should also be run before deployment. Existing unused-variable warnings in unrelated pages are outside this update.

Verified for this update: 43 tests pass (37 new tests importing production helpers and 6 existing simulated tests); TypeScript passes; the production build generates all 18 pages; lint exits successfully with 0 errors and 45 existing warnings in unchanged pages. Browser checks also confirm checklist updates inside an open task dialog and Escape restoring focus.

## Data boundaries and remaining work

- Campus data is local demo data shared between demo personas in the same browser. Watchlists are scoped to each profile and browser. Neither is a server authorization boundary.
- Supabase authentication support is separate from collaboration storage. This update does not implement live database queries, realtime subscriptions, backend notifications or storage uploads. With configured auth, the existing collaboration demo remains in memory.
- Calendar downloads are point-in-time exports. Check the organizer's official site for changes.
- Sample file cards point to the library; they do not upload or store actual documents.
- Before enabling live collaboration, implement repository/database operations and appropriate RLS policies, including the existing projects/tasks/hackathons policy gaps. Recheck authorization on the server rather than relying on client membership checks.

No database migration or new dependency is required for these local-demo features.
