"""Generates the Voyager Dreadnought's 4K PBR texture sets and the 4K space backdrop (Voyager 2.17.1).

Run:  python3 -I tools/make-dreadnought-textures.py
Writes Voyager_Versus/dist/materials/dreadnought-{basecolor,normal,orm,emissive}-{1024,2048,4096}.webp,
space-{2048,4096}.webp and planet-{2048,4096}.webp. Everything is procedural (no third-party art), seeded,
and the hull maps tile seamlessly (periodic noise; panel layout aligned to the tile edges).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / 'Voyager_Versus' / 'dist' / 'materials'
N = 4096
rng = np.random.default_rng(2017)


def periodic_noise(n, beta, seed, lo=2):
    """Tileable fractal noise in [0,1]: white noise shaped by 1/f^beta in frequency space."""
    r = np.random.default_rng(seed)
    f = np.fft.fftfreq(n) * n
    fx, fy = np.meshgrid(f, f)
    k = np.sqrt(fx * fx + fy * fy)
    k[0, 0] = 1
    amp = 1.0 / k ** beta
    amp[k < lo] = 0
    spec = (r.normal(size=(n, n)) + 1j * r.normal(size=(n, n))) * amp
    img = np.real(np.fft.ifft2(spec)).astype(np.float32)
    img -= img.min(); img /= img.max() + 1e-9
    return img


def box_blur_rect_v(a, r):
    c = np.cumsum(np.concatenate([a[-r - 1:], a, a[:r]], 0), 0)
    return ((c[2 * r + 1:] - c[:-2 * r - 1]) / (2 * r + 1)).astype(np.float32)


def box_blur(a, r):
    """Fast separable box blur with wrap-around (keeps tiling)."""
    if r <= 0:
        return a
    out = a.copy()
    for axis in (0, 1):
        c = np.cumsum(np.concatenate([out.take(range(-r - 1, 0), axis=axis), out, out.take(range(0, r), axis=axis)], axis=axis), axis=axis)
        hi = c.take(range(2 * r + 1, c.shape[axis]), axis=axis)
        lo = c.take(range(0, c.shape[axis] - 2 * r - 1), axis=axis)
        out = (hi - lo) / (2 * r + 1)
    return out.astype(np.float32)


def hull_maps():
    print('Hull: panels…', flush=True)
    height = np.zeros((N, N), np.float32)
    tint = np.zeros((N, N), np.float32)
    tone = np.zeros((N, N), np.float32)       # 1 = second paint tone (warm grey)
    paint = np.zeros((N, N), np.float32)      # 1 = painted (red) plates
    hazard = np.zeros((N, N), np.float32)
    vents = np.zeros((N, N), np.float32)
    emissive = np.zeros((N, N, 3), np.float32)
    edge = np.full((N, N), 999.0, np.float32)  # distance to the nearest plate edge, px
    rivet_mask = np.zeros((N, N), np.float32)
    plates = []

    def split(x, y, w, h, depth):
        if depth > 0 and (w > 220 or h > 220) and (depth > 3 or rng.random() < .82):
            if (w > h and rng.random() < .8) or h <= 220:
                c = int(w * rng.uniform(.3, .7)) // 16 * 16
                if 96 <= c <= w - 96:
                    split(x, y, c, h, depth - 1); split(x + c, y, w - c, h, depth - 1); return
            else:
                c = int(h * rng.uniform(.3, .7)) // 16 * 16
                if 96 <= c <= h - 96:
                    split(x, y, w, c, depth - 1); split(x, y + c, w, h - c, depth - 1); return
        plates.append((x, y, w, h))

    cell = 512
    for gy in range(0, N, cell):
        for gx in range(0, N, cell):
            split(gx, gy, cell, cell, 5)
    yy, xx = np.mgrid[0:cell * 2, 0:cell * 2]
    for (x, y, w, h) in plates:
        sl = (slice(y, y + h), slice(x, x + w))
        py, px = np.mgrid[0:h, 0:w]
        d = np.minimum(np.minimum(px, w - 1 - px), np.minimum(py, h - 1 - py)).astype(np.float32)
        edge[sl] = np.minimum(edge[sl], d)
        base = rng.uniform(-.06, .06)
        bevel = np.clip(d / 10.0, 0, 1)
        height[sl] = base + .12 * bevel
        tint[sl] = rng.normal(0, .07)
        if rng.random() < .24:
            tone[sl] = 1
        if rng.random() < .008 and w * h < 60000:
            paint[sl] = 1
        if rng.random() < .03 and w > 160 and h > 120:          # hazard chevrons on a strip of the plate
            s = slice(y + h - 40, y + h - 12), slice(x + 16, x + w - 16)
            hy, hx = np.mgrid[s[0], s[1]]
            hazard[s] = ((hx + hy) // 22 % 2).astype(np.float32)
        if rng.random() < .09 and w > 140 and h > 140:           # louvred vent panel
            vw, vh = int(w * .55), int(h * .45)
            vx, vy = x + (w - vw) // 2, y + (h - vh) // 2
            vy2, vx2 = np.mgrid[vy:vy + vh, vx:vx + vw]
            groove = (np.sin((vy2 - vy) / vh * np.pi * (vh // 14)) ** 2).astype(np.float32)
            height[vy:vy + vh, vx:vx + vw] -= .18 * groove + .06
            vents[vy:vy + vh, vx:vx + vw] = 1
        if rng.random() < .07 and w > 120 and h > 80:            # inset access hatch
            hw, hh = int(w * rng.uniform(.3, .5)), int(h * rng.uniform(.3, .5))
            hx0, hy0 = x + rng.integers(20, max(21, w - hw - 20)), y + rng.integers(20, max(21, h - hh - 20))
            height[hy0:hy0 + hh, hx0:hx0 + hw] -= .05
            height[hy0:hy0 + 3, hx0:hx0 + hw] -= .12; height[hy0 + hh - 3:hy0 + hh, hx0:hx0 + hw] -= .12
            height[hy0:hy0 + hh, hx0:hx0 + 3] -= .12; height[hy0:hy0 + hh, hx0 + hw - 3:hx0 + hw] -= .12
        if rng.random() < .35:                                   # rivet lines along plate edges
            for (ry, rx0, rx1) in ((y + 9, x + 12, x + w - 12), (y + h - 10, x + 12, x + w - 12)):
                for rx in range(rx0, rx1, 22):
                    rivet_mask[max(0, ry - 3):ry + 4, max(0, rx - 3):rx + 4] = 1
        if rng.random() < .012 and w >= 160:                     # a row of lit portholes
            ry = y + h // 2
            for rx in range(x + 30, x + w - 30, 34):
                c = np.array([1.0, .78, .5]) if rng.random() < .15 else np.array([.75, .9, 1.0])
                emissive[ry - 4:ry + 5, rx - 9:rx + 10] = c * rng.uniform(.6, 1)
                height[ry - 6:ry + 7, rx - 11:rx + 12] -= .08

    # Seams: deep narrow grooves on every plate edge.
    seam = np.clip(1 - edge / 3.0, 0, 1)
    height -= .45 * seam
    yy, xx = np.mgrid[-3:4, -3:4]
    rivet_kernel = np.clip(1 - (xx * xx + yy * yy) / 10.0, 0, 1)
    # Rivets: small domes.
    rv = box_blur(rivet_mask, 1)
    height += .22 * np.clip(rv * 1.6, 0, 1)

    print('Hull: weathering…', flush=True)
    n_large = periodic_noise(N, 1.9, 11)
    n_mid = periodic_noise(N, 1.4, 12, lo=8)
    n_fine = periodic_noise(N, .9, 13, lo=64)
    height += .04 * (n_fine - .5)

    # Cavity / AO: how far below its surroundings each texel is.
    blurred = box_blur(height, 6)
    cavity = np.clip((blurred - height) * 4, 0, 1)
    ao = np.clip(1 - cavity * .85 - box_blur(seam, 4) * .35, 0, 1)

    # Vertical run-off streaks (noise stretched down the plates).
    streak = box_blur_rect_v(periodic_noise(N, 1.2, 14, lo=24), 60)
    grime = np.clip((streak - .5) * 2.2, 0, 1) * .35 + np.clip((n_large - .35) * 1.6, 0, 1) * .45 + np.clip(box_blur(seam, 10) * 1.4, 0, 1) * .35
    grime = np.clip(grime + (n_mid - .5) * .25, 0, 1)
    scorch = np.clip((n_large - .78) * 6, 0, 1) * np.clip((n_mid - .45) * 3, 0, 1)
    wear = np.clip(1 - edge / 6.0, 0, 1) * (1 - seam) * np.clip((n_fine - .45) * 3, 0, 1)

    # Physically based layering: painted (dielectric) armour over steel. Paint chips and wears through at
    # plate edges and in random flecks, exposing bright bare metal; seams and vents are dark unpainted metal.
    chip_noise = box_blur(periodic_noise(N, 1.15, 15, lo=40), 1)
    chip = np.clip((chip_noise + np.clip(1 - edge / 9.0, 0, 1) * .31 + grime * .12 - .74) * 10, 0, 1) * np.clip(1 - seam * 3, 0, 1)
    bare_zone = vents
    slate = np.array([.042, .046, .052], np.float32)
    warm = np.array([.06, .058, .054], np.float32)
    red = np.array([.115, .021, .023], np.float32)
    yellow = np.array([.62, .43, .05], np.float32)
    paint_col = slate[None, None, :] * (1 - tone[..., None]) + warm[None, None, :] * tone[..., None]
    paint_col = paint_col * (1 - paint[..., None]) + red[None, None, :] * paint[..., None]
    paint_col = paint_col * (1 + tint[..., None]) * (1 + .18 * (n_mid[..., None] - .5))
    paint_col = paint_col * (1 - hazard[..., None]) + yellow[None, None, :] * hazard[..., None]
    paint_col = paint_col * (1 - .45 * grime[..., None]) + np.array([.03, .028, .025]) * .45 * grime[..., None]
    steel = np.array([.56, .565, .58], np.float32) * (.86 + .14 * n_fine[..., None])
    dark_steel = np.array([.09, .092, .095], np.float32)
    metal_col = steel * (1 - bare_zone[..., None]) + dark_steel * bare_zone[..., None]
    metal_w = np.clip(chip + bare_zone, 0, 1)
    col = paint_col * (1 - metal_w[..., None]) + metal_col * metal_w[..., None]
    soot = np.array([.018, .017, .016], np.float32)
    col = col * (1 - .85 * scorch[..., None]) + soot * .85 * scorch[..., None]
    col *= (.82 + .18 * ao[..., None]) * (1 - .9 * seam[..., None])
    base = np.clip(col, 0, 1)

    rough_paint = .52 + .12 * (n_mid - .5) + .22 * grime + .05 * (n_fine - .5) - .08 * paint
    rough_metal = .26 + .1 * (n_fine - .5) + .3 * bare_zone
    rough = np.clip(rough_paint * (1 - metal_w) + rough_metal * metal_w + .3 * scorch, .08, .98)
    metal = np.clip(metal_w * (1 - scorch), 0, 1)

    print('Hull: normals…', flush=True)
    gx = (np.roll(height, -1, 1) - np.roll(height, 1, 1)) * 2.2
    gy = (np.roll(height, -1, 0) - np.roll(height, 1, 0)) * 2.2
    nz = np.ones_like(height)
    nrm = np.stack([-gx, gy, nz], -1)   # OpenGL convention (green up), as three.js expects
    nrm /= np.linalg.norm(nrm, axis=-1, keepdims=True)
    normal = nrm * .5 + .5

    to8 = lambda a: (np.clip(a, 0, 1) * 255 + .5).astype(np.uint8)
    srgb = lambda a: np.where(a <= .0031308, a * 12.92, 1.055 * np.power(np.clip(a, 0, 1), 1 / 2.4) - .055)
    maps = {
        'basecolor': Image.fromarray(to8(srgb(base))),
        'normal': Image.fromarray(to8(normal)),
        'orm': Image.fromarray(to8(np.stack([ao, rough, metal], -1))),
        'emissive': Image.fromarray(to8(srgb(emissive))),
    }
    for name, img in maps.items():
        for size in (4096, 2048, 1024):
            im = img if size == N else img.resize((size, size), Image.LANCZOS)
            path = OUT / f'dreadnought-{name}-{size}.webp'
            im.save(path, 'WEBP', quality=90 if name != 'normal' else 94, method=6)
            print(' ', path.name, path.stat().st_size // 1024, 'KB', flush=True)


def space():
    print('Space backdrop…', flush=True)
    W, H = 4096, 2304
    r = np.random.default_rng(77)
    def fbm(seed, beta, lo=1):
        n = periodic_noise(4096, beta, seed, lo)
        return n[:H, :W]
    a, b, c = fbm(21, 2.1), fbm(22, 1.7, 4), fbm(23, 1.2, 16)
    mask = np.clip((a - .42) * 2.6, 0, 1) ** 1.3
    ridge = 1 - np.abs(b * 2 - 1)
    detail = np.clip(ridge ** 3 * 1.6, 0, 1) * np.clip((c - .25) * 1.8, 0, 1)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # Warm glow behind where the Dreadnought sits (right), cold nebula on the left.
    warm = np.exp(-(((xx - W * .7) / (W * .32)) ** 2 + ((yy - H * .4) / (H * .5)) ** 2))
    cold = np.exp(-(((xx - W * .22) / (W * .35)) ** 2 + ((yy - H * .72) / (H * .45)) ** 2))
    neb = mask * (.18 + 1.1 * detail)
    col = np.zeros((H, W, 3), np.float32)
    col += neb[..., None] * (warm[..., None] * np.array([.55, .12, .22]) + cold[..., None] * np.array([.08, .28, .5]) + .06)
    dust = np.clip((b - .62) * 4, 0, 1) * mask
    col *= (1 - .6 * dust[..., None])
    col += np.array([.006, .008, .016])
    # Stars: many faint, a few bright with soft halos and diffraction spikes.
    n_stars = 14000
    sx, sy = r.integers(0, W, n_stars), r.integers(0, H, n_stars)
    mag = r.random(n_stars) ** 7 * .9 + .015
    temp = r.random(n_stars)
    star = np.zeros((H, W, 3), np.float32)
    tint = np.stack([.85 + .15 * temp, .88 + .08 * temp, 1.0 - .2 * temp], -1)
    np.add.at(star, (sy, sx), tint * mag[:, None] * 1.6)
    halo = box_blur_rect(star, 2) * 2.0 + box_blur_rect(star, 9) * 1.2
    col += star + halo
    for i in np.argsort(mag)[-14:]:
        x, y, m = sx[i], sy[i], mag[i]
        L = int(30 + 90 * m)
        for dx, dy in ((1, 0), (0, 1)):
            t = np.arange(-L, L + 1)
            px, py = np.clip(x + t * dx, 0, W - 1), np.clip(y + t * dy, 0, H - 1)
            col[py, px] += (np.exp(-np.abs(t) / (L * .25)) * .6 * m)[:, None] * tint[i]
    col = 1 - np.exp(-col * 1.4)     # gentle tone map
    srgb = np.where(col <= .0031308, col * 12.92, 1.055 * np.power(np.clip(col, 0, 1), 1 / 2.4) - .055)
    img = Image.fromarray((np.clip(srgb, 0, 1) * 255 + .5).astype(np.uint8))
    for size in (4096, 2048):
        im = img if size == 4096 else img.resize((2048, 1152), Image.LANCZOS)
        p = OUT / f'space-{size}.webp'; im.save(p, 'WEBP', quality=88, method=6); print(' ', p.name, p.stat().st_size // 1024, 'KB', flush=True)


def box_blur_rect(a, r):
    if r <= 0:
        return a
    out = a
    for axis in (0, 1):
        pad = [(0, 0)] * a.ndim; pad[axis] = (r + 1, r)
        c = np.cumsum(np.pad(out, pad, mode='edge'), axis=axis)
        n = out.shape[axis]
        out = (c.take(range(2 * r + 1, 2 * r + 1 + n), axis=axis) - c.take(range(0, n), axis=axis)) / (2 * r + 1)
    return out.astype(np.float32)


def planet():
    print('Planet…', flush=True)
    W, H = 4096, 2048
    n1 = periodic_noise(4096, 1.6, 31)[:H]
    n2 = periodic_noise(4096, 1.1, 32, lo=12)[:H]
    lat = (np.mgrid[0:H, 0:W][0] / H - .5) * np.pi
    warp = (n1 - .5) * 1.6 + (n2 - .5) * .5
    bands = np.sin(lat * 14 + warp * 2.2) * .5 + .5
    bands2 = np.sin(lat * 37 + warp * 4.5) * .5 + .5
    t = np.clip(.55 * bands + .3 * bands2 + .15 * n2, 0, 1)
    stops = np.array([[.05, .08, .12], [.16, .24, .32], [.38, .46, .52], [.62, .58, .52], [.30, .36, .42]], np.float32)
    idx = t * (len(stops) - 1)
    i0 = np.floor(idx).astype(int).clip(0, len(stops) - 2)
    f = (idx - i0)[..., None]
    col = stops[i0] * (1 - f) + stops[i0 + 1] * f
    # A great storm.
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    storm = np.exp(-(((xx - W * .62) / 160) ** 2 + ((yy - H * .58) / 70) ** 2))
    col = col * (1 - storm[..., None] * .6) + np.array([.75, .52, .38]) * storm[..., None] * .6
    srgb = np.where(col <= .0031308, col * 12.92, 1.055 * np.power(np.clip(col, 0, 1), 1 / 2.4) - .055)
    img = Image.fromarray((np.clip(srgb, 0, 1) * 255 + .5).astype(np.uint8))
    for size in (4096, 2048):
        im = img if size == 4096 else img.resize((2048, 1024), Image.LANCZOS)
        p = OUT / f'planet-{size}.webp'; im.save(p, 'WEBP', quality=88, method=6); print(' ', p.name, p.stat().st_size // 1024, 'KB', flush=True)


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    which = sys.argv[1:] or ['hull', 'space', 'planet']
    if 'hull' in which: hull_maps()
    if 'space' in which: space()
    if 'planet' in which: planet()
