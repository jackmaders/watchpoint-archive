# Research: In-Progress VOD Resumption vs. Stateless Session Attempts

**Issue**: [#439](https://github.com/jackmaders/watchpoint/issues/439)  
**Status**: Completed  
**Author**: Antigravity Agent  
**Date**: 2026-09-16  

---

## Executive Summary

This research evaluation analyzes the technical architecture and user experience tradeoffs between:
1. Supporting **in-progress session persistence and resumption** (allowing users to pause and resume partially completed VOD training sessions), and
2. Treating training runs as **discrete, stateless session attempts** (recording only completed sessions in history or ignoring incomplete attempts).

### Key Finding & Recommendation
**Recommendation: Transition to a Discrete, Stateless Session Model (Option B).**
Watchpoint training sessions are lightweight (typically 3–10 scenario interactions spanning 2–5 minutes of video). Tracking and persisting incomplete sessions introduces unnecessary database writes, state-machine synchronization complexity, history pollution, and distorted analytics (e.g., partial runs reporting artificially low accuracy), with negligible user benefit. Resuming a high-intensity situational scenario mid-stream also creates cognitive disorientation.

---

## 1. Current Codebase Implementation Analysis

### 1.1 Data Schema & Persistence in Cloudflare D1
The current D1 database schema defines the following tables for session tracking:

1. **`playthrough`** ([`src/shared/db/schema/playthrough.ts`](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-in-progress-vod-resumption/src/shared/db/schema/playthrough.ts)):
   - Columns: `id`, `user_id`, `vod_id`, `status` (`"IN_PROGRESS"` | `"COMPLETED"`), `created_at`, `completed_at`.
   - Initialized with default status `"IN_PROGRESS"` upon session load.
2. **`playthrough_completion`** ([`src/shared/db/schema/playthrough-completion.ts`](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-in-progress-vod-resumption/src/shared/db/schema/playthrough-completion.ts)):
   - Stores `id`, `playthrough_id` (unique foreign key), `user_id`, `completed_at`.
   - Created only when a session reaches its terminal completion event via `completePlaythroughAction`.
3. **`playthrough_module_selection`** ([`src/shared/db/schema/playthrough-module-selection.ts`](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-in-progress-vod-resumption/src/shared/db/schema/playthrough-module-selection.ts)):
   - Records module filters active for the playthrough.
4. **`scenario_snapshot`** ([`src/shared/db/schema/scenario-snapshot.ts`](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-in-progress-vod-resumption/src/shared/db/schema/scenario-snapshot.ts)):
   - Creates immutable point-in-time snapshot copies of every scenario in the manifest associated with the `playthrough_id`.
5. **`attempt_record`** ([`src/shared/db/schema/attempt-record.ts`](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-in-progress-vod-resumption/src/shared/db/schema/attempt-record.ts)):
   - Asynchronously records individual scenario responses (`is_correct`, `is_timed_out`, `response_time_ms`, `selected_option_id`, `scenario_snapshot_id`, `playthrough_id`, `user_id`, `idempotency_key`).

### 1.2 The "Resumption Gap" in Current Implementation
While the database schema and ADR-0009 anticipate an `"IN_PROGRESS"` status, true session resumption is currently an illusion in the runtime:

1. **Eager Session Creation on Route Load**:
   - In [`src/pages/vods-id-session/api/loaders.ts`](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-in-progress-vod-resumption/src/pages/vods-id-session/api/loaders.ts#L63-L80), `loadVodsIdSessionPage` immediately invokes `startPlaythroughAction`.
   - This eagerly commits a `playthrough` record with `status: "IN_PROGRESS"` and inserts all `scenario_snapshot` rows before the user even starts playback.
2. **Lack of Hydration & Coordinator State**:
   - The coordinator state machine in [`src/pages/vods-id-session/model/session-playthrough-coordinator.ts`](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-in-progress-vod-resumption/src/pages/vods-id-session/model/session-playthrough-coordinator.ts#L179-L194) always initializes in-memory state to `activeScenarioIndex: 0`, `state: "LOADING"`, and `attempts: []`.
   - It has no mechanism to hydrate previously answered attempts or restore playback position.
3. **Broken Resume Link in `/history`**:
   - In [`src/pages/history/ui/history-item-card.tsx`](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-in-progress-vod-resumption/src/pages/history/ui/history-item-card.tsx#L79-L87), the "Continue Training →" button links to `/vods/$id/session` without passing parameters or restoring progress.
   - If `playthroughId` were passed in the URL search params, `loadVodsIdSessionPage` would attempt to re-insert the existing ID, causing a database primary-key conflict error (`"Playthrough start conflict"`).
4. **History Metric Skew**:
   - In [`src/pages/history/model/get-history.ts`](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-in-progress-vod-resumption/src/pages/history/model/get-history.ts#L84-L87), accuracy is calculated as:
     $$\text{Accuracy} = \frac{\text{Correct Attempts Count}}{\text{Total Scenario Snapshots}} \times 100\%$$
   - An unfinished playthrough with 1 correct answer out of 5 scenarios shows 20% accuracy rather than 100% of attempted scenarios, distorting player stats.

---

## 2. User Experience & Cognitive Tradeoffs

| Aspect | In-Progress Resumption | Discrete / Stateless Attempts |
| :--- | :--- | :--- |
| **Cognitive Flow** | ❌ **Disorienting**: Dropping into scenario 4 of 5 without recent visual/auditory game context impairs reflex decision-making. | ✅ **Cohesive**: Player observes the round from the beginning, building situational awareness naturally. |
| **Time Investment** | ⚠️ Minor savings for very long videos, but negligible for standard 2–5 minute Overwatch VOD clips. | ✅ Low friction; restarting a 3-minute clip takes minimal effort. |
| **History Cleanliness** | ❌ **Noisy**: Aborted previews, accidental clicks, or tab closures leave dangling `"IN_PROGRESS"` records forever. | ✅ **Clean**: Performance history represents intentional, completed training assessments. |
| **Analytics Accuracy** | ❌ Polluted with partial completion stats and unattempted question penalties. | ✅ Unbiased metrics representing true player decision speed and accuracy. |
| **Mental Model** | Similar to a video bookmark (unnecessary for short drills). | Matches standard tactical trainers (Aim Lab, Chess.com Puzzles, Duolingo lessons). |

---

## 3. Technical & Architectural Comparison

### Option A: Retain and Complete Full In-Progress Resumption
To make resumption functional, the codebase would require:
1. **State Hydration Loader**: Query existing `attempt_record` rows for a `playthroughId`, find the highest completed scenario index, and determine media resume timestamp.
2. **Coordinator Enhancements**: Initialize `sessionPlaythroughCoordinator` at arbitrary `activeScenarioIndex` with pre-filled `attempts` array.
3. **Media Synchronization**: Command the YouTube iframe player to seek to an offset timestamp (e.g. 5 seconds before the next prompt) rather than starting from 0.
4. **Staleness / Drift Invalidation**: Handle situations where the VOD's scenarios were modified/reordered after the partial run started.
5. **Garbage Collection**: Background worker or scheduled cron to expire / prune abandoned in-progress playthroughs older than $N$ days.

**Complexity**: **High**. Ongoing maintenance burden for edge cases across media players and database sync.

---

### Option B: Discrete / Stateless Session Attempts (Recommended)
Treat each training run as an atomic, standalone trial:
1. **Deferred or Atomic Persistence**:
   - Keep in-memory session state during the run.
   - Persist the `playthrough`, `playthrough_completion`, `scenario_snapshots`, and `attempt_records` either in a single batch upon session completion, OR persist attempts with an ephemeral flag.
2. **Clean History Filtering**:
   - Query only completed playthroughs in `/history` (`status = 'COMPLETED'`), eliminating the misleading `"IN_PROGRESS"` filter and orphan records.
3. **Simplified Coordinator & Hook**:
   - Remove redundant resumption logic and query parameter handling from route loaders.

**Complexity**: **Low**. Highly robust, eliminates zombie records, and aligns with player expectations.

---

## 4. Architectural Decision Record (ADR Candidate)

### Context
Watchpoint's core loop involves short (2–5 minute) video scenarios evaluating tactical decision-making and mechanical reaction time. Previous designs (ADR-0007, ADR-0009) provisioned an `"IN_PROGRESS"` status for playthroughs, but actual runtime resumption was never implemented, leaving zombie rows in D1 and broken "Continue Training" links in the UI.

### Decision
1. **Adopt Discrete Session Architecture**: Training runs are treated as discrete, atomic attempts. Incomplete runs will not be tracked as resumable sessions in player-facing performance history.
2. **Filter Out Incomplete Sessions in `/history`**: The `/history` page will only query and display `COMPLETED` playthroughs.
3. **Streamlined Playthrough Lifecycle**:
   - Session initialization will not produce dangling resumable state.
   - "Continue Training" CTAs on partial history records will be removed.
   - Overall aggregate accuracy and latency calculations will strictly reflect completed session sets.

### Consequences
- **Positive**:
  - Eliminates D1 database bloat from abandoned sessions.
  - Fixes skew in player performance stats and accuracy metrics.
  - Simplifies `session-playthrough-coordinator` and loader contracts.
  - Avoids building complex video seek-synchronization logic for negligible UX gain.
- **Negative**:
  - A user who closes their browser with 1 scenario remaining will need to start that 3-minute clip over if they want it recorded in their history. Given the brevity of clips, this is standard and expected for competitive drill tools.

---

## 5. Implementation Roadmap for Future Issue

1. **Database & Queries**:
   - Update `getHistoryRule` default filter to strictly query `status: "COMPLETED"`.
   - Deprecate the `"IN_PROGRESS"` tab and filter pill in `HistoryFilterBar` and `HistoryPage`.
2. **Session Loader & Navigation**:
   - Remove `playthroughId` from `SessionSearch` query parameters in `vods-id-session`.
   - Ensure every new run creates a fresh generation without conflict.
3. **Data Cleanup**:
   - Migration or cleanup task to archive/remove legacy uncompleted playthrough records from D1.
