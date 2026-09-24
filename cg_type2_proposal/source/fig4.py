import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
SANS = "DejaVu Sans"; MONO = "DejaVu Sans Mono"
W, Hh = 10.4, 7.35
fig = plt.figure(figsize=(W, Hh), dpi=220); ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, W); ax.set_ylim(Hh, 0); ax.axis("off")
ax.text(W/2, 0.28, "Figure 4 - CG Type 2 lifecycle: signalling sequence and the OCUDU function that handles each step",
        ha="center", fontsize=12, weight="bold", color="#1F3864", family=SANS)
parts = [("DU manager / RRC", 0.9), ("CG scheduler", 3.0), ("PDCCH / MAC-DL", 5.0), ("UE (OAI)", 7.1), ("MAC-UL", 9.3)]
xs = {}
for name, x in parts:
    ax.add_patch(FancyBboxPatch((x - 0.72, 0.55), 1.44, 0.34, boxstyle="round,pad=0,rounding_size=0.05",
                                fc="#1F3864", ec="#1F3864"))
    ax.text(x, 0.72, name, ha="center", va="center", color="white", fontsize=8, weight="bold", family=SANS)
    ax.plot([x, x], [0.89, 7.25], color="#9AA7B8", lw=1, ls=(0, (4, 3)), zorder=0)
    xs[name] = x
COL = {"new": "#3A7D22", "modify": "#B8860B", "unchanged": "#555555", "verify": "#6A4C9C"}
def msg(y, a, b, text, fn=None, kind="unchanged", dashed=False):
    x1, x2 = xs[a], xs[b]
    ax.add_patch(FancyArrowPatch((x1, y), (x2, y), arrowstyle="-|>", mutation_scale=10, lw=1.3,
                                 color=COL[kind], ls="--" if dashed else "-"))
    ax.text((x1 + x2) / 2, y - 0.1, text, ha="center", va="bottom", fontsize=7, family=SANS, color="#111111")
    if fn:
        ax.text((x1 + x2) / 2, y + 0.06, fn, ha="center", va="top", fontsize=6.1, family=MONO, color=COL[kind])
def self_note(y, p, text, fn, kind):
    x = xs[p]
    ax.add_patch(FancyBboxPatch((x - 1.2, y - 0.2), 2.4, 0.42, boxstyle="round,pad=0,rounding_size=0.04",
                                fc="white", ec=COL[kind], lw=1.2))
    ax.text(x, y - 0.07, text, ha="center", va="center", fontsize=6.6, family=SANS)
    ax.text(x, y + 0.1, fn, ha="center", va="center", fontsize=5.9, family=MONO, color=COL[kind])
def phase(y0, y1, label, color):
    ax.add_patch(FancyBboxPatch((0.05, y0), W - 0.1, y1 - y0, boxstyle="round,pad=0,rounding_size=0.05",
                                fc=color, ec="none", zorder=-1))
    ax.text(0.12, y0 + 0.12, label, fontsize=7.2, weight="bold", color="#2E4A6B", family=SANS, va="center")
phase(1.0, 2.05, "1  Configure", "#F3F6FA")
phase(2.1, 4.45, "2  Activate", "#EEF6EA")
phase(4.5, 5.45, "3  Periodic occasions", "#F7F3E6")
phase(5.5, 7.25, "4  Release", "#FBEDEC")
msg(1.35, "DU manager / RRC", "UE (OAI)", "RRCReconfiguration: ConfiguredGrantConfig WITHOUT rrc-ConfiguredUplinkGrant + CS-RNTI",
    "make_default_cg_config() [mod] -> asn1 encoder [unchanged]", "modify")
msg(1.8, "DU manager / RRC", "CG scheduler", "UE (re)config applied", "add_reconf_ue() [mod]: queue pending activation", "modify")
self_note(2.5, "CG scheduler", "slot n: (n+k2) mod P = offset; wheel filled now", "schedule_type2_activations() [new]", "new")
msg(3.0, "CG scheduler", "PDCCH / MAC-DL", "activation DCI 0_1", "build_dci_f0_1_cs_rnti() [new] + add_ue_to_wheel() [mod]", "new")
msg(3.4, "PDCCH / MAC-DL", "UE (OAI)", "PDCCH, CRC by CS-RNTI: NDI=0, HARQ=0000, RV=00", "encode_dci() [mod] -> dci_0_1_pack()", "modify")
msg(3.8, "UE (OAI)", "MAC-UL", "PUSCH at n+k2 (1st occasion) + CG Conf. MAC CE", "LCID 55 -> handle_mac_ce() [mod]", "verify", True)
msg(4.25, "MAC-UL", "CG scheduler", "CG confirmation indication", "handle_cg_confirmation() [new]: ACTIVATING -> ACTIVE, stop re-sending DCI", "new")
msg(4.9, "CG scheduler", "MAC-UL", "every P slots: grant-free PUSCH, CS-RNTI, HARQ id = floor(sym/P) mod N",
    "allocate_cg_opportunity() [mod] -> build_pusch_cs_rnti() [assert removed]", "modify")
msg(5.3, "UE (OAI)", "MAC-UL", "PUSCH (no PDCCH)", None, "verify", True)
self_note(5.82, "CG scheduler", "rem_ue / reconfig / inactivity", "schedule_type2_release() [new]", "new")
msg(6.3, "CG scheduler", "PDCCH / MAC-DL", "release DCI 0_1", "build_dci_f0_1_cs_rnti(release) [new]", "new")
msg(6.72, "PDCCH / MAC-DL", "UE (OAI)", "HARQ=0000, RV=00, MCS=11111, FDRA all '1'", None, "modify")
msg(7.02, "UE (OAI)", "MAC-UL", "CG Confirmation MAC CE", None, "verify", True)
ax.text(xs["MAC-UL"], 7.08, "-> handle_cg_confirmation(): off the wheel, HARQs freed", ha="right", va="top", fontsize=5.9, family=MONO, color=COL["new"])
fig.savefig("fig4.png", dpi=220)
