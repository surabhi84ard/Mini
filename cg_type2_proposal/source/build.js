const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType,
  HeadingLevel, ImageRun, PageOrientation, Footer, Header, PageNumber, LevelFormat, BorderStyle, TableOfContents,
  PageBreak, VerticalAlign,
} = require("docx");

const FIG = path.join(__dirname, "..", "figures");
const FONT = "Calibri";
const MONO = "Consolas";
const NAVY = "1F3864";

// ---------- colours for action cells ----------
const ACT = {
  NEW: { fill: "DDF0D5", color: "2F6B1B" },
  MODIFY: { fill: "FFF1C9", color: "8A6508" },
  REMOVE: { fill: "F9D6D5", color: "A93226" },
  UNCHANGED: { fill: "EFEFEF", color: "555555" },
  VERIFY: { fill: "EDE6F6", color: "5B3F8C" },
  OUTPUT: { fill: "DCE9F7", color: "2E5C8A" },
};

// ---------- inline text parser: `code` and **bold** ----------
function runs(text, opts = {}) {
  const out = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0, m;
  const size = opts.size || 21;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), font: FONT, size, bold: opts.bold, italics: opts.italics, color: opts.color }));
    const tok = m[0];
    if (tok.startsWith("`")) {
      out.push(new TextRun({ text: tok.slice(1, -1), font: MONO, size: size - 2, color: opts.codeColor || NAVY, bold: opts.bold }));
    } else {
      out.push(new TextRun({ text: tok.slice(2, -2), font: FONT, size, bold: true, italics: opts.italics, color: opts.color }));
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), font: FONT, size, bold: opts.bold, italics: opts.italics, color: opts.color }));
  return out;
}
const P = (text, o = {}) => new Paragraph({ children: runs(text, o), spacing: { after: o.after ?? 120, before: o.before ?? 0, line: 276 }, alignment: o.align });
const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t })], spacing: { before: 280, after: 140 } });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t })], spacing: { before: 220, after: 100 } });
const H3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: t })], spacing: { before: 160, after: 80 } });
const B = (text, lvl = 0) => new Paragraph({ children: runs(text), numbering: { reference: "bul", level: lvl }, spacing: { after: 60, line: 264 } });
const N = (text, ref = "num") => new Paragraph({ children: runs(text), numbering: { reference: ref, level: 0 }, spacing: { after: 60, line: 264 } });
const CODE = (lines) => lines.map((l, i) => new Paragraph({
  children: [new TextRun({ text: l, font: MONO, size: 16, color: "222222" })],
  shading: { type: ShadingType.CLEAR, fill: "F4F6F8", color: "auto" },
  spacing: { after: i === lines.length - 1 ? 140 : 0 },
  indent: { left: 120, right: 120 },
}));

// ---------- tables ----------
const border = { style: BorderStyle.SINGLE, size: 4, color: "B7C2D0" };
const borders = { top: border, bottom: border, left: border, right: border };
function cell(content, width, o = {}) {
  let paras;
  if (Array.isArray(content)) paras = content;
  else {
    const txt = String(content ?? "");
    const act = o.action && ACT[txt.split(" ")[0]];
    paras = txt.split("\n").map((line) => new Paragraph({
      children: act ? [new TextRun({ text: line, font: FONT, size: 15, bold: true, color: act.color })]
        : runs(line, { size: o.size || 17, bold: o.bold, color: o.color, codeColor: o.header ? "FFFFFF" : NAVY }),
      spacing: { after: 20, line: 240 }, alignment: o.align,
    }));
  }
  let fill = o.fill;
  if (o.action) { const a = ACT[String(content).split(" ")[0]]; if (a) fill = a.fill; }
  return new TableCell({
    children: paras, width: { size: width, type: WidthType.DXA }, borders,
    shading: fill ? { type: ShadingType.CLEAR, fill, color: "auto" } : undefined,
    margins: { top: 50, bottom: 50, left: 90, right: 90 }, verticalAlign: o.valign || VerticalAlign.TOP,
    columnSpan: o.span,
  });
}
function table(headers, rows, widths, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const trs = [new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, widths[i], { header: true, bold: true, color: "FFFFFF", fill: o.headFill || NAVY, size: 17 })),
  })];
  rows.forEach((r, ri) => {
    if (r.group) {
      trs.push(new TableRow({ children: [cell(r.group, total, { span: headers.length, bold: true, fill: "E3E9F2", size: 17 })] }));
      return;
    }
    trs.push(new TableRow({
      children: r.map((c, i) => cell(c, widths[i], {
        action: o.actionCol === i, fill: o.zebra && ri % 2 ? "F8FAFC" : undefined,
        size: o.size,
      })),
    }));
  });
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, rows: trs });
}
const gap = (after = 120) => new Paragraph({ children: [], spacing: { after } });
function callout(title, lines, fill = "EEF3FA", edge = "2E5C8A") {
  const w = 9602;
  const b = { style: BorderStyle.SINGLE, size: 4, color: fill };
  return new Table({
    width: { size: w, type: WidthType.DXA }, columnWidths: [w],
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: w, type: WidthType.DXA },
        borders: { top: b, bottom: b, right: b, left: { style: BorderStyle.SINGLE, size: 24, color: edge } },
        shading: { type: ShadingType.CLEAR, fill, color: "auto" },
        margins: { top: 100, bottom: 100, left: 180, right: 160 },
        children: [
          new Paragraph({ children: [new TextRun({ text: title, bold: true, font: FONT, size: 21, color: edge })], spacing: { after: 60 } }),
          ...lines.map((l) => new Paragraph({ children: runs(l, { size: 20 }), spacing: { after: 50, line: 264 } })),
        ],
      })],
    })],
  });
}
function figure(file, widthIn, heightIn, caption) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({ type: "png", data: fs.readFileSync(path.join(FIG, file)), transformation: { width: Math.round(widthIn * 96), height: Math.round(heightIn * 96) }, altText: { title: caption, description: caption, name: file } })],
      spacing: { after: 60 },
    }),
    P(caption, { italics: true, size: 18, align: AlignmentType.CENTER, after: 0 }),
  ];
}

// =====================================================================================================
// CONTENT
// =====================================================================================================
const W = 9602; // portrait content width (A4, 0.8" margins)

const titleBlock = [
  new Paragraph({ children: [new TextRun({ text: "UL Configured Grant Type 2 in OCUDU", font: FONT, size: 44, bold: true, color: NAVY })], spacing: { after: 80 } }),
  new Paragraph({ children: [new TextRun({ text: "Implementation proposal: current state, required changes, parameters and block diagrams", font: FONT, size: 26, color: "44546A" })], spacing: { after: 240 } }),
  table(["Item", "Value"], [
    ["Document", "CG Type 2 implementation proposal, version 2 (supersedes \"UL Configured Grant Type 2: Parameter Inventory and DCI 0_1 Integration Proposal\")"],
    ["Code baseline", "OCUDU `6153e7bf2` (2026-08-25, \"cmake: fix AOCL-FFTZ library find instructions\"). All file:line references point to this commit."],
    ["Author", "Surabhi P"],
    ["Date", "24 September 2026"],
    ["Status", "Design proposal. No code has been written; every claim about the current code was checked against the source at the baseline commit."],
    ["Spec references", "TS 38.321 §5.4.1, §5.8.2, §6.1.3.7 · TS 38.213 §10.2 · TS 38.212 §7.3.1.1.2 · TS 38.214 §6.1.2 · TS 38.331 ConfiguredGrantConfig"],
  ], [2000, W - 2000]),
  gap(160),
  callout("Colour code used in every table and diagram", [
    "**NEW**: code that does not exist and must be written.   **MODIFY**: existing function or struct that must change.",
    "**REMOVE**: an existing Type-1-only guard or assert that must be deleted or relaxed.   **UNCHANGED**: existing code that Type 2 reuses as-is.",
    "**VERIFY**: outside OCUDU (the OAI UE) or needs confirmation before relying on it.   **OUTPUT**: result objects and hand-off points.",
  ]),
];

// ---------------- 1. Executive summary ----------------
const sec1 = [
  H1("1. Executive summary"),
  P("OCUDU already has a working UL Configured Grant (CG) **Type 1** implementation, in which the whole grant comes from RRC. This document proposes how to add **Type 2**, where RRC sends only the semi-static part (periodicity, HARQ count, DMRS, MCS table) and the gNB activates or releases the grant with a DCI format 0_1 whose CRC is scrambled by the CS-RNTI. The proposal was built by reading the code at the baseline commit, not only the earlier draft."),
  B("**No new DCI bit-fields.** `dci_0_1_configuration` and `dci_0_1_pack()` (dci_packing.h:780, :953) stay unchanged. Activation and release reuse the existing fields with the reserved values from TS 38.213 §10.2."),
  B("**No new RRC field.** `cg_configuration` already treats an absent `rrc_configured_ul_grant_cfg` as Type 2, and the ASN.1 encoder (asn1_rrc_config_helpers.cpp:2951) already omits `rrc-ConfiguredUplinkGrant` when it is absent. CS-RNTI allocation (mac_controller.cpp:109) is already type-agnostic."),
  B("**The work is larger than the first draft said.** It is not \"one new function plus one branch\". The code has **14 places that assume Type 1** (Section 4.2), including three that would crash a Type 2 UE. The full plan touches about 30 source files: **12 new** symbols, **27 modified**, **3 Type-1 guards removed**, and **16 existing pieces reused unchanged** (Section 6.5)."),
  B("**Three blockers the first draft missed.** (1) `build_pusch_cs_rnti()` asserts that the RRC grant exists (sch_pdu_builder.cpp:680). (2) Five CG-scheduler functions dereference `rrc_configured_ul_grant_cfg.value()`. (3) The CG scheduler has no PDCCH allocator, so it cannot send an activation DCI at all."),
  B("**Recommended approach.** Keep the existing Type 1 resource planning (`cg_type1_res_mng` picks an offset and VRBs) and store the Type 2 grant as a DU-internal template. Send the activation DCI in a slot where `(n + k2) mod P` equals the planned offset. Route every grant read through one new helper, `get_active_grant()`, so the periodic-occasion code serves both types."),
  B("**Delivery in five phases** (Section 9). Phase 0 is a behaviour-neutral refactor that can merge on its own. The main external risk is whether the OAI UE supports Type 2; check that before end-to-end testing."),
  H2("1.1 Corrections to the first draft"),
  P("Each point below was checked against the source at `6153e7bf2`."),
  table(["First draft said", "What the code shows", "Consequence"], [
    ["`build_pusch_cs_rnti()`: no change expected", "Line 680 asserts `cg_cfg.rrc_configured_ul_grant_cfg.has_value()` with message \"RRC-ConfiguredUplinkGrant for CG type 1 not set\".", "Every Type 2 occasion would hit the assert. The assert must be relaxed (I4)."],
    ["The scheduler change is one added branch in `add_ue_to_wheel()`", "`rem_ue()`, `reserve_cg_resources()`, `build_cg_pusch_cfg_params()`, `allocate_cg_opportunity()` and `compute_cg_vrbs()` all read the RRC grant directly.", "Add `get_active_grant()` and route all five through it (H4, H5, I1, I2)."],
    ["Add one enum entry `cs_rnti_f0_1` in dci_info.h", "`dci_ul_info::type()` returns `payload.index()`, so the enum must match a variant alternative. `dci_0_1_configuration` is already one alternative, and adding the same type twice breaks `std::get<T>`.", "Add a distinct wrapper type (for example `dci_0_1_cs_rnti_configuration`) and update `encode_dci()`, the logger and the RNTI-type strings (F4, F5)."],
    ["`nof_cg_reserved` gating is a bug", "`ue_cell::handle_reconfiguration_request()` reserves CG HARQs for any CG. `update_harq_reservation()` then resets the count to 0 when there is no RRC grant. This is a deliberate Type-1-only guard, consistent with the header remark \"Type 2 CG is not currently supported\".", "Not a defect in today's Type-1-only build, but it blocks Type 2. Drop the guard as part of this work (D3)."],
    ["Not covered", "The config validator rejects Type 2 (scheduler_ue_config_validator.cpp:29). The factory and resource manager always build or assert the RRC grant. There is no CLI option to select the type.", "Configuration-path changes A1–A4, B2, B3, B5, C1 and C2."],
    ["Not covered", "LCID 55 (CG Confirmation MAC CE) has no enum entry. The PDU still parses because the CE is zero-length, but `handle_mac_ce()` logs \"Unhandled LCID\" and drops it.", "The gNB cannot tell whether activation or release took effect (G2–G5)."],
    ["Not covered", "`is_cg_slot()` (ue_configuration.cpp:743) says \"TODO: support type 2\" and only checks config.", "Dynamic PUSCH would not be kept out of Type 2 occasions (J1, J2)."],
    ["Not covered", "`alloc_ul_pdcch_ue()` uses its `rnti` argument both as the CRC RNTI and for n_RNTI data scrambling (TS 38.211 §7.3.2.3 requires C-RNTI there).", "The activation PDCCH must keep C-RNTI for scrambling and use CS-RNTI only for the CRC (F1)."],
  ], [2500, 4000, 3102]),
];

// ---------------- 2. Background ----------------
const sec2 = [
  H1("2. Background: how CG Type 2 works (3GPP)"),
  H2("2.1 Type 1 compared with Type 2"),
  table(["Aspect", "Dynamic grant", "CG Type 1", "CG Type 2"], [
    ["Where the grant comes from", "A DCI 0_0/0_1 (C-RNTI) for every PUSCH", "RRC `rrc-ConfiguredUplinkGrant`", "RRC semi-static part plus one activation DCI 0_1 (CS-RNTI)"],
    ["Start of occasions", "k2 after each DCI", "`timeDomainOffset` relative to SFN 0", "The PUSCH slot indicated by the activation DCI (n + k2)"],
    ["Stop", "n/a", "RRC reconfiguration", "Release DCI (CS-RNTI) or RRC reconfiguration"],
    ["Grant fields (TDRA, FDRA, MCS, antenna ports)", "Every DCI", "RRC", "Activation DCI, then fixed until re-activation"],
    ["HARQ process ID", "Scheduler chooses one", "floor(CURRENT_symbol / P) mod nrofHARQ-Processes", "Same formula"],
    ["UE acknowledgement", "n/a", "none", "CG Confirmation MAC CE (LCID 55) after activation and after release"],
    ["OCUDU status at baseline", "Works (logs in Section 3.1)", "Works", "Not supported (\"Type 2 CG is not currently supported\", cg_configuration.h)"],
  ], [2000, 2300, 2300, 3002]),
  H2("2.2 Activation and release validation (TS 38.213 §10.2)"),
  P("The UE treats a DCI 0_1 as an activation or release only if the CRC is scrambled by CS-RNTI, NDI = 0, and the special fields below have these values. With a single CG configuration, Tables 10.2-3 and 10.2-4 apply:"),
  table(["DCI 0_1 field", "Activation (Table 10.2-3)", "Release (Table 10.2-4)", "Notes"], [
    ["CRC scrambling", "CS-RNTI", "CS-RNTI", "With NDI = 1 and CS-RNTI, the DCI would instead be a retransmission grant for a CG HARQ process. OCUDU does not use that (see Risk R4)."],
    ["new_data_indicator", "0", "0", "Validation field"],
    ["harq_process_number", "all '0'", "all '0'", "Validation field when only one CG configuration exists"],
    ["redundancy_version", "'00'", "'00'", "Validation field"],
    ["modulation_coding_scheme", "CG MCS (becomes the fixed MCS)", "all '1' (31)", ""],
    ["frequency_resource", "RIV of the CG VRBs (RA type 1)", "all '1'", "RA type 1 is the only type OCUDU CG supports"],
    ["time_resource, antenna_ports, precoding, DMRS init", "Grant values, stored by the UE", "Ignored", "Set to template values on release for determinism"],
  ], [2200, 2300, 2000, 3102]),
  H2("2.3 Timing, HARQ and confirmation (TS 38.321)"),
  B("**Occasions (§5.8.2).** The N-th occasion is at [(SFN × slotsPerFrame × symPerSlot) + (slot × symPerSlot) + symbol] = [(SFN_start × slotsPerFrame × symPerSlot + slot_start × symPerSlot + symbol_start) + N × P] mod (1024 × slotsPerFrame × symPerSlot). The _start values are those of the first PUSCH after (re)initialisation, which is the slot scheduled by the activation DCI. OCUDU's 5120-slot wheel is compatible: every allowed periodicity divides 5120, and 20480 slots per hyper-frame at 30 kHz is a multiple of 5120."),
  B("**HARQ ID (§5.4.1).** HARQ Process ID = floor(CURRENT_symbol / periodicity) mod nrofHARQ-Processes, the same for both types (no Rel-16 harq-ProcID-Offset2). The existing `get_harq_id()` (configured_grant_scheduler_impl.cpp:19) already implements it."),
  B("**configuredGrantTimer.** Applies to both types. OCUDU fixes it at 4 × P (`cg_configuration::configured_grant_timer`, used as `cg_harq_timeout`)."),
  B("**CG Confirmation MAC CE (§6.1.3.7).** UL-SCH LCID 55 (0b110111), zero payload. The UE triggers it on both activation and release and sends it in the next UL resource for new transmission, usually the first CG occasion."),
];

// ---------------- 3. Lab setup & evidence ----------------
const sec3 = [
  H1("3. Lab setup and baseline evidence"),
  table(["Parameter", "Value"], [
    ["gNB", "OCUDU (commit 6153e7bf2), single cell"],
    ["UE", "OAI nr-uesoftmodem, ZMQ device (oai_zmqdevif)"],
    ["Core network", "open5gs, Docker container open5gs_5gc"],
    ["PCI / Band / ARFCN", "1 / n78 / dl_arfcn = 632628 (3489.42 MHz)"],
    ["Bandwidth / SCS", "20 MHz, 30 kHz (51 PRB, numerology 1)"],
    ["Duplexing / Transport / Mode", "TDD / ZMQ RF simulation (no hardware) / Standalone, single UE"],
    ["Logging", "`log.mac_level: debug` enables both the MAC and SCHED loggers. UL grants appear as `format=0_1 type=c-rnti` lines."],
  ], [2600, W - 2600]),
  H2("3.1 Current dynamic-grant behaviour (SCHED debug log)"),
  ...CODE([
    "- UL PDCCH: rnti=0x4601 type=c-rnti cs_id=1 ss_id=2 format=0_1 cce=2 al=2 dci: h_id=0 ndi=0 rv=0 mcs=28 tpc=1 dai=3 mimo=0 ant=2",
    "- UL PDCCH: rnti=0x4601 type=c-rnti cs_id=1 ss_id=2 format=0_1 cce=2 al=2 dci: h_id=0 ndi=1 rv=0 mcs=28 tpc=1 dai=3 mimo=0 ant=2",
    "- UL PDCCH: rnti=0x4601 type=c-rnti cs_id=1 ss_id=2 format=0_1 cce=2 al=2 dci: h_id=0 ndi=0 rv=0 mcs=28 tpc=1 dai=3 mimo=0 ant=2",
  ]),
  table(["Observation", "Meaning", "Relevance to CG Type 2"], [
    ["h_id fixed at 0, ndi toggles", "One UL HARQ process in use, with clean new-transmission toggling", "CG HARQ IDs 0..N-1 are reserved for CG (`first_non_reserved_harq_id`), so dynamic grants move to IDs ≥ N once CG is configured"],
    ["mcs = 28, constant cce/al", "Stable link adaptation on the ZMQ channel", "Type 2 fixes the MCS at activation, with no OLLA afterwards (`handle_ul_crc_info()` skips OLLA for `is_cg()`)"],
    ["dai = 3, tpc = 1", "Fields that exist only inside a DCI", "Present on the activation DCI only. Periodic occasions carry no DCI."],
    ["mimo = 0, ant = 2", "1 layer, DMRS antenna-port row 2", "Captured once in the activation DCI (antenna_ports) and reused for every occasion"],
  ], [2400, 3000, 4202]),
  H2("3.2 Expected log after implementation (illustrative)"),
  P("These lines show the target format for the Phase 5 acceptance test. They are not captured output: the CS-RNTI value and slots are placeholders.", { italics: true, size: 19 }),
  ...CODE([
    "- UL PDCCH: rnti=<cs-rnti> type=cs-rnti ss_id=2 format=0_1 ... dci: act h_id=0 ndi=0 rv=0 mcs=5 ...",
    "- UL PUSCH: rnti=<cs-rnti> h_id=<floor(sym/P) mod N> ... cg=Yes            (at n+k2, then every P slots)",
    "- MAC: rnti=<c-rnti> CG Confirmation MAC CE received",
    "- UL PDCCH: rnti=<cs-rnti> type=cs-rnti ... dci: rel h_id=0 ndi=0 rv=0 mcs=31 ...",
  ]),
];

// ---------------- 4. Current state ----------------
const sec4 = [
  H1("4. What exists today (as-is)"),
  H2("4.1 Type 1 path, end to end"),
  N("**Configuration.** The CLI `cell_cfg.cg` (`periodicity_slots`, `mcs`, `nof_harq_processes`, `max_nof_cg_rbs`, `grant_size`/`requested_bitrate`) is translated into `cg_builder_params`. `make_default_cg_config()` (serving_cell_config_factory.cpp:261) always builds a `cg_configuration` with `rrc_configured_ul_grant_cfg`. `make_default_cell_cg_config()` (ran_cell_config_helper.cpp:444) picks the TDRA row that avoids SRS symbols."),
  N("**Per-UE resources.** In the DU manager, `cg_type1_res_mng::alloc_resources()` (cg_res_mng.cpp:124) picks the least-loaded offset within the period and a contiguous VRB block. It stores them in the DU-internal `ue_cg_config {cg_offset, vrbs}` and writes them into the RRC grant."),
  N("**RRC and MAC.** The ASN.1 helper encodes ConfiguredGrantConfig and rrc-ConfiguredUplinkGrant. The MAC controller allocates the CS-RNTI when `cs_rnti_requested` is set and maps it to the UE for PUSCH decoding."),
  N("**Scheduler set-up.** `ue_event_manager` calls `cg_sched->add_reconf_ue()` (ue_event_manager.cpp:397, :912). `add_ue_to_wheel()` pushes the C-RNTI into `periodic_pusch_slot_wheel` at `time_domain_offset + k × P` and caches the TBS. `update_harq_reservation()` reserves N CG HARQs."),
  N("**Every slot.** `ue_scheduler_impl` runs the CG scheduler before the fallback and slice schedulers. `run_slot()` pre-reserves CG RBs in the UL grid (`reserve_*`). `allocate_cg_opportunity()` then computes the HARQ ID with `get_harq_id()`, allocates the HARQ with a CG timeout, and calls `build_pusch_cs_rnti()` (is_cg = true, rnti = CS-RNTI, new_data = true). UCI is multiplexed onto the CG PUSCH."),
  N("**Feedback.** `ue_cell::handle_ul_crc_info()` treats a CRC failure with SINR below `cg_pusch_sinr_threshold_dB` as DTX and skips OLLA for CG. CG has no retransmissions (`nof_harq_retx = 0`)."),
  H2("4.2 Places that assume Type 1"),
  P("These are all the places at the baseline where a UE with `cg_cfg` present but `rrc_configured_ul_grant_cfg` absent is rejected, silently ignored or would crash."),
  table(["#", "Location (file:line)", "What it assumes", "Effect on a Type 2 UE today"], [
    ["1", "scheduler_ue_config_validator.cpp:29", "`VERIFY(... has_value(), \"Only Configured Grant type 1 supported\")`", "UE configuration rejected"],
    ["2", "serving_cell_config_factory.cpp:283-297", "`make_default_cg_config()` always emplaces the RRC grant", "No way to express Type 2"],
    ["3", "ran_cell_config_helper.cpp:455, :489", "Asserts in `make_default_cell_cg_config()` and `compute_nof_cg_prbs_per_ue()`", "Abort"],
    ["4", "cg_res_mng.cpp:164", "`ocudu_assert(... \"must be set for a Type 1 CG\")`", "Abort"],
    ["5", "configured_grant_scheduler_impl.cpp:72", "`update_harq_reservation()` reserves 0 HARQs without an RRC grant", "No CG HARQ pool"],
    ["6", "configured_grant_scheduler_impl.cpp:93", "`add_ue_to_wheel()` returns early", "Never scheduled"],
    ["7", "configured_grant_scheduler_impl.cpp:137", "`rem_ue()` returns early", "Harmless today; must mirror the new add path"],
    ["8", "configured_grant_scheduler_impl.cpp:34, :255, :284, :380", "`.value()` on the RRC grant in `compute_cg_vrbs`, `reserve_cg_resources`, `build_cg_pusch_cfg_params`, `allocate_cg_opportunity`", "Undefined behaviour or crash once the wheel is filled"],
    ["9", "sch_pdu_builder.cpp:680", "Assert in `build_pusch_cs_rnti()`", "Crash on the first occasion"],
    ["10", "ue_configuration.cpp:743", "`is_cg_slot()`: \"TODO: support type 2\"", "Dynamic PUSCH not kept out of Type 2 occasions"],
    ["11", "configured_grant_scheduler_impl.h:23", "Constructor takes no `pdcch_resource_allocator`", "Cannot send an activation DCI"],
    ["12", "dci_info.h:92 / mac_cell_processor.cpp:472", "No CS-RNTI UL DCI type; `encode_dci()` calls `ocudu_terminate` on unknown types", "Cannot build or encode the DCI"],
    ["13", "lcid_ul_sch.h / pdu_rx_handler.cpp:288", "No LCID 55 entry; default branch logs \"Unhandled LCID\"", "Confirmation ignored"],
    ["14", "cg_configuration.h:170", "Remark \"Type 2 CG is not currently supported\"", "Documentation only"],
  ], [400, 2700, 3400, 3102], { zebra: true }),
  H2("4.3 Already type-agnostic, reused as-is"),
  B("`cg_configuration` struct: periodicity, nof_harq_processes, DMRS, MCS table, UCI beta offsets and the CG timer are shared by both types."),
  B("ASN.1 ConfiguredGrantConfig encoder (asn1_rrc_config_helpers.cpp:2951): encodes rrc-ConfiguredUplinkGrant only if present."),
  B("CS-RNTI life-cycle in MAC (`mac_controller::handle_ue_reconfiguration_request()`, `rnti_manager`) and the CS-RNTI → UE mapping used to decode CG PUSCH."),
  B("`ue_cell::handle_reconfiguration_request()` reserves `nof_harq_processes` for any CG. `cell_harq_manager` handles CG allocation with `cg_harq_alloc_params` and the timeout."),
  B("`get_harq_id()`, `periodic_pusch_slot_wheel`, `reserve_updated_ues_resources()`, `reserve_slot_cg_resources()`, `validate_cg_opportunity()`."),
  B("`multiplex_uci_on_pusch()` (configured_grant = true), `ue_cell::handle_ul_crc_info()` (DTX detection, no OLLA for CG), and the PUSCH part of `scheduler_result_logger` (prints cg=Yes)."),
  B("`dci_0_1_configuration`, `dci_0_1_size` and `dci_0_1_pack()`: the wire format is the same for C-RNTI and CS-RNTI."),
];

// ---------------- 5. Parameters ----------------
const sec5 = [
  H1("5. Parameters involved"),
  H2("5.1 ConfiguredGrantConfig (`cg_configuration`)"),
  table(["Field", "Values / current source", "Type 1", "Type 2", "Change"], [
    ["periodicity", "sl1…sl5120; CLI `periodicity_slots` → `cg_builder_params.periodicity` (default sl40)", "Used", "Used identically", "UNCHANGED"],
    ["nof_harq_processes", "1…16; CLI (default 4)", "HARQ pool size", "Same", "UNCHANGED"],
    ["mcs_table", "qam64 (fixed in factory)", "Applies", "Applies (TS 38.214 §6.1.4.1)", "UNCHANGED"],
    ["cg_dmrs_cfg / trans_precoder", "Type A DMRS; transform precoding off", "Applies", "Applies", "UNCHANGED"],
    ["uci_on_pusch_cfg", "Semi-static beta offsets", "Applies", "Applies", "UNCHANGED"],
    ["configured_grant_timer", "static constexpr 4", "HARQ timeout 4 × P", "Same", "UNCHANGED"],
    ["rep (repK, repK-RV)", "static n1 / s1_0231", "RV 0", "RV 0", "UNCHANGED"],
    ["frequency_hopping, res_alloc", "static disabled / type_1", "–", "Activation DCI: hopping flag 0, RA type 1", "UNCHANGED"],
    ["rrc_configured_ul_grant_cfg", "optional", "Present", "**Absent**", "MODIFY (who fills it, B2/C1)"],
  ], [1900, 2600, 1300, 1900, 1902], { actionCol: 4 }),
  H2("5.2 Grant parameters: RRC field (Type 1) mapped to DCI field (Type 2)"),
  table(["RRC grant field (Type 1)", "DCI 0_1 field (Type 2)", "Proposed OCUDU source", "Kept in"], [
    ["time_domain_offset", "(none; implied)", "Activation PDCCH slot n chosen so that (n + k2) mod P = `ue_cg_config.cg_offset`", "`type2_activation_ctx.wheel_offset`"],
    ["time_domain_allocation", "time_resource", "Template TDRA index from `make_default_cell_cg_config()`, looked up in the list the DCI indexes", "`tdra_idx`"],
    ["freq_domain_res", "frequency_resource (RIV, N_BWP)", "`ue_cg_config.vrbs` from `cg_type1_res_mng`", "`vrbs`"],
    ["antenna_port", "antenna_ports", "`get_pusch_antenna_port_mapping_row_index(1 layer, …)`, as the factory does today", "`antenna_port`"],
    ["dmrs_seq_initialization", "dmrs_seq_initialization", "0", "–"],
    ["precoding_and_nof_layers", "precoding_info_nof_layers", "0 (1 layer)", "–"],
    ["mcs", "modulation_coding_scheme", "`cg_builder_params.mcs` (CLI `mcs`, default 5)", "`mcs` (+ TBS in `ue_tbs_values`)"],
    ["srs_resource_indicator / frequency_hopping_offset", "SRI / hopping flag", "Unset / 0 (static in `cg_configuration` too)", "–"],
  ], [2300, 2000, 3500, 1802]),
  H2("5.3 DCI 0_1 fields: dynamic grant, activation, release, periodic occasion"),
  table(["Field", "Bits", "Dynamic C-RNTI (today)", "Activation (CS-RNTI)", "Release (CS-RNTI)", "Periodic occasion"], [
    ["carrier_indicator / ul_sul / bwp_indicator", "0-3 / 0-1 / 0-2", "Unset", "Unset", "Unset", "–"],
    ["frequency_resource", "RA type 1", "RIV of scheduled VRBs", "RIV of CG VRBs", "all '1'", "From cache"],
    ["time_resource", "0-4", "TDRA row", "CG TDRA row", "Template (ignored)", "From cache"],
    ["frequency_hopping_flag", "0-1", "Unset", "0", "0", "–"],
    ["modulation_coding_scheme", "5", "Link adaptation", "CG MCS", "11111", "Fixed (cache)"],
    ["new_data_indicator", "1", "HARQ NDI", "0 (validation)", "0 (validation)", "Always new tx"],
    ["redundancy_version", "2", "HARQ", "00 (validation)", "00 (validation)", "0"],
    ["harq_process_number", "4", "Allocator", "0000 (validation)", "0000 (validation)", "floor(sym/P) mod N"],
    ["first / second DAI", "1-2 / 0-2", "Per slot / unset", "As for a dynamic grant (verify UE use)", "0", "–"],
    ["tpc_command", "2", "Power control", "Power control (applied once)", "1 (0 dB)", "–"],
    ["antenna_ports / precoding / dmrs_seq_init", "2-5 / var / 0-1", "DMRS / MIMO", "Template values", "Template (ignored)", "From cache"],
    ["srs_request / csi_request", "2-3 / 0-6", "Per slot / unset", "0 / 0", "0 / 0", "–"],
    ["SRI / cbg / ptrs_dmrs / beta_offset", "var", "Unset", "Unset", "Unset", "–"],
  ], [2050, 1000, 1600, 1700, 1500, 1752], { zebra: true, size: 16 }),
  H2("5.4 New runtime state: `type2_activation_ctx` (one per UE)"),
  P("This is the \"activation cache\" from the first draft, made concrete. It lives in `configured_grant_scheduler_impl` (for example a `slotted_id_table<du_ue_index_t, type2_activation_ctx, MAX_NOF_DU_UES>`, like `ue_tbs_values`). It is runtime state, not RRC configuration."),
  table(["Field", "Type", "Meaning"], [
    ["state", "enum {idle, activating, active, releasing}", "Life-cycle state machine (Figure 4)"],
    ["activation_slot / wheel_offset", "slot_point / unsigned", "PDCCH slot n, and (n + k2) mod P used by `add_ue_to_wheel()` and `rem_ue()`"],
    ["tdra_idx, symbols, k2", "uint8_t / ofdm_symbol_range / unsigned", "Row of the TDRA list the DCI indexed"],
    ["vrbs", "vrb_interval", "CG frequency allocation"],
    ["mcs, antenna_port", "sch_mcs_index / uint8_t", "Fixed after activation"],
    ["nof_dci_tx, last_dci_slot", "unsigned / slot_point", "Retransmission of the activation or release DCI until the CG Confirmation arrives"],
  ], [2600, 3000, 4002]),
  H2("5.5 New configuration parameters"),
  table(["Parameter", "Where", "Values / default", "Purpose"], [
    ["`cell_cfg.cg.type`", "CLI → `du_high_configured_grants::type` → `cg_builder_params::cg_type`", "{1, 2}, default 1", "Selects Type 1 or Type 2; the default keeps current behaviour"],
    ["`cg_type2_activation_retx_slots` (proposed)", "`scheduler_ue_expert_config`", "e.g. 2 × P (min 20 slots)", "Wait before re-sending an unconfirmed activation or release DCI"],
    ["`cg_type2_max_dci_attempts` (proposed)", "`scheduler_ue_expert_config`", "e.g. 4", "After this many attempts: give up, log a warning, fall back to dynamic grants"],
  ], [2700, 3000, 1700, 2202]),
];

// ---------------- 6. Proposed changes ----------------
const w6 = [550, 2200, 2200, 1400, 3252];
const sec6 = [
  H1("6. Proposed changes: file and function inventory"),
  P("The IDs match the boxes in Figures 1–3, so each row can be found in the diagrams. Paths are relative to the OCUDU root; `lib/scheduler/configured_grant/` is shortened to `cg/`."),
  H2("6.1 Configuration path (Figure 1)"),
  table(["ID", "File", "Function / symbol", "Action", "Change and reason"], [
    { group: "A. App / CLI (apps/units/flexible_o_du/o_du_high/du_high/)" },
    ["A1", "du_high_config.h:573", "`du_high_configured_grants`", "MODIFY", "Add `unsigned type = 1`."],
    ["A2", "du_high_config_cli11_schema.cpp:1452", "`configure_cli11_cg_args()`", "MODIFY", "Add `--type` with `check(CLI::IsMember({1, 2}))`."],
    ["A3", "du_high_config_translators.cpp:1071", "CG block building `du_cg_params`", "MODIFY", "Copy `type` into `cg_builder_params::cg_type`."],
    ["A4", "du_high_config_validator.cpp", "CG validation", "MODIFY", "Check the value; for Type 2 require a UE-specific search space that monitors DCI 0_1."],
    { group: "B. Cell & UE configuration builders" },
    ["B1", "include/ocudu/scheduler/config/cg_builder_params.h:14", "`cg_builder_params`", "MODIFY", "Add `enum class cg_type_t { type1, type2 } cg_type = type1;`."],
    ["B2", "lib/scheduler/config/serving_cell_config_factory.cpp:261", "`make_default_cg_config()`", "MODIFY", "Emplace `rrc_configured_ul_grant_cfg` only for Type 1. For Type 2, keep the grant defaults (MCS, antenna port) in the template."],
    ["B3", "lib/scheduler/config/ran_cell_config_helper.cpp:444, :486", "`make_default_cell_cg_config()`, `compute_nof_cg_prbs_per_ue()`", "MODIFY", "Replace the Type-1 asserts. Compute TDRA and PRB count from the template MCS/TDRA so both types share RB planning."],
    ["B4", "include/ocudu/ran/configured_grant/cg_configuration.h", "`cg_configuration`", "UNCHANGED", "Only update the remark at line 170 (\"Type 2 CG is not currently supported\")."],
    ["B5", "lib/scheduler/config/scheduler_ue_config_validator.cpp:29", "CG UE validation", "REMOVE", "Delete `VERIFY(... \"Only Configured Grant type 1 supported\")` and make the TDRA check type-aware. Add a Type 2 check that a CS-RNTI and a DCI 0_1 USS exist."],
    { group: "C. DU manager / RRC / MAC control" },
    ["C1", "lib/scheduler/rrm/cg_res_mng.cpp:124, :189", "`cg_type1_res_mng::alloc_resources()` / `dealloc_resources()`", "MODIFY", "Keep offset/VRB planning for both types. Write them into the RRC grant only for Type 1. Remove the assert at :164. Optionally rename the class to `cg_res_mng`."],
    ["C2", "include/ocudu/scheduler/config/ue_bwp_config.h:52", "`ue_cg_config`", "MODIFY", "Add `mcs` and `tdra_idx` (with `operator==`). This becomes the DU-internal Type 2 grant template the scheduler activates."],
    ["C3", "lib/du/du_high/du_manager/converters/asn1_rrc_config_helpers.cpp:2951", "ConfiguredGrantConfig encoder", "UNCHANGED", "Already omits rrc-ConfiguredUplinkGrant when absent."],
    ["C4", "lib/mac/mac_ctrl/mac_controller.cpp:109", "`handle_ue_reconfiguration_request()`", "UNCHANGED", "CS-RNTI allocation depends only on `cs_rnti_requested`."],
    ["C5", "OAI nr-uesoftmodem", "UE MAC (CG handling)", "VERIFY", "Must accept a CG without rrc-ConfiguredUplinkGrant, validate the CS-RNTI DCI and send LCID 55. Unconfirmed (Risk R1)."],
    { group: "D. Scheduler: UE add / reconfiguration" },
    ["D1", "lib/scheduler/ue_scheduling/ue_event_manager.cpp:397, :912", "calls to `cg_sched->add_reconf_ue()`", "UNCHANGED", "Entry points stay the same."],
    ["D2", "cg/configured_grant_scheduler_impl.cpp:165", "`add_reconf_ue()`", "MODIFY", "For Type 2: create `type2_activation_ctx{state = idle}` and put the UE on the pending-activation list instead of filling the wheel. On reconfiguration of an active Type 2 UE, schedule a release first."],
    ["D3", "cg/configured_grant_scheduler_impl.cpp:59", "`update_harq_reservation()`", "REMOVE", "Drop the `rrc_configured_ul_grant_cfg.has_value()` term so Type 2 UEs keep their N reserved CG HARQs from configuration time (decision D6)."],
    ["D4", "lib/scheduler/ue_context/ue_cell.cpp:60", "`ue_cell::handle_reconfiguration_request()`", "UNCHANGED", "Already reserves CG HARQs for any CG type."],
    ["D5", "cg/configured_grant_scheduler_impl.h", "pending-activation list", "OUTPUT", "Hand-off to Figure 2."],
  ], w6, { actionCol: 3 }),
  H2("6.2 Activation and release path (Figure 2)"),
  table(["ID", "File", "Function / symbol", "Action", "Change and reason"], [
    { group: "E. Slot entry & activation control" },
    ["E1", "lib/scheduler/ue_scheduling/ue_scheduler_impl.cpp:213", "cell constructor (`cg_sched`)", "MODIFY", "Pass `*params.pdcch_sched` (and the expert config) to `configured_grant_scheduler_impl`. The CG scheduler still runs before the fallback and slice schedulers."],
    ["E2", "cg/configured_grant_scheduler_impl.cpp:188", "`run_slot()`", "MODIFY", "Call `schedule_type2_activations(cell_alloc)` before `allocate_slot_cg_opportunities()`."],
    ["E3", "cg/configured_grant_scheduler_impl.cpp/.h", "`schedule_type2_activations()`", "NEW", "For each UE in idle/activating/releasing: if `(pdcch_slot + k2) mod P == cg_offset`, UL is enabled at the PUSCH slot and the retry timer has expired, then allocate the PDCCH (F1), build the DCI (F2), set the state, and for activation call `add_ue_to_wheel()` so the first occasion at n + k2 is reserved and decoded."],
    ["E4", "cg/configured_grant_scheduler_impl.h", "`type2_activation_ctx`", "NEW", "Runtime cache and state machine (Section 5.4)."],
    ["E5", "cg/configured_grant_scheduler_impl.cpp", "`schedule_type2_release()`", "NEW", "Triggered by `rem_ue()`, CG reconfiguration or (optionally) inactivity. Sends the release DCI and removes the UE from the wheel. On UE deletion the release is best-effort."],
    ["E6", "cg/configured_grant_scheduler_impl.cpp", "`get_active_grant()`", "NEW", "Returns the resolved grant (TDRA, symbols, VRBs, MCS). Type 1 reads the RRC grant; Type 2 reads the cache, or nothing if not active. Used by H4, H5, I1 and I2."],
    { group: "F. DCI build / PDCCH / MAC-DL" },
    ["F1", "lib/scheduler/pdcch_scheduling/pdcch_resource_allocator_impl.cpp:98-138", "`alloc_ul_pdcch_ue()`", "MODIFY", "Allocate with the C-RNTI (USS candidates and n_RNTI data scrambling, TS 38.211 §7.3.2.3), then set `ctx.rnti` (the CRC RNTI) to CS-RNTI. Add an optional `crc_rnti` parameter rather than overwriting ad hoc."],
    ["F2", "lib/scheduler/support/dci_builder.cpp/.h", "`build_dci_f0_1_cs_rnti()`", "NEW", "Signature like `build_dci_f0_1_c_rnti()` but with no `ul_harq_process_handle`, plus `bool release`. Activation: NDI 0, HARQ 0, RV 0, grant fields from the template. Release: also MCS 31 and FDRA all ones. Payload size = `format0_1_ue_size`."],
    ["F3", "lib/scheduler/support/dci_builder.cpp:383", "`build_dci_f0_1_c_rnti()`", "UNCHANGED", "Reference for field sourcing (antenna ports, precoding, TPC, DAI)."],
    ["F4", "include/ocudu/scheduler/result/dci_info.h:92-129", "`dci_ul_rnti_config_type`, `dci_ul_info`", "MODIFY", "Add `cs_rnti_f0_1` to the enum and a matching variant alternative (a wrapper type). Add `as_/set_cs_rnti_f0_1()`, extend `rnti_types` to \"cs-rnti\", and make `get_dci_format()` return f0_1 for it."],
    ["F5", "lib/mac/mac_dl/mac_cell_processor.cpp:472", "`encode_dci()` (UL)", "MODIFY", "Add `case cs_rnti_f0_1: return dci_0_1_pack(...)`. `dci_0_1_pack()` itself is UNCHANGED."],
    ["F6", "lib/scheduler/logging/scheduler_result_logger.cpp:173", "UL PDCCH logging switch", "MODIFY", "Print `type=cs-rnti` and act/rel so the lab test can confirm the DCI."],
    { group: "G. UE feedback: CG Confirmation MAC CE" },
    ["G1", "OAI nr-uesoftmodem", "UE", "VERIFY", "See C5."],
    ["G2", "lib/mac/mac_ul/lcid_ul_sch.h", "`lcid_ul_sch_t::options`", "MODIFY", "Add `CG_CONFIRMATION = 0b110111`. `sizeof_ce()` returns 0 (correct). No length field."],
    ["G3", "lib/mac/mac_ul/pdu_rx_handler.cpp:216-288", "`pdu_rx_handler::handle_mac_ce()`", "MODIFY", "New case: forward `{ue_index, cell, slot_rx}` to the scheduler instead of \"Unhandled LCID\"."],
    ["G4", "include/ocudu/scheduler/scheduler_feedback_handler.h:276 (+ ue_event_manager, ocudu_scheduler_adapter)", "`handle_cg_confirmation_indication()`", "NEW", "New feedback API, queued and routed per cell like `handle_ul_ta_report_indication()`."],
    ["G5", "cg/configured_grant_scheduler.h / _impl.cpp", "`handle_cg_confirmation()`", "NEW", "activating → active, releasing → idle (context erased). Stops DCI retransmission."],
  ], w6, { actionCol: 3 }),
  H2("6.3 Periodic-occasion path (Figure 3)"),
  table(["ID", "File", "Function / symbol", "Action", "Change and reason"], [
    { group: "H. CG scheduler: slot wheel & reservation (cg/configured_grant_scheduler_impl.cpp)" },
    ["H1", ":79", "`add_ue_to_wheel()`", "MODIFY", "Replace the early return with a type branch. Type 1: offset = `time_domain_offset` (unchanged). Type 2: called from E3 with offset = (n + k2) mod P and the TBS from the cache."],
    ["H2", "configured_grant_scheduler_impl.h", "`periodic_pusch_slot_wheel`", "UNCHANGED", "5120-slot ring, which fits every periodicity."],
    ["H3", ":204, :228", "`reserve_updated_ues_resources()`, `reserve_slot_cg_resources()`", "UNCHANGED", "Only iterate the wheel."],
    ["H4", ":240", "`reserve_cg_resources()`", "MODIFY", "Read TDRA symbols and VRBs from `get_active_grant()`."],
    ["H5", ":124, :268", "`rem_ue()`, `stop()`", "MODIFY", "`rem_ue()` uses the active offset (the Type 2 cache), skips never-activated UEs and triggers E5. `stop()` also clears the Type 2 contexts."],
    { group: "I. Per-occasion PUSCH build & HARQ" },
    ["I1", "cg/…impl.cpp:365", "`allocate_cg_opportunity()`", "MODIFY", "MCS and VRBs from `get_active_grant()`; skip if the grant is not active. `validate_cg_opportunity()` (:331) is UNCHANGED."],
    ["I2", "cg/…impl.cpp:277, :31", "`build_cg_pusch_cfg_params()`, `compute_cg_vrbs()`", "MODIFY", "Take the resolved grant as input. Use the TDRA list the activation DCI indexed (see Risk R2)."],
    ["I3", "cg/…impl.cpp:19; lib/scheduler/cell/cell_harq_manager.cpp", "`get_harq_id()`, `alloc_ul_harq()`", "UNCHANGED", "Same HARQ formula and CG timeout for Type 2."],
    ["I4", "lib/scheduler/support/sch_pdu_builder.cpp:680", "`build_pusch_cs_rnti()`", "REMOVE", "Delete the Type-1-only assert, or change it to check that the CG configuration exists. The body only uses resolved values passed in, so it needs no other change."],
    ["I5", "include/ocudu/scheduler/result/pusch_info.h", "`pusch_information` (is_cg = true)", "OUTPUT", "CS-RNTI PUSCH every P slots until release."],
    { group: "J. Interaction with the dynamic scheduler" },
    ["J1", "lib/scheduler/config/ue_configuration.cpp:743", "`ue_cell_configuration::is_cg_slot()`", "MODIFY", "Keep it as the Type 1 (config-only) check. Add a runtime query for Type 2, for example `ue_cell::is_cg_slot(slot)` that uses a flag and offset set by the CG scheduler on activation or release."],
    ["J2", "grant_params_selector.cpp:419; ue_fallback_scheduler.cpp:535, 554, 1059", "`is_cg_slot()` call sites", "MODIFY", "Switch to the runtime query so dynamic PUSCH and PUCCH/UCI placement avoid active Type 2 occasions only."],
    ["J3", "lib/scheduler/uci_scheduling/uci_allocator_impl.cpp", "`multiplex_uci_on_pusch()`", "UNCHANGED", "Already called with `configured_grant = true`."],
    ["J4", "lib/scheduler/ue_context/ue_cell.cpp:155", "`ue_cell::handle_ul_crc_info()`", "UNCHANGED", "DTX detection and fixed MCS keyed on `is_cg()`."],
    ["J5", "lib/scheduler/logging/scheduler_result_logger.cpp:675", "PUSCH logging", "UNCHANGED", "Already prints cg=Yes."],
  ], w6, { actionCol: 3 }),
  H2("6.4 Tests"),
  table(["ID", "File", "Test", "Action", "What it checks"], [
    ["T1", "tests/unittests/scheduler/cg_scheduler/configured_grant_scheduler_test.cpp", "new `cg_type2_*` cases in the `cg_duplex_test` suite", "MODIFY", "No PUSCH before activation. Activation DCI (CS-RNTI, NDI 0, HARQ 0, RV 0) at slot n with (n + k2) mod P = offset. Periodic PUSCH from n + k2. Re-send without confirmation. Release DCI and no PUSCH afterwards. FDD and TDD."],
    ["T2", "tests/unittests/scheduler/… (dci_builder test)", "`build_dci_f0_1_cs_rnti` activation/release", "NEW", "Bit patterns from TS 38.213 Tables 10.2-3/4. Packed size equals the C-RNTI DCI 0_1."],
    ["T3", "tests/unittests/mac/… (mac_ul_pdu test)", "LCID 55 parsing", "NEW", "A PDU with CG Confirmation plus data parses, and the CE reaches the scheduler."],
    ["T4", "existing CG, validator, asn1 tests", "regression", "UNCHANGED", "Must still pass after Phase 0 (Type 1 behaviour unchanged)."],
  ], [550, 2700, 2100, 1400, 2852], { actionCol: 3 }),
  H2("6.5 Summary counts"),
  table(["Action", "Count", "IDs"], [
    ["NEW", "12", "E3, E4, E5, E6, F2, G4 (API + event-manager route + adapter), G5 (interface + impl), T2, T3"],
    ["MODIFY", "27", "A1–A4, B1–B3, C1, C2, D2, E1, E2, F1, F4, F5, F6, G2, G3, H1, H4, H5, I1, I2, J1, J2, T1 (+ B4 remark)"],
    ["REMOVE", "3", "B5 (validator VERIFY), D3 (HARQ guard), I4 (PUSCH builder assert)"],
    ["UNCHANGED (reused)", "16", "B4, C3, C4, D1, D4, F3, dci_0_1_pack/size, H2, H3, I3, J3, J4, J5, validate_cg_opportunity, CS-RNTI table, T4"],
    ["VERIFY (external)", "1", "C5 / G1: OAI UE"],
  ], [2200, 900, 6502], { actionCol: 0 }),
];

// ---------------- 8. Design decisions ----------------
const sec8 = [
  H1("8. Design decisions"),
  table(["#", "Decision", "Recommendation", "Why / alternative rejected"], [
    ["D1", "Where the Type 2 grant comes from", "Reuse `cg_type1_res_mng` planning (offset + VRBs) and store it as a DU-internal template (`ue_cg_config` + MCS/TDRA).", "Keeps the existing RB-collision planning with PRACH/PUCCH valid. Picking resources freshly at activation time would need a second allocator."],
    ["D2", "Which slot to send the activation DCI in", "Wait until (n + k2) mod P = planned offset.", "The occasions then land exactly on pre-planned, non-colliding RBs. Worst-case delay is P slots, once per activation."],
    ["D3", "Representing the CS-RNTI DCI", "New variant alternative with a distinct wrapper type.", "`type()` comes from the variant index. Reusing `dci_0_1_configuration` twice breaks `std::get<T>`. Keeping type c_rnti_f0_1 and changing only `ctx.rnti` would mislabel logs and hide activation DCIs from tests."],
    ["D4", "PDCCH RNTI handling", "Search-space candidates and n_RNTI from C-RNTI; CRC RNTI = CS-RNTI (new optional parameter to `alloc_ul_pdcch_ue()`).", "TS 38.211 §7.3.2.3 and TS 38.213 §10.1 tie USS hashing and scrambling to the C-RNTI."],
    ["D5", "When to fill the slot wheel", "When the activation DCI is sent, not when the confirmation arrives.", "The UE starts transmitting at n + k2, usually carrying the confirmation in that first PUSCH. If the confirmation doesn't arrive in time, re-send the activation."],
    ["D6", "When to reserve CG HARQs", "At configuration time for both types (drop the D3 guard).", "Avoids reconfiguring the HARQ entity at runtime. The cost is N idle HARQ IDs before activation."],
    ["D7", "is_cg_slot for Type 2", "Runtime flag and offset on `ue_cell`, set by the CG scheduler.", "`ue_cell_configuration` is immutable config and cannot know the activation state."],
    ["D8", "Release triggers", "UE removal, CG reconfiguration, and optional inactivity (no BSR for X ms).", "Inactivity-based release is what makes Type 2 useful (saves resources); keep it behind a config flag."],
  ], [500, 2000, 3400, 3702]),
];

// ---------------- 9. Plan ----------------
const sec9 = [
  H1("9. Implementation plan and test plan"),
  table(["Phase", "Scope (IDs)", "Deliverable", "Exit criterion"], [
    ["0. Refactor", "E6, H4, H5, I1, I2 (Type 1 only)", "`get_active_grant()`; no `.value()` on the RRC grant outside it", "All existing CG tests pass; no behaviour change (can merge alone)"],
    ["1. Configuration", "A1–A4, B1–B5, C1, C2, D2 (queue only), D3", "Type 2 UE config accepted; RRC without rrc-ConfiguredUplinkGrant", "Validator and ASN.1 unit tests; the UE attaches with Type 2 configured (no activation yet)"],
    ["2. DCI", "F1, F2, F4, F5, F6", "CS-RNTI DCI 0_1 can be built, encoded and logged", "T2 passes; packed size equals C-RNTI DCI 0_1"],
    ["3. Scheduler", "E1–E5, H1, J1, J2", "Activation and release state machine; Type 2 occasions scheduled", "T1 passes (FDD and TDD)"],
    ["4. Confirmation", "G2–G5", "LCID 55 routed to the CG scheduler", "T3 passes; no \"Unhandled LCID\" warning"],
    ["5. End-to-end", "C5/G1 check, lab", "ZMQ run with OAI UE", "Log lines as in Section 3.2; iperf UL over CG occasions; clean release"],
  ], [1400, 2600, 2900, 2702]),
];

// ---------------- 10. Risks ----------------
const sec10 = [
  H1("10. Risks and open questions"),
  table(["#", "Risk / question", "Impact", "Mitigation"], [
    ["R1", "OAI UE support for Type 2 (CS-RNTI DCI validation, LCID 55) is unverified.", "High: blocks Phase 5", "Read the OAI UE MAC CG code before Phase 3. If missing, test with srsUE/COTS or patch OAI."],
    ["R2", "TDRA list mismatch: Type 1 indexes the common `pusch_td_alloc_list`, but DCI 0_1 in a USS indexes the dedicated list if one is configured.", "Medium: wrong symbols or k2", "Resolve TDRA through `ss_info.bwp->ul.td_mapper()` for Type 2 and assert the template index exists there."],
    ["R3", "PDCCH blocking delays activation (the aligned slot occurs only once per P).", "Low", "Retry at the next aligned slot; count attempts (`cg_type2_max_dci_attempts`)."],
    ["R4", "CG retransmission via CS-RNTI with NDI = 1 is not supported for either type (`nof_harq_retx = 0`).", "Low (existing limitation)", "Out of scope; note as follow-up."],
    ["R5", "DAI and UCI semantics on the activation DCI's first PUSCH.", "Low", "Compute DAI as for a dynamic grant; confirm UE behaviour in the lab."],
    ["R6", "Does `pdcch_ul_information::ctx.rnti` feed anything other than CRC scrambling (for example the FAPI PDU RNTI or UE lookups)?", "Medium", "Audit the MAC→FAPI translator in Phase 2 before changing `ctx.rnti`."],
    ["R7", "Multiple CG configurations (Rel-16) and harq-ProcID-Offset2", "None now", "Out of scope; the HARQ field validation assumes a single configuration."],
    ["R8", "DRX or measurement gaps at the aligned activation slot", "Low", "`is_ul_enabled()` and active-time checks before sending; otherwise wait for the next aligned slot."],
  ], [500, 3500, 1700, 3902]),
];

// ---------------- 11. Glossary ----------------
const sec11 = [
  H1("11. Glossary"),
  table(["Term", "Meaning"], [
    ["CG Type 1 / Type 2", "Configured Grant. Type 1: the whole grant comes from RRC. Type 2: RRC gives the semi-static part, and a CS-RNTI DCI activates or releases the grant and carries its fields."],
    ["C-RNTI / CS-RNTI", "Cell RNTI (dynamic scheduling) / Configured Scheduling RNTI (CG activation, release, retransmission and CG PUSCH)"],
    ["Activation / release DCI", "DCI 0_1 with CRC scrambled by CS-RNTI, NDI = 0, and the reserved values of TS 38.213 §10.2"],
    ["CG Confirmation MAC CE", "Zero-length UL MAC CE (LCID 55) that the UE sends after activation or release"],
    ["NDI, RV, HARQ ID", "New Data Indicator, Redundancy Version, HARQ process number. All three are validation fields in activation and release DCIs."],
    ["TDRA / RIV / VRB", "Time-domain resource allocation row / Resource Indication Value (RA type 1) / Virtual Resource Block"],
    ["P, N, k2", "CG periodicity in slots, nrofHARQ-Processes, PDCCH-to-PUSCH slot offset"],
    ["periodic_pusch_slot_wheel", "The CG scheduler's 5120-slot ring of UEs with a CG occasion in each slot"],
    ["type2_activation_ctx", "Proposed per-UE runtime cache and state machine for Type 2 (Section 5.4)"],
    ["USS", "UE-specific search space (DCI 0_1 is monitored only there)"],
  ], [2600, W - 2600]),
];

// ---------------- Figures (landscape) ----------------
const sec7intro = [
  H1("7. Block diagrams"),
  P("Figures 1–3 show every file and function the proposal touches, grouped by execution path and colour-coded (green = new, amber = modify, red = remove or relax a Type-1 guard, grey = reused unchanged, dashed purple = verify / external, blue = output or hand-off). Box IDs match the tables in Section 6. Figure 4 shows the signalling sequence and which function handles each message. The four figures follow on landscape pages.", { after: 80 }),
];
const figs1 = [
  ...figure("fig1.png", 9.7, 9.7 * 6.95 / 10.4, "Figure 1: configuration path (IDs A1–D5 in Section 6.1)."),
];
const figs2 = [...figure("fig2.png", 9.7, 9.7 * 6.95 / 10.4, "Figure 2: activation and release path (IDs E1–G5 in Section 6.2). E6 get_active_grant() is used by Figure 3.")];
const figs3 = [...figure("fig3.png", 9.7, 9.7 * 6.95 / 10.4, "Figure 3: periodic-occasion path shared by both types (IDs H1–J5 in Section 6.3).")];
const figs4 = [...figure("fig4.png", 9.1, 9.1 * 7.35 / 10.4, "Figure 4: Type 2 lifecycle. [new] / [mod] tags match the colour code.")];

const TOC = [
  "1. Executive summary  (1.1 Corrections to the first draft)",
  "2. Background: how CG Type 2 works (3GPP)",
  "3. Lab setup and baseline evidence",
  "4. What exists today (as-is): Type 1 path, the 14 places that assume Type 1, reusable parts",
  "5. Parameters involved: ConfiguredGrantConfig, grant fields, DCI 0_1 fields, runtime state, new config",
  "6. Proposed changes: file and function inventory (per figure, with IDs)",
  "7. Block diagrams (Figures 1-4, landscape pages)",
  "8. Design decisions",
  "9. Implementation plan and test plan",
  "10. Risks and open questions",
  "11. Glossary",
].map((t) => new Paragraph({ children: runs(t, { size: 20 }), spacing: { after: 40 }, indent: { left: 200 } }));
// ---------------- assemble ----------------
const footer = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: "CG Type 2 implementation proposal · OCUDU 6153e7bf2 · page ", font: FONT, size: 16, color: "7F7F7F" }),
      new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: "7F7F7F" }),
    ],
  })],
});
const portrait = { page: { size: { width: 11906, height: 16838 }, margin: { top: 1152, bottom: 1152, left: 1152, right: 1152 } } };
const landscape = { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 600, bottom: 600, left: 700, right: 700 } } };
const pb = () => new Paragraph({ children: [new PageBreak()] });

const doc = new Document({
  creator: "Surabhi P",
  title: "UL Configured Grant Type 2 in OCUDU: implementation proposal",
  styles: {
    default: { document: { run: { font: FONT, size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 30, bold: true, font: FONT, color: NAVY }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 25, bold: true, font: FONT, color: "2E5C8A" }, paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 22, bold: true, font: FONT, color: "2E5C8A" }, paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 270 } } } }] },
      { reference: "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] },
    ],
  },
  sections: [
    { properties: portrait, footers: { default: footer }, children: [
      ...titleBlock, gap(200),
      new Paragraph({ children: [new TextRun({ text: "Contents", bold: true, size: 26, color: NAVY, font: FONT })], spacing: { after: 80 } }),
      ...TOC,
      pb(), ...sec1, pb(), ...sec2, ...sec3, pb(), ...sec4, pb(), ...sec5, pb(), ...sec6, ...sec7intro,
    ] },
    { properties: landscape, footers: { default: footer }, children: [...figs1, pb(), ...figs2, pb(), ...figs3, pb(), ...figs4] },
    { properties: portrait, footers: { default: footer }, children: [...sec8, ...sec9, ...sec10, ...sec11] },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = process.argv[2] || path.join(__dirname, "CG_Type2_Implementation_Proposal.docx");
  fs.writeFileSync(out, buf);
  console.log("wrote", out);
});
