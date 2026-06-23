# TODO

### pi_snake
1. [ ] Verifiable Pi Snake run protocol
   - [ ] Define the claim precisely: prove a legal deterministic run, not whether a human played it live.
   - [ ] Freeze a versioned ruleset, board size, tick model, collision rules, and seeded PRNG specification.
   - [ ] Define a canonical challenge token containing a random nonce, food seed, GitHub actor, ruleset hash, issue time, and expiry.
   - [ ] Sign the challenge token in GitHub Actions; never place the signing secret in browser code.
   - [ ] Export a canonical replay containing tick-numbered direction changes, not a claimed score.
   - [ ] Build an independent verifier that reconstructs every state transition and rejects illegal reversals, collisions, invalid food, or score mismatches.
   - [ ] Check invariants on every tick: in-bounds cells, unique snake cells, adjacent body segments, food disjoint from the snake, and length = initial length + score.
   - [ ] Reject invalid signatures, actor mismatches, expiry, ruleset mismatches, and previously spent nonces.
   - [ ] Keep a browser verifier for transparency, but treat only the GitHub Action verdict as authoritative.
   - [ ] Add adversarial tests for edited scores, truncated/reordered inputs, replay reuse, forged seeds, and concurrent nonce spending.

2. [ ] Reachability and formal-methods note
   - [ ] Publish a constructive Hamiltonian-cycle witness for the 18×18 board, proving score 314 is reachable and the theoretical maximum is 321.
   - [ ] Specify the transition system and safety invariants independently of the UI.
   - [ ] Optionally encode bounded runs in SAT/SMT for model checking or counterexample generation; keep concrete replay verification as deterministic simulation.

3. [ ] Verified leaderboard integration
   - [ ] Request a one-time challenge through a GitHub Issue.
   - [ ] Submit the signed token and replay to the same Issue.
   - [ ] Run the standalone verifier in GitHub Actions.
   - [ ] Mark the nonce as spent only after successful verification.
   - [ ] Serialize updates and rebuild the static leaderboard only from verified results.
