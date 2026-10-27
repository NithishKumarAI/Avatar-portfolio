import os
import math
from PIL import Image, ImageDraw, ImageFilter

def create_wave_frames():
    src_path = 'public/scenes/scene_1_wave.jpg'
    out_dir = 'public/scenes/wave_test'
    os.makedirs(out_dir, exist_ok=True)

    base = Image.open(src_path).convert('RGBA')
    W, H = base.size

    # Hand bounding box in 1376x768
    # Wrist joint is roughly at (465, 540)
    hx1, hy1, hx2, hy2 = 380, 260, 580, 560
    wrist_x, wrist_y = 465, 540

    hand_crop = base.crop((hx1, hy1, hx2, hy2))
    
    # Create soft mask for the hand
    mask = Image.new('L', (hx2 - hx1, hy2 - hy1), 0)
    draw = ImageDraw.Draw(mask)
    # Oval covering hand and fingers
    draw.ellipse([20, 20, (hx2 - hx1) - 20, (hy2 - hy1) - 30], fill=255)
    # Feather edges
    mask = mask.filter(ImageFilter.GaussianBlur(12))

    # Also extract inpainting background patch to fill under hand when it tilts
    bg_patch = base.crop((hx1, hy1, hx2, hy2)).filter(ImageFilter.GaussianBlur(25))

    angles = [-8, -5, 0, 5, 8, 5, 0, -5, -8, -4, 0]
    
    for idx, angle in enumerate(angles):
        # Rotate hand around wrist
        # In PIL, rotate rotates around center of image.
        # So we expand crop to make wrist the center:
        pw = max(wrist_x - hx1, hx2 - wrist_x) * 2
        ph = max(wrist_y - hy1, hy2 - wrist_y) * 2
        padded_hand = Image.new('RGBA', (pw, ph), (0, 0, 0, 0))
        padded_mask = Image.new('L', (pw, ph), 0)

        ox = pw // 2 - (wrist_x - hx1)
        oy = ph // 2 - (wrist_y - hy1)

        padded_hand.paste(hand_crop, (ox, oy))
        padded_mask.paste(mask, (ox, oy))

        # Rotate around center (which is the wrist!)
        rot_hand = padded_hand.rotate(-angle, resample=Image.BICUBIC)
        rot_mask = padded_mask.rotate(-angle, resample=Image.BILINEAR)

        # Composite onto base
        frame = base.copy()
        # Paste blurred background patch first to prevent edge seams
        frame.paste(bg_patch, (hx1, hy1))
        # Paste rotated hand using mask
        frame.paste(rot_hand, (wrist_x - pw // 2, wrist_y - ph // 2), rot_mask)

        out_path = os.path.join(out_dir, f'wave_{idx:02d}.jpg')
        frame.convert('RGB').save(out_path, quality=92)
        print(f'Rendered frame {idx}: angle={angle}')

create_wave_frames()
