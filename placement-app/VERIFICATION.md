# Verification Steps — Placement Readiness Platform

## Proof & Submission

### Proof page and URL validation
1. Go to **/prp/proof** (or use **Proof & Submit** in the sidebar).
2. **Step Completion Overview:** Toggle steps between Completed/Pending; state persists in localStorage.
3. **Artifact Inputs:** Enter invalid text (e.g. `not-a-url`) in any link field and blur → error: "Enter a valid http or https URL". Enter `https://example.com` → error clears.
4. Links are stored under `prp_final_submission` in localStorage.

### Shipped status only when all conditions met
- **In Progress** when any of: 8 steps not all completed, or 10 test checklist items not all passed, or any of the 3 proof links missing.
- **Shipped** only when: all 8 steps completed + all 10 checklist items passed + all 3 proof links provided.
1. With anything incomplete → header badge shows "In Progress".
2. Complete all 8 steps on /prp/proof, all 10 on /prp/07-test, and fill all 3 proof links → badge shows "Shipped".

### Copy Final Submission
1. On /prp/proof, fill the 3 links (or leave blank).
2. Click **Copy Final Submission**.
3. Paste elsewhere → formatted block with Lovable Project, GitHub Repository, Live Deployment, and Core Capabilities list.

### Completion message
- When status is **Shipped**, the message appears on /prp/proof (bottom card) and on /prp/08-ship (top card):  
  "You built a real product. Not a tutorial. Not a clone. A structured tool that solves a real problem. This is your proof of work."

---

## Test Checklist & Ship Lock

### Checklist stored in localStorage and persists
1. Open **http://localhost:5180/prp/07-test** (or your dev URL).
2. Check a few items (e.g. 1, 2, 3).
3. Refresh the page — same items stay checked.
4. Close the tab, reopen /prp/07-test — checklist state should still be there.

### Ship is locked until checklist complete
1. Go to **/prp/08-ship**.
2. With fewer than 10 tests passed — page shows "Locked" and "Complete all 10 items on the Test Checklist before shipping." with a link to /prp/07-test.
3. Go to /prp/07-test, check all 10 items.
4. Go back to /prp/08-ship — page shows "Ready to ship" (unlocked).

### Reset checklist
1. On /prp/07-test, check some items.
2. Click **Reset checklist** — all checkboxes clear.
3. Tests Passed shows 0 / 10.

---

## Data Model & Validation (Hardening)

### Schema consistency
- Every saved entry has: id, createdAt, updatedAt, company, role, jdText, extractedSkills (coreCS, languages, web, data, cloud, testing, other), roundMapping, checklist, plan7Days, questions, baseScore, skillConfidenceMap, finalScore.
- Old entries are normalized on load.

### Input validation
1. Go to **Analyze JD**.
2. Leave JD empty → Analyze button disabled.
3. Paste JD with < 200 chars → Warning: "This JD is too short to analyze deeply. Paste full JD for better output."
4. Analyze still allowed (validation is advisory).

### Default when no skills detected
1. Paste JD with no keywords (e.g. "We hire freshers").
2. Analyze.
3. Verify: Key Skills shows "Other" with Communication, Problem solving, Basic coding, Projects.
4. Plan, checklist, questions should reflect generic fresher prep.

### Score stability
- baseScore: computed only at analyze, never changes.
- finalScore: baseScore + skill toggles (+2 know, -2 practice).
- Toggle skills → finalScore and updatedAt persist to history.

### History robustness
1. Open DevTools → Application → Local Storage.
2. Corrupt one entry (e.g. change `"jdText": "..."` to `"jdText": 123`).
3. Refresh, go to History.
4. Verify: "One saved entry couldn't be loaded. Create a new analysis." appears.
5. Valid entries still display.

---

## Company Intel + Round Mapping

### Company intel renders correctly
1. Analyze a JD with company name (e.g. "Amazon", "Infosys", "TechCorp").
2. Go to Results.
3. Verify Company Intel card shows: Company name, Industry, Estimated size, Typical Hiring Focus.
4. For Amazon/Infosys/TCS → Size should be "Enterprise (2000+)".
5. For unknown company (e.g. "TechCorp") → Size should be "Startup (<200)".
6. Verify "Demo Mode: Company intel generated heuristically." note appears.

### Round mapping changes based on company + skills
1. **Enterprise + DSA**: Company = "Amazon", JD includes "DSA", "React" → Expect 4 rounds: Online Test (DSA + Aptitude), Technical (DSA + Core CS), Tech + Projects, HR.
2. **Startup + Web**: Company = "TechCorp", JD includes "React", "Node.js" → Expect 3 rounds: Practical Coding, System Discussion, Culture Fit.
3. **Enterprise, no DSA**: Company = "Infosys", JD has no DSA → Expect 4 rounds with Aptitude/Screening focus.
4. Verify "Why this round matters" appears under each round.

### Test scenarios
| Company   | JD Keywords        | Expected Size   | Round Count |
|-----------|--------------------|----------------|-------------|
| Amazon    | DSA, React         | Enterprise     | 4           |
| Infosys   | Java, SQL          | Enterprise     | 4           |
| TechCorp  | React, Node.js     | Startup        | 3           |
| Acme Labs | Python, MongoDB   | Startup        | 3           |

---

## Interactive Results (v2)

### Live score
1. Run an analysis, go to Results.
2. Note the base readiness score.
3. Click a skill tag to toggle "I know this" / "Need practice".
4. Score should update in real time: +2 per "know", -2 per "practice".
5. Score stays within 0–100.

### Toggles persist after refresh
1. Run an analysis, go to Results.
2. Toggle several skills to "I know this".
3. Refresh the page (F5).
4. Toggles should still show "I know this".
5. Score should be the same as before refresh.

### Export
1. On Results, click "Copy 7-day plan" → paste elsewhere; plan content should appear.
2. Click "Copy round checklist" → paste; checklist content should appear.
3. Click "Copy 10 questions" → paste; questions should appear.
4. Click "Download as TXT" → a .txt file should download with all sections.

### Action Next
1. On Results, scroll to "Action Next" box.
2. With default skills (all "Need practice"), it should show top 3 weak skills and "Start Day 1 plan now."
3. Mark all skills as "I know" → message should change to "All skills marked as known. Keep revising and stay confident."

---

## 1. Skill Extraction

1. Go to **Dashboard** → **Analyze JD**
2. Paste this sample JD:

```
We are hiring a Full Stack Developer at TechCorp.

Requirements:
- Strong DSA and problem-solving skills
- Experience with React, Node.js, and REST APIs
- Proficiency in SQL, MongoDB, and PostgreSQL
- Knowledge of AWS, Docker, and Kubernetes
- Familiarity with Java or Python
- Understanding of OOP, DBMS, and OS concepts
- Experience with JUnit and Selenium for testing
```

3. Click **Analyze**
4. On Results page, verify:
   - **Key Skills Extracted** shows tags grouped by: Core CS, Languages, Web, Data, Cloud/DevOps, Testing
   - DSA, OOP, DBMS, OS, React, Node.js, REST, SQL, MongoDB, PostgreSQL, AWS, Docker, Kubernetes, Java, Python, JUnit, Selenium appear

## 2. Readiness Score

Using the same JD:
- Base: 35
- +5 per category (6 categories) = +30 → 65
- +10 if company provided (e.g. "TechCorp") → 75
- +10 if role provided (e.g. "Full Stack Developer") → 85
- +10 if JD length > 800 chars → 95 (if JD is long enough)

Verify the score matches the formula.

## 3. History Persistence

1. After analyzing, go to **History**
2. You should see the entry with date, company, role, score
3. Click the entry → opens **Results** with that analysis
4. Refresh the page (F5) → Results should still show the same data
5. Close the browser, reopen, go to History → entry should still be there (localStorage)

## 4. Empty JD (General Fresher Stack)

1. Paste empty or very short JD with no keywords (e.g. "Looking for freshers")
2. Analyze
3. Verify: **Key Skills** shows "General fresher stack"

## 5. Offline

- Disconnect from internet
- App should work (no external APIs)
- Analyze, save, view history — all should work offline
