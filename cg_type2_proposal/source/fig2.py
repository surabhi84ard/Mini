from common import Canvas
c = Canvas(10.4, 6.95, "Figure 2 - Runtime path A: Type 2 activation / release (DCI 0_1 on CS-RNTI)",
           "What runs once per activation or release. Everything in this figure is Type-2-only; Type 1 never enters it.")
W, H = 3.18, 0.9
X = [0.18, 3.62, 7.06]
Y = [1.12, 2.14, 3.16, 4.18, 5.2]
for x, lbl in zip(X, ["E. Slot entry & activation control", "F. DCI build / PDCCH / MAC-DL",
                      "G. UE feedback: CG Confirmation MAC CE"]):
    c.lane(x - 0.08, 0.78, W + 0.16, 5.44, lbl)
C = "configured_grant_scheduler_impl.cpp"
c.box("E1", X[0], Y[0], W, H, "modify", "ue_scheduler_impl::cell ctor", "ue_scheduler_impl.cpp", "pass *params.pdcch_sched into the CG scheduler\n(it cannot allocate a PDCCH today)", 213)
c.box("E2", X[0], Y[1], W, H, "modify", "run_slot()", C, "call schedule_type2_activations() before the\nperiodic-occasion allocation (order kept)", 188)
c.box("E3", X[0], Y[2], W, H, "new", "schedule_type2_activations()", C, "pending UE: PDCCH slot n with (n + k2) mod P ==\ncg_offset; send DCI + add_ue_to_wheel(); re-send")
c.box("E4", X[0], Y[3], W, H, "new", "type2_activation_ctx  (per UE)", "configured_grant_scheduler_impl.h", "state, activation slot, TDRA idx, VRBs, MCS,\nantenna port, retries  -> the runtime cache")
c.box("E5", X[0], Y[4], W, H, "new", "schedule_type2_release()", C, "on rem_ue / CG reconfig / inactivity: release\nDCI via F1 + F2, then remove from the wheel")

c.box("F1", X[1], Y[0], W, H, "modify", "alloc_ul_pdcch_ue()", "pdcch_resource_allocator_impl.cpp", "CRC RNTI = CS-RNTI, but USS candidates and\nn_RNTI data scrambling must stay on C-RNTI", "98-138")
c.box("F2", X[1], Y[1], W, H, "new", "build_dci_f0_1_cs_rnti()", "dci_builder.cpp / dci_builder.h", "activation: NDI=0, HARQ=0, RV=00 + grant fields\nrelease: + MCS=11111, FDRA all '1'")
c.box("F3", X[1], Y[2], W, H, "unchanged", "build_dci_f0_1_c_rnti()", "dci_builder.cpp", "template for field sourcing (ant. ports, precoding,\nTPC, DAI); not called for CS-RNTI", 383)
c.box("F4", X[1], Y[3], W, H, "modify", "dci_ul_info / dci_ul_rnti_config_type", "include/ocudu/scheduler/result/dci_info.h", "+ cs_rnti_f0_1 enum AND variant alternative,\naccessors, 'cs-rnti' string, get_dci_format()", 92)
c.box("F5", X[1], Y[4], W, H, "modify", "encode_dci() (UL)", "mac_cell_processor.cpp", "+ case cs_rnti_f0_1 -> dci_0_1_pack()\n(dci_0_1_configuration / pack: UNCHANGED)", 472)

c.box("G1", X[2], Y[0], W, H, "verify", "OAI nr-uesoftmodem (UE)", "external", "validates CS-RNTI DCI (TS 38.213 10.2), starts\noccasions, sends CG Confirmation MAC CE")
c.box("G2", X[2], Y[1], W, H, "modify", "lcid_ul_sch_t", "lib/mac/mac_ul/lcid_ul_sch.h", "+ CG_CONFIRMATION = 0b110111 (LCID 55,\nzero-length CE); today it only logs 'Unhandled'")
c.box("G3", X[2], Y[2], W, H, "modify", "pdu_rx_handler::handle_mac_ce()", "lib/mac/mac_ul/pdu_rx_handler.cpp", "new case CG_CONFIRMATION ->\nsched.handle_cg_confirmation_indication()", "216-288")
c.box("G4", X[2], Y[3], W, H, "new", "handle_cg_confirmation_indication()", "scheduler_feedback_handler.h + ue_event_manager", "new feedback API + event routed to the cell's\ncg_sched (like handle_ul_ta_report_indication)")
c.box("G5", X[2], Y[4], W, H, "new", "handle_cg_confirmation()", "configured_grant_scheduler.h / _impl.cpp", "updates type2_activation_ctx (E4): ACTIVATING ->\nACTIVE, RELEASING -> idle; stops DCI re-sending")

c.arrow("E1", "bottom", "E2", "top", "run_slot()"); c.arrow("E2", "bottom", "E3", "top")
c.arrow("E3", "bottom", "E4", "top", "fills cache"); c.arrow("E4", "bottom", "E5", "top", "on removal")
c.elbow("E3", "F1", (X[0] + W + X[1]) / 2, "PDCCH", fa=0.3, fb=0.5)
c.arrow("F1", "bottom", "F2", "top"); c.arrow("F3", "top", "F2", "bottom", "modelled on", color="#7F7F7F", ls="--")
c.elbow("F2", "F4", X[1] + W + 0.04, None, fa=0.7, fb=0.5)
c.arrow("F4", "bottom", "F5", "top", "dci.type()")
c.elbow("F5", "G1", (X[1] + W + X[2]) / 2, None, fa=0.5, fb=0.5, color="#6A4C9C", ls="--")
c.arrow("G1", "bottom", "G2", "top", "UL-SCH: LCID 55", color="#6A4C9C")
c.arrow("G2", "bottom", "G3", "top"); c.arrow("G3", "bottom", "G4", "top"); c.arrow("G4", "bottom", "G5", "top")
c.legend(6.6, ("new", "modify", "remove", "unchanged", "verify", "io"))
c.save("fig2.png")
