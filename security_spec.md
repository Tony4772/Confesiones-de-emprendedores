# Security Specification — Confesiones de Emprendedores

## 1. Data Invariants
1. **Strict Schema Integrity**: Every document in `/confessions/{confessionId}` must contain only `category`, `businessType`, `body`, `reactionCounts`, `commentCount`, and `createdAt`, with strict enum and length checks (`body` 1..600 chars).
2. **Temporal Integrity & Immutability**: `createdAt` must equal `request.time` on creation and can never change on update. `body`, `category`, and `businessType` are immutable after creation.
3. **Zero Unauthenticated Deletes / Overwrites**: No client may delete confessions or comments (`allow delete: if false`).
4. **Master Gate & Atomic Comment Counter**: A comment in `/confessions/{confessionId}/comments/{commentId}` cannot exist without an existing parent confession, must match `confessionId`, must be <= 280 chars, and must atomically increment parent `commentCount` by exactly `1`.
5. **Bounded Reaction Updates**: Updating `reactionCounts` may only alter reaction counters by `-1`, `0`, or `+1` per write and cannot touch any other field.
6. **Query Scraping Guard**: Collection `list` queries are capped (`limit <= 100` for confessions, `limit <= 500` for comments) and IDs must match `^[a-zA-Z0-9_\-]+$` (<= 128 chars).

## 2. The "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Shadow Field on Confession**: Creating a confession with extra field `isAdmin: true`.
2. **Oversized Body**: Creating a confession with `body` length > 600 chars.
3. **Invalid Category Enum**: Creating a confession with `category: "ArbitraryCategory"`.
4. **Backdated Timestamp**: Creating a confession with client-supplied `createdAt` != `request.time`.
5. **Non-Zero Initial Comment Count**: Creating a confession with `commentCount: 500`.
6. **ID Poisoning**: Creating `/confessions/bad$id!with*chars` or a 200-char document ID.
7. **Mutating Confession Body on Update**: Updating `body` on an existing confession.
8. **Reaction Count Inflation**: Updating `reactionCounts.fire` by `+100` in one write.
9. **Orphan Comment**: Creating a comment under `/confessions/non-existent-id/comments/c-1`.
10. **Non-Atomic Comment**: Creating a comment without incrementing parent `commentCount` in the same batch.
11. **Oversized Comment**: Creating a comment with `text` length > 280 chars or invalid avatar pattern.
12. **Unbounded List Query**: Querying `/confessions` without a `limit <= 100`.
