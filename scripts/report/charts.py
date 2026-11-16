# -*- coding: utf-8 -*-
"""レポート用チャート(matplotlib)。日本語フォントは Noto Sans CJK を使う。
可読性のため、ラベルは原則10pt以上・値はバーの外側に置く。"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
import numpy as np
import os

for path in [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
]:
    if os.path.exists(path):
        font_manager.fontManager.addfont(path)
plt.rcParams["font.family"] = "Noto Sans CJK JP"
plt.rcParams["axes.unicode_minus"] = False

NAVY = "#14335c"
TEAL = "#0e7c86"
SLATE = "#94a3b8"
ORANGE = "#f97316"
LIGHT = "#e2e8f0"
INK = "#1f2937"


def future_chart(years, pops, elderly, path):
    fig, ax1 = plt.subplots(figsize=(6.7, 3.0), dpi=200)
    ax1.plot(years, pops, color=NAVY, lw=2.6, marker="o", ms=5)
    ax1.fill_between(years, pops, color=NAVY, alpha=0.08)
    pts = list(zip(years[::2], pops[::2]))
    for j, (x, y) in enumerate(pts):
        if j == 0:
            ha, dx = "left", -4
        elif j == len(pts) - 1:
            ha, dx = "right", 4
        else:
            ha, dx = "center", 0
        ax1.annotate(f"{y:,}", (x, y), textcoords="offset points",
                     xytext=(dx, 9), ha=ha, fontsize=9.5, color=NAVY,
                     fontweight="bold",
                     bbox=dict(facecolor="white", alpha=0.85,
                               edgecolor="none", pad=1.2))
    ax1.set_xlim(years[0] - 1, years[-1] + 1)
    ax1.set_ylabel("人口(人)", fontsize=10.5)
    ax1.set_ylim(min(pops) * 0.8, max(pops) * 1.14)
    ax1.grid(axis="y", color=LIGHT, lw=0.7)
    ax1.tick_params(labelsize=10)
    for s in ["top", "right"]:
        ax1.spines[s].set_visible(False)
    ax2 = ax1.twinx()
    ax2.plot(years, elderly, color=ORANGE, lw=2.2, marker="s", ms=4, ls="--")
    ax2.set_ylabel("高齢化率(%)", fontsize=10.5, color=ORANGE)
    ax2.set_ylim(0, max(elderly) * 1.5)
    ax2.tick_params(labelsize=10, colors=ORANGE)
    ax2.spines["top"].set_visible(False)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def fiscal_bars(indicators, path):
    """indicators: [(label, target, pref, national, unit)] 横並び3本バー。
    値はバーの右端の外側に大きめの文字で置く。"""
    n = len(indicators)
    fig, axes = plt.subplots(n, 1, figsize=(6.7, 1.32 * n), dpi=200)
    if n == 1:
        axes = [axes]
    for ax, (label, tv, pv, nv, unit) in zip(axes, indicators):
        rows = [("当自治体", tv, NAVY), ("都道府県平均", pv, TEAL), ("全国平均", nv, SLATE)]
        rows = [r for r in rows if r[1] is not None]
        vmax = max(r[1] for r in rows)
        for i, (nm, v, col) in enumerate(rows):
            y = len(rows) - 1 - i
            ax.barh(y, v, height=0.6, color=col)
            ax.text(v + vmax * 0.025, y, f"{nm} {v:,.2f}{unit}", va="center",
                    fontsize=10, color=NAVY if nm == "当自治体" else "#334155",
                    fontweight="bold" if nm == "当自治体" else "normal")
        ax.set_yticks([])
        ax.set_xlim(0, vmax * 1.62)
        ax.set_title(label, fontsize=11, loc="left", color=INK, pad=3,
                     fontweight="bold")
        ax.tick_params(labelsize=9)
        for s in ["top", "right", "left"]:
            ax.spines[s].set_visible(False)
        ax.grid(axis="x", color=LIGHT, lw=0.6)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def radar_chart(labels, target_dev, path):
    n = len(labels)
    ang = np.linspace(0, 2 * np.pi, n, endpoint=False).tolist()
    tv = target_dev + target_dev[:1]
    ang2 = ang + ang[:1]
    avg = [50] * (n + 1)
    fig, ax = plt.subplots(figsize=(4.6, 4.6), dpi=200,
                           subplot_kw=dict(polar=True))
    ax.plot(ang2, avg, color=SLATE, lw=1.4, ls="--")
    ax.fill(ang2, avg, color=SLATE, alpha=0.10)
    ax.plot(ang2, tv, color=NAVY, lw=2.6)
    ax.fill(ang2, tv, color=NAVY, alpha=0.22)
    ax.set_xticks(ang)
    ax.set_xticklabels(labels, fontsize=10.5, color=INK)
    ax.tick_params(axis="x", pad=16)
    ax.set_ylim(15, 85)
    ax.set_yticks([30, 50, 70])
    ax.set_yticklabels(["30", "50", "70"], fontsize=9, color="#64748b")
    ax.grid(color=LIGHT)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def industry_chart(target_shares, national_shares, path):
    fig, ax = plt.subplots(figsize=(6.7, 1.9), dpi=200)
    labels = ["第1次産業", "第2次産業", "第3次産業"]
    colors = [TEAL, NAVY, ORANGE]
    for row, (shares, name) in enumerate([(national_shares, "全国平均"), (target_shares, "当自治体")]):
        left = 0
        for v, col, lb in zip(shares, colors, labels):
            ax.barh(row, v, left=left, color=col, height=0.55)
            if v >= 8:
                ax.text(left + v / 2, row, f"{lb} {v:.0f}%", ha="center",
                        va="center", fontsize=9.5, color="#fff", fontweight="bold")
            left += v
    ax.set_yticks([0, 1])
    ax.set_yticklabels(["全国平均", "当自治体"], fontsize=10.5)
    ax.set_xlim(0, 100)
    ax.set_xticks([0, 25, 50, 75, 100])
    ax.tick_params(labelsize=9.5)
    for s in ["top", "right", "left"]:
        ax.spines[s].set_visible(False)
    ax.grid(axis="x", color=LIGHT, lw=0.6)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def percentile_strip(items, path):
    """items: [(label, pct)] pct=上位%。ラベルはバーの上に置き、潰れないようにする。"""
    n = len(items)
    fig, ax = plt.subplots(figsize=(6.7, 0.86 * n + 0.3), dpi=200)
    for i, (label, pct) in enumerate(items):
        y = (n - 1 - i) * 1.0
        ax.barh(y, 100, color="#eef2f7", height=0.52)
        ax.barh(y, 10, color="#dbeafe", height=0.52)
        ax.plot([pct], [y], marker="o", ms=11, color=ORANGE,
                markeredgecolor="#fff", markeredgewidth=1.4, zorder=5)
        ax.text(0, y + 0.48, label, va="bottom", ha="left", fontsize=10.5,
                color=INK, fontweight="bold")
        ax.text(103, y, f"上位{pct:.0f}%", va="center", fontsize=10.5,
                color=NAVY, fontweight="bold")
    ax.set_xlim(-2.5, 118)
    ax.set_ylim(-0.55, n - 0.15)
    ax.axis("off")
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def scatter_position(xs, ys, tx, ty, target_name, xlabel, ylabel, path,
                     x_ref=None, y_ref=None, x_lim=None, y_lim=None,
                     quad_labels=None):
    """全自治体の散布図に当自治体を重ねる。quad_labels: {(qx,qy): text} 0/1の象限ラベル"""
    fig, ax = plt.subplots(figsize=(6.7, 3.6), dpi=200)
    ax.scatter(xs, ys, s=7, color=SLATE, alpha=0.45, linewidths=0)
    if x_ref is not None:
        ax.axvline(x_ref, color="#cbd5e1", lw=1.1, ls="--")
    if y_ref is not None:
        ax.axhline(y_ref, color="#cbd5e1", lw=1.1, ls="--")
    if x_lim:
        ax.set_xlim(*x_lim)
    if y_lim:
        ax.set_ylim(*y_lim)
    if quad_labels and x_lim and y_lim:
        for (qx, qy), txt in quad_labels.items():
            xx = x_lim[0] + (x_lim[1] - x_lim[0]) * (0.03 if qx == 0 else 0.97)
            yy = y_lim[0] + (y_lim[1] - y_lim[0]) * (0.05 if qy == 0 else 0.95)
            ax.text(xx, yy, txt, fontsize=10, color="#64748b",
                    ha="left" if qx == 0 else "right",
                    va="bottom" if qy == 0 else "top", fontweight="bold")
    ax.scatter([tx], [ty], s=190, color=ORANGE, edgecolors="#fff",
               linewidths=1.6, zorder=6)
    ax.annotate(target_name, (tx, ty), textcoords="offset points",
                xytext=(10, 10), fontsize=11.5, color=NAVY, fontweight="bold",
                bbox=dict(facecolor="white", alpha=0.85, edgecolor="none",
                          pad=1.2))
    ax.set_xlabel(xlabel, fontsize=10.5)
    ax.set_ylabel(ylabel, fontsize=10.5)
    ax.tick_params(labelsize=9.5)
    for s in ["top", "right"]:
        ax.spines[s].set_visible(False)
    ax.grid(color=LIGHT, lw=0.6)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def dependency_chart(rows, path):
    """rows: [(label, 2020値, 2050値)] 従属人口指数などの比較バー"""
    labels = [r[0] for r in rows]
    v20 = [r[1] for r in rows]
    v50 = [r[2] for r in rows]
    y = np.arange(len(rows))
    fig, ax = plt.subplots(figsize=(6.7, 0.78 * len(rows) + 1.0), dpi=200)
    ax.barh(y + 0.21, v20, height=0.38, color=SLATE, label="2020年")
    ax.barh(y - 0.21, v50, height=0.38, color=ORANGE, label="2050年(推計)")
    for yi, v in zip(y + 0.21, v20):
        ax.text(v + 2, yi, f"{v:.0f}", va="center", fontsize=10, color="#334155")
    for yi, v in zip(y - 0.21, v50):
        ax.text(v + 2, yi, f"{v:.0f}", va="center", fontsize=10, color=NAVY,
                fontweight="bold")
    ax.set_yticks(y)
    ax.set_yticklabels(labels, fontsize=10.5)
    ax.invert_yaxis()
    ax.set_xlim(0, max(v50 + v20) * 1.18)
    ax.legend(fontsize=9.5, loc="upper center", bbox_to_anchor=(0.5, -0.22),
              ncol=2, frameon=False)
    ax.tick_params(labelsize=9.5)
    for s in ["top", "right", "left"]:
        ax.spines[s].set_visible(False)
    ax.grid(axis="x", color=LIGHT, lw=0.6)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)
