from common import Canvas
c = Canvas(10.4, 6.95, "Figure 3 - Runtime path B: periodic CG occasions (shared by Type 1 and Type 2)",
           "What runs every slot. The Type 1 path already works; the changes let the same code read a DCI-activated grant.")
W, H = 3.18, 0.9
X = [0.18, 3.62, 7.06]
Y = [1.12, 2.14, 3.16, 4.18, 5.2]
for x, lbl in zip(X, ["H. CG scheduler: slot wheel & reservation", "I. Per-occasion PUSCH build & HARQ",
                      "J. Interaction with the dynamic scheduler"]):
    c.lane(x - 0.08, 0.78, W + 0.16, 5.44, lbl)
C = "configured_grant_scheduler_impl.cpp"
c.box("H1", X[0], Y[0], W, H, "modify", "add_ue_to_wheel()", C, "Type 2: called at activation; start offset =\nactivation PUSCH slot mod P (not RRC offset)", 79)
c.box("H2", X[0], Y[1], W, H, "unchanged", "periodic_pusch_slot_wheel", "configured_grant_scheduler_impl.h", "5120-slot ring; every CG periodicity divides\n5120, so Type 2 offsets fit unchanged")
c.box("H3", X[0], Y[2], W, H, "unchanged", "reserve_updated_ues_resources()", C, "+ reserve_slot_cg_resources() :228 - iterate\nthe wheel; no grant fields read here", 204)
c.box("H4", X[0], Y[3], W, H, "modify", "reserve_cg_resources()", C, "reads rrc_configured_ul_grant_cfg.value()\n-> read get_active_grant() instead", 240)
c.box("H5", X[0], Y[4], W, H, "modify", "rem_ue()  /  stop()", C, "rem_ue :124 uses RRC offset -> use active offset,\nskip never-activated UEs; stop :268 clears ctx", 124)

c.box("I1", X[1], Y[0], W, H, "modify", "allocate_cg_opportunity()", C, "reads RRC grant (MCS, VRBs) -> get_active_grant();\nvalidate_cg_opportunity() :331 UNCHANGED", 365)
c.box("I2", X[1], Y[1], W, H, "modify", "build_cg_pusch_cfg_params()", C, "+ compute_cg_vrbs() :31: take the resolved grant;\nTDRA from the list the DCI indexed", 277)
c.box("I3", X[1], Y[2], W, H, "unchanged", "get_harq_id()  +  alloc_ul_harq()", "cg_sched_impl.cpp :19 / cell_harq_manager.cpp", "TS 38.321 5.4.1 formula is the same for Type 2;\ncg_harq_alloc_params / timeout reused")
c.box("I4", X[1], Y[3], W, H, "remove", "build_pusch_cs_rnti()", "lib/scheduler/support/sch_pdu_builder.cpp", "drop assert 'RRC-ConfiguredUplinkGrant for CG\ntype 1 not set' - it fires for every Type 2 UE", 680)
c.box("I5", X[1], Y[4], W, H, "io", "pusch_information  (is_cg = true)", "include/ocudu/scheduler/result/pusch_info.h", "rnti = CS-RNTI, no PDCCH; repeats every P slots\nuntil release")

c.box("J1", X[2], Y[0], W, H, "modify", "ue_cell_configuration::is_cg_slot()", "lib/scheduler/config/ue_configuration.cpp", "'TODO: support type 2' - config-only check;\nneeds runtime activation state for Type 2", 743)
c.box("J2", X[2], Y[1], W, H, "modify", "is_cg_slot() call sites", "grant_params_selector.cpp :419 / ue_fallback_scheduler.cpp", "535, 554, 1059: ask the CG scheduler (or ue_cell)\nwhether the slot is an ACTIVE CG occasion")
c.box("J3", X[2], Y[2], W, H, "unchanged", "multiplex_uci_on_pusch()", "uci_allocator_impl.cpp", "moves HARQ-ACK/CSI onto the CG PUSCH;\nalready called with configured_grant = true")
c.box("J4", X[2], Y[3], W, H, "unchanged", "ue_cell::handle_ul_crc_info()", "lib/scheduler/ue_context/ue_cell.cpp", "CG DTX detection + fixed MCS (no OLLA) keyed on\nh_ul->is_cg(), so already type-agnostic", 155)
c.box("J5", X[2], Y[4], W, H, "unchanged", "scheduler_result_logger (PUSCH)", "scheduler_result_logger.cpp", "already prints 'cg=Yes'; only the UL PDCCH\ncase changes (Figure 2, F4)", 675)

c.arrow("H1", "bottom", "H2", "top", "push_back(crnti)"); c.arrow("H2", "bottom", "H3", "top", "per slot")
c.arrow("H3", "bottom", "H4", "top"); c.arrow("H5", "top", "H4", "bottom", "same grant source", color="#7F7F7F", ls="--")
c.elbow("H2", "I1", (X[0] + W + X[1]) / 2, "slot\ndue", fa=0.7, fb=0.5)
c.arrow("I1", "bottom", "I2", "top"); c.arrow("I2", "bottom", "I3", "top", "h_id"); c.arrow("I3", "bottom", "I4", "top")
c.arrow("I4", "bottom", "I5", "top")
c.elbow("I1", "J3", (X[1] + W + X[2]) / 2, None, fa=0.8, fb=0.5)
c.arrow("J1", "bottom", "J2", "top", "used by")
c.elbow("I5", "J4", (X[1] + W + X[2]) / 2 + 0.03, "CRC", fa=0.5, fb=0.5)
c.legend(6.6, ("new", "modify", "remove", "unchanged", "verify", "io"))
c.save("fig3.png")
