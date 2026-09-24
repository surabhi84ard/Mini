import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

KIND = {
    "new":       dict(fc="#DDF0D5", ec="#3A7D22", tag="NEW"),
    "modify":    dict(fc="#FFF1C9", ec="#B8860B", tag="MODIFY"),
    "remove":    dict(fc="#F9D6D5", ec="#C0392B", tag="REMOVE"),
    "unchanged": dict(fc="#EFEFEF", ec="#7F7F7F", tag="UNCHANGED"),
    "verify":    dict(fc="#FFFFFF", ec="#6A4C9C", tag="VERIFY"),
    "io":        dict(fc="#DCE9F7", ec="#2E5C8A", tag="OUTPUT"),
}
MONO = "DejaVu Sans Mono"
SANS = "DejaVu Sans"

class Canvas:
    def __init__(self, w, h, title, subtitle=None):
        self.fig = plt.figure(figsize=(w, h), dpi=220)
        self.ax = self.fig.add_axes([0, 0, 1, 1])
        self.ax.set_xlim(0, w); self.ax.set_ylim(h, 0); self.ax.axis("off")
        self.w, self.h = w, h
        self.ax.text(w / 2, 0.28, title, ha="center", va="center", fontsize=13, weight="bold",
                     color="#1F3864", family=SANS)
        if subtitle:
            self.ax.text(w / 2, 0.55, subtitle, ha="center", va="center", fontsize=8.5,
                         color="#444444", family=SANS, style="italic")
        self.boxes = {}

    def legend(self, y, kinds=("new", "modify", "remove", "unchanged", "verify")):
        labels = {"new": "New code", "modify": "Modify existing", "remove": "Remove / relax guard",
                  "unchanged": "Existing, reused as-is", "verify": "Verify / external", "io": "Output"}
        n = len(kinds); slot = 1.62; x0 = self.w / 2 - n * slot / 2
        for i, k in enumerate(kinds):
            x = x0 + i * slot
            st = KIND[k]
            self.ax.add_patch(FancyBboxPatch((x, y - 0.09), 0.3, 0.18, boxstyle="round,pad=0,rounding_size=0.04",
                                             fc=st["fc"], ec=st["ec"], lw=1.2,
                                             ls="--" if k == "verify" else "-"))
            self.ax.text(x + 0.38, y, labels[k], va="center", fontsize=8, family=SANS)

    def lane(self, x, y, w, h, label, color="#F7F9FC", ec="#C9D3E0"):
        self.ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0,rounding_size=0.08",
                                         fc=color, ec=ec, lw=1.0, zorder=0))
        self.ax.text(x + 0.12, y + 0.18, label, fontsize=8.5, weight="bold", color="#2E4A6B",
                     family=SANS, va="center", zorder=1)

    def box(self, key, x, y, w, h, kind, title, path=None, note=None, loc=None):
        st = KIND[kind]
        self.ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0,rounding_size=0.05",
                                         fc=st["fc"], ec=st["ec"], lw=1.4,
                                         ls="--" if kind == "verify" else "-", zorder=2))
        # tag chip
        tw = 0.11 + 0.062 * len(st["tag"])
        self.ax.add_patch(FancyBboxPatch((x + w - tw - 0.05, y + h - 0.2), tw, 0.155,
                                         boxstyle="round,pad=0,rounding_size=0.04",
                                         fc=st["ec"], ec=st["ec"], lw=0, zorder=3))
        self.ax.text(x + w - tw / 2 - 0.05, y + h - 0.1225, st["tag"], ha="center", va="center", fontsize=5.6,
                     color="white", weight="bold", family=SANS, zorder=4)
        cy = y + 0.15
        tfs = min(7.6, (w - 0.16) / (0.0086 * max(len(title), 1)) )
        self.ax.text(x + 0.08, cy, title, fontsize=tfs, weight="bold", family=MONO, va="center", zorder=4)
        cy += 0.19
        if path:
            self.ax.text(x + 0.08, cy, path + (f"  :{loc}" if loc else ""), fontsize=5.9, family=MONO,
                         color="#34495E", va="center", zorder=4)
            cy += 0.16
        if note:
            for line in note.split("\n"):
                self.ax.text(x + 0.08, cy, line, fontsize=6.3, family=SANS, color="#222222", va="center",
                             zorder=4)
                cy += 0.145
        self.boxes[key] = (x, y, w, h)

    def _pt(self, key, side, frac=0.5):
        x, y, w, h = self.boxes[key]
        return {"top": (x + w * frac, y), "bottom": (x + w * frac, y + h),
                "left": (x, y + h * frac), "right": (x + w, y + h * frac)}[side]

    def arrow(self, a, sa, b, sb, label=None, color="#333333", ls="-", fa=0.5, fb=0.5, rad=0.0, lx=0, ly=0):
        p1 = self._pt(a, sa, fa); p2 = self._pt(b, sb, fb)
        self.ax.add_patch(FancyArrowPatch(p1, p2, arrowstyle="-|>", mutation_scale=9, lw=1.0, color=color,
                                          ls=ls, connectionstyle=f"arc3,rad={rad}", zorder=1.5,
                                          shrinkA=1, shrinkB=1))
        if label:
            mx, my = (p1[0] + p2[0]) / 2 + lx, (p1[1] + p2[1]) / 2 + ly
            self.ax.text(mx, my, label, fontsize=5.8, family=SANS, color=color, ha="center", va="center",
                         style="italic", zorder=5,
                         bbox=dict(fc="white", ec="none", pad=0.6, alpha=0.9))

    def path(self, pts, label=None, color="#333333", ls="-", lpos=None):
        for (x1, y1), (x2, y2) in zip(pts[:-2], pts[1:-1]):
            self.ax.plot([x1, x2], [y1, y2], color=color, lw=1.0, ls=ls, zorder=1.5)
        self.ax.add_patch(FancyArrowPatch(pts[-2], pts[-1], arrowstyle="-|>", mutation_scale=9, lw=1.0,
                                          color=color, ls=ls, zorder=1.5, shrinkA=0, shrinkB=1))
        if label and lpos:
            self.ax.text(lpos[0], lpos[1], label, fontsize=5.8, family=SANS, color=color, ha="center",
                         va="center", style="italic", zorder=5, bbox=dict(fc="white", ec="none", pad=0.6, alpha=0.9))

    def elbow(self, a, b, gx, label=None, fa=0.5, fb=0.5, **kw):
        # from a's right (or left) edge into gap column gx, vertical, then into b's left (or right) edge
        ax_, ay, aw, ah = self.boxes[a]; bx, by, bw, bh = self.boxes[b]
        sx = ax_ + aw if gx > ax_ + aw / 2 else ax_
        tx = bx if gx < bx + bw / 2 else bx + bw
        p = [(sx, ay + ah * fa), (gx, ay + ah * fa), (gx, by + bh * fb), (tx, by + bh * fb)]
        self.path(p, label, lpos=(gx, (p[1][1] + p[2][1]) / 2) if label else None, **kw)

    def text(self, x, y, s, **kw):
        base = dict(fontsize=7, family=SANS, va="center")
        base.update(kw)
        self.ax.text(x, y, s, **base)

    def save(self, path):
        self.fig.savefig(path, dpi=220)
