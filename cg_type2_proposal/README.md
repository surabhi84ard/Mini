# UL Configured Grant Type 2 in OCUDU: implementation proposal

- `CG_Type2_Implementation_Proposal.docx` / `.pdf`: the proposal. It covers the current state, the 14 places that assume Type 1, the parameters, per-file and per-function changes, colour-coded block diagrams, design decisions, the plan and the risks.
- `figures/`: the four diagrams (configuration path, activation/release path, periodic-occasion path, lifecycle sequence).
- `source/`: scripts that regenerate the figures (`python3 figN.py`, needs matplotlib) and the document (`node build.js <out.docx>`, needs the `docx` npm package).

Code references point to OCUDU commit `6153e7bf2`.
