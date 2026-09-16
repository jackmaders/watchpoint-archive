# Research Evaluation: Enforcing Minimum Scenario Quotas per Module

**Issue**: [#440](https://github.com/jackmaders/watchpoint/issues/440)  
**Status**: Completed  
**Author**: Antigravity  
**Date**: 2026-09-16  

---

## Executive Summary

This research report evaluates whether enforcing a platform rule requiring every published VOD to contain a minimum scenario quota (e.g., at least 2 scenarios per core module: Strategy, Tactics, Tracking/Ultimate/Cooldown, Spatial Awareness) simplifies the player experience by eliminating the need for manual pre-session module filter pills.

### Key Finding & Verdict
**Recommendation: DO NOT enforce minimum scenario quotas as a publishing requirement. Keep dynamic pre-session module filtering.**

Enforcing rigid scenario quotas per module introduces severe content authoring bottlenecks and artificial content padding in `src/widgets/admin-vod-editor`, while reducing user agency for players targeting specific game-sense weaknesses (User Story 2 in [docs/specifications/v1-spec.md](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-minimum-scenario-quotas-per-module/docs/specifications/v1-spec.md)). Instead, retaining flexible dynamic module filtering alongside optional authoring composition suggestions provides the optimal balance of authoring velocity, match-authentic scenario curation, and player flexibility.

---

## 1. Content Authoring Burden

### 1.1 Creator & Admin Friction
- **Match-Authentic Variance**: Overwatch 2 matches and fight dynamics naturally vary. Certain VODs (e.g., poke/sniper duels or specific map geometries like Circuit Royal) offer abundant positional strategy moments but fewer rapid 3-second tactical opportunities or flank-spotting scenarios. Requiring minimum quotas across every module forces authors to manufacture artificial or low-quality scenarios simply to satisfy publication gates.
- **Authoring Throughput**: Requiring at least 2 scenarios across 4–5 modules mandates 8–10 scenarios per VOD. For short team fights or round-specific VODs (10–15 minutes), curating and verifying 10 high-fidelity scenarios significantly inflates curation time from ~15 minutes to over 45 minutes per VOD.

### 1.2 Impact on Scenario Authoring Tools (`src/widgets/admin-vod-editor`)
- **Current Architecture**: The publishing validation gate in [src/widgets/admin-vod-editor/model/validation.ts](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-minimum-scenario-quotas-per-module/src/widgets/admin-vod-editor/model/validation.ts) (`validateVodForPublishing`) validates that a VOD has at least one valid scenario and that timestamps do not exceed video duration.
- **Quota Lockouts**: If publishing is blocked unless $\ge 2$ scenarios exist per module:
  - Drafts cannot be published incrementally.
  - VODs tailored for specific training focuses (e.g., a "Tactical Target Focus Masterclass" containing 6 Tactics scenarios and 0 Spatial scenarios) would be disqualified from publication.
  - The UI state in [src/widgets/admin-vod-editor/ui/publication-status-control.tsx](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-minimum-scenario-quotas-per-module/src/widgets/admin-vod-editor/ui/publication-status-control.tsx) would display frustrating block errors rather than helpful curation guidance.

---

## 2. Player Value vs. Flexibility

### 2.1 Targeted Deliberate Practice
- **User Story 2 Alignment**: Per [docs/specifications/v1-spec.md](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-minimum-scenario-quotas-per-module/docs/specifications/v1-spec.md), a primary user story is:
  > *"As a player, I want to filter active scenario modules (e.g. toggle on Ultimate Tracking and Cooldowns only) before launching playback, so that I can target specific weaknesses in my gameplay."*
- **Deliberate Practice Principles**: Motor learning and game sense development benefit heavily from isolated drill blocks (e.g., a support player dedicating a 30-minute session exclusively to tracking enemy ultimate charge timings or cooldown windows). Eliminating filter pills deprives players of targeted training mode.

### 2.2 Variety vs. Redundancy
- Guaranteed module variety within a full match is beneficial for players seeking a comprehensive "full simulation" experience.
- However, module filter pills already default to selecting all available modules (see [src/entities/vod/ui/module-filter-pills.tsx](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-minimum-scenario-quotas-per-module/src/entities/vod/ui/module-filter-pills.tsx) and [src/entities/vod/model/module-filter.ts](file:///home/jackw/.herdr/worktrees/watchpoint/research-evaluate-minimum-scenario-quotas-per-module/src/entities/vod/model/module-filter.ts)). Players who want full-match variety get it by default with zero clicks, while players needing targeted practice retain the agency to deselect modules.

---

## 3. Comparison Matrix

| Dimension | Mandatory Scenario Quotas ($\ge 2$ per module) | Dynamic Module Filtering (Current Architecture) |
| :--- | :--- | :--- |
| **Publishing Velocity** | 🔴 Low (requires 8–10 scenarios per VOD) | 🟢 High (allows flexible/focused VODs) |
| **Content Authenticity** | 🟡 Risk of artificial filler scenarios | 🟢 Curators only create meaningful pause points |
| **Focused Drills** | 🔴 Impossible without client-side filters | 🟢 Fully supported via pre-session filter pills |
| **Full-Match Variety** | 🟢 Guaranteed | 🟢 Default behavior (all modules active by default) |
| **Admin Complexity** | 🔴 High validation errors in admin editor | 🟢 Clean, permissive publishing gate |

---

## 4. Recommendations & Next Steps

1. **Retain Dynamic Module Filtering**: Keep the pre-session module filter pills (`ModuleFilterPills`) and URL query param serialization (`serializeModulesParam`) as specified in the V1 design and domain glossary.
2. **Implement Admin Authoring Suggestions (Non-blocking)**:
   - Rather than hard validation errors that block publishing, introduce informational composition badges in `src/widgets/admin-vod-editor/ui/scenario-timeline.tsx` or `publication-status-control.tsx` indicating module distribution (e.g., *"Well-Balanced VOD: contains 2+ scenarios across all active modules"*).
3. **Enhance Catalog Badging**:
   - Surface module distribution tags on the VOD catalog cards so players looking for specific drill profiles or balanced playlists can identify them instantly.

---

## Sources

- [docs/specifications/v1-spec.md](file:///home/jackw/.herdr/worktrees/watchpoint/docs/specifications/v1-spec.md) — Watchpoint V1 Interactive Learning Platform Specification
- [CONTEXT.md](file:///home/jackw/.herdr/worktrees/watchpoint/CONTEXT.md) — Watchpoint Domain Glossary & Ubiquitous Language
- [src/widgets/admin-vod-editor/model/validation.ts](file:///home/jackw/.herdr/worktrees/watchpoint/src/widgets/admin-vod-editor/model/validation.ts) — Admin VOD & Scenario Validation Rules
- [src/entities/vod/ui/module-filter-pills.tsx](file:///home/jackw/.herdr/worktrees/watchpoint/src/entities/vod/ui/module-filter-pills.tsx) — Pre-Session Module Filter UI Component
- [src/entities/vod/model/module-filter.ts](file:///home/jackw/.herdr/worktrees/watchpoint/src/entities/vod/model/module-filter.ts) — Session URL & Module Filter Serialization
