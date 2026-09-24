from common import Canvas
c = Canvas(10.4, 6.95, "Figure 1 - Configuration path: files and functions touched for CG Type 2",
           "UE setup / RRC reconfiguration: from the CLI option to the scheduler's pending-activation queue")
W, H = 2.34, 0.9
X = [0.18, 2.72, 5.26, 7.88]
for x, lbl in zip(X, ["A. App / CLI  (apps/units/.../du_high)", "B. Cell & UE config builders",
                      "C. DU manager / RRC / MAC ctrl", "D. Scheduler - UE add / reconfig"]):
    c.lane(x - 0.08, 0.78, W + 0.16, 5.44, lbl)
Y = [1.12, 2.14, 3.16, 4.18, 5.2]
c.box("A1", X[0], Y[0], W, H, "modify", "du_high_configured_grants", "du_high_config.h", "add field  type = {1, 2}  (default 1)", 573)
c.box("A2", X[0], Y[1], W, H, "modify", "configure_cli11_cg_args()", "du_high_config_cli11_schema.cpp", "new option  cell_cfg.cg.type", 1452)
c.box("A3", X[0], Y[2], W, H, "modify", "CG translator block", "du_high_config_translators.cpp", "copy type into cg_builder_params", 1071)
c.box("A4", X[0], Y[3], W, H, "modify", "CG validator", "du_high_config_validator.cpp", "check type in {1,2}; Type 2 needs\nDCI 0_1 USS configured")

c.box("B1", X[1], Y[0], W, H, "modify", "cg_builder_params", "cg_builder_params.h", "add  cg_type ; periodicity, mcs,\nnof_harq_processes reused", 14)
c.box("B2", X[1], Y[1], W, H, "modify", "make_default_cg_config()", "serving_cell_config_factory.cpp", "emplace rrc_configured_ul_grant\nonly when cg_type == 1", 261)
c.box("B3", X[1], Y[2], W, H, "modify", "make_default_cell_cg_config()", "ran_cell_config_helper.cpp", "+ compute_nof_cg_prbs_per_ue() :486\nType-1 asserts -> read MCS/TDRA template", 444)
c.box("B4", X[1], Y[3], W, H, "unchanged", "cg_configuration", "cg_configuration.h", "absent rrc_configured_ul_grant_cfg\n= Type 2 (only doc remark updated)")
c.box("B5", X[1], Y[4], W, H, "remove", "validate CG (UE cfg)", "scheduler_ue_config_validator.cpp", "drop VERIFY 'Only CG type 1';\nadd Type 2 checks instead", 29)

c.box("C1", X[2], Y[0], W, H, "modify", "cg_type1_res_mng::alloc_resources()", "cg_res_mng.cpp", "Type 2: plan offset + VRBs only;\ndo not write the RRC grant", 124)
c.box("C2", X[2], Y[1], W, H, "modify", "ue_cg_config", "ue_bwp_config.h", "add mcs, tdra_idx -> DU-internal\nType 2 grant template", 52)
c.box("C3", X[2], Y[2], W, H, "unchanged", "ConfiguredGrantConfig encoder", "asn1_rrc_config_helpers.cpp", "rrc-ConfiguredUplinkGrant is already\nomitted when the grant is absent", 2951)
c.box("C4", X[2], Y[3], W, H, "unchanged", "mac_controller::handle_ue_reconf..()", "mac_controller.cpp", "CS-RNTI allocation is already\ntype-agnostic", 109)
c.box("C5", X[2], Y[4], W, H, "verify", "OAI nr-uesoftmodem (UE)", "external", "must accept CG without rrc grant\nand decode DCI 0_1 on CS-RNTI")

c.box("D1", X[3], Y[0], W, H, "unchanged", "ue_event_manager (config events)", "ue_event_manager.cpp", "calls cg_sched->add_reconf_ue()", "397/912")
c.box("D2", X[3], Y[1], W, H, "modify", "add_reconf_ue()", "configured_grant_scheduler_impl.cpp", "Type 2 -> enqueue pending activation\n(no slot-wheel fill yet)", 165)
c.box("D3", X[3], Y[2], W, H, "remove", "update_harq_reservation()", "configured_grant_scheduler_impl.cpp", "drop rrc-grant guard so Type 2 UEs\nget nof_cg_reserved HARQs", 59)
c.box("D4", X[3], Y[3], W, H, "unchanged", "ue_cell::handle_reconfiguration_request()", "ue_cell.cpp", "already reserves CG HARQs for any\nCG type", 60)
c.box("D5", X[3], Y[4], W, H, "io", "pending_activation list", "-> Figure 2 (runtime path)", "UE waits for its CS-RNTI\nactivation DCI 0_1")

c.arrow("A1", "bottom", "A2", "top"); c.arrow("A2", "bottom", "A3", "top"); c.arrow("A3", "bottom", "A4", "top")
c.elbow("A3", "B1", (X[0] + W + X[1]) / 2, "cg_type", fb=0.5)
c.arrow("B1", "bottom", "B2", "top"); c.arrow("B2", "bottom", "B3", "top")
c.arrow("B3", "bottom", "B4", "top", "builds"); c.arrow("B5", "top", "B4", "bottom", "validates")
c.elbow("B3", "C1", (X[1] + W + X[2]) / 2, "default\ncfg", fb=0.5)
c.arrow("C1", "bottom", "C2", "top"); c.arrow("C2", "bottom", "C3", "top", "RRC encode")
c.arrow("C3", "bottom", "C4", "top", "cs_rnti_requested")
c.elbow("C3", "C5", X[2] - 0.035, fa=0.75, fb=0.5, color="#6A4C9C", ls="--")
c.text(X[2] + 0.12, Y[4] - 0.055, "RRCReconfiguration (no rrc-ConfiguredUplinkGrant)", fontsize=5.8, color="#6A4C9C", style="italic")
c.elbow("C2", "D1", (X[2] + W + X[3]) / 2, "sched\nUE cfg", fa=0.5, fb=0.5)
c.arrow("D1", "bottom", "D2", "top"); c.arrow("D2", "bottom", "D3", "top")
c.arrow("D4", "bottom", "D5", "top", "Type 2 UE")
c.arrow("D3", "bottom", "D4", "top", "harqs.reconfigure()")
c.legend(6.6, ("new", "modify", "remove", "unchanged", "verify", "io"))
c.save("fig1.png")
