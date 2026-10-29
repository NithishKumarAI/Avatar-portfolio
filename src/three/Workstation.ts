import * as THREE from 'three';

export class Workstation {
  public group: THREE.Group;
  public chairGroup: THREE.Group;
  public monitorScreenMesh: THREE.Mesh;
  public screenCanvas: HTMLCanvasElement;
  public screenContext: CanvasRenderingContext2D | null;
  public screenTexture: THREE.CanvasTexture;
  private screenMaterial: THREE.MeshStandardMaterial;
  private animTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Workstation';
    // Placed on left side of the virtual stage
    this.group.position.set(-1.6, 0, -0.6);
    this.group.rotation.y = 0.2; // slightly angled toward viewer

    // 1. Build Desk
    this.buildDesk();

    // 2. Build Monitor with Dynamic Robin PA Display
    const { screenMesh, canvas, ctx, texture, material } = this.buildMonitor();
    this.monitorScreenMesh = screenMesh;
    this.screenCanvas = canvas;
    this.screenContext = ctx;
    this.screenTexture = texture;
    this.screenMaterial = material;

    // 3. Build Ergonomic Chair
    this.chairGroup = this.buildChair();
    this.group.add(this.chairGroup);

    // 4. Build Peripherals (Keyboard, Mouse, Desk Mat)
    this.buildPeripherals();
  }

  private buildDesk() {
    const deskGroup = new THREE.Group();

    // Tabletop: 2.2m x 0.9m x 0.05m at height 0.73m
    const topGeo = new THREE.BoxGeometry(2.2, 0.05, 0.9);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.3,
    });
    const tabletop = new THREE.Mesh(topGeo, topMat);
    tabletop.position.y = 0.73;
    tabletop.castShadow = true;
    tabletop.receiveShadow = true;
    deskGroup.add(tabletop);

    // Metal Frame & Dual-motor Legs
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.8,
    });

    // Left & Right Leg Columns
    const legGeo = new THREE.BoxGeometry(0.08, 0.70, 0.08);
    const footGeo = new THREE.BoxGeometry(0.10, 0.04, 0.75);

    [-0.9, 0.9].forEach((x) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.35, 0);
      leg.castShadow = true;
      deskGroup.add(leg);

      const foot = new THREE.Mesh(footGeo, legMat);
      foot.position.set(x, 0.02, 0);
      foot.castShadow = true;
      deskGroup.add(foot);
    });

    // Crossbar
    const crossbarGeo = new THREE.BoxGeometry(1.72, 0.04, 0.06);
    const crossbar = new THREE.Mesh(crossbarGeo, legMat);
    crossbar.position.set(0, 0.55, 0);
    deskGroup.add(crossbar);

    this.group.add(deskGroup);
  }

  private buildMonitor() {
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 0.755, -0.22);

    // Ultrawide Screen Stand Arm
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.85,
    });
    const baseGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 32);
    const base = new THREE.Mesh(baseGeo, standMat);
    base.position.set(0, 0.01, -0.15);
    monitorGroup.add(base);

    const armGeo = new THREE.BoxGeometry(0.04, 0.36, 0.04);
    const arm = new THREE.Mesh(armGeo, standMat);
    arm.position.set(0, 0.18, -0.15);
    arm.rotation.x = 0.1;
    monitorGroup.add(arm);

    // Dynamic 2D Canvas for Robin UI
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    // Curved Ultrawide Display (1.4m wide x 0.52m tall)
    const screenGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.52, 48, 1, true, -Math.PI / 8.5, Math.PI / 4.25);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.2,
      metalness: 0.1,
      emissive: 0xffffff,
      emissiveMap: texture,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide,
    });

    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.36, 2.18);
    screenMesh.rotation.y = Math.PI;
    screenMesh.castShadow = true;
    monitorGroup.add(screenMesh);

    // Monitor Bezel Frame
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.5,
    });
    const backGeo = new THREE.CylinderGeometry(2.42, 2.42, 0.54, 48, 1, true, -Math.PI / 8.3, Math.PI / 4.15);
    const backMesh = new THREE.Mesh(backGeo, bezelMat);
    backMesh.position.set(0, 0.36, 2.18);
    backMesh.rotation.y = Math.PI;
    monitorGroup.add(backMesh);

    this.group.add(monitorGroup);

    return {
      screenMesh,
      canvas,
      ctx,
      texture,
      material: screenMat,
    };
  }

  private buildChair(): THREE.Group {
    const chair = new THREE.Group();
    // Default rest position in front of desk
    chair.position.set(0, 0, 0.45);

    const chairMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.6,
      metalness: 0.2,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      roughness: 0.3,
      metalness: 0.85,
    });

    // 5-Star Caster Base
    const starCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16), metalMat);
    starCenter.position.y = 0.08;
    chair.add(starCenter);

    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.32), metalMat);
      leg.position.set(Math.sin(angle) * 0.16, 0.06, Math.cos(angle) * 0.16);
      leg.rotation.y = angle;
      chair.add(leg);
    }

    // Hydraulic Stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.36, 16), metalMat);
    stem.position.y = 0.26;
    chair.add(stem);

    // Contoured Seat Cushion at height ~0.48m
    const seatGeo = new THREE.BoxGeometry(0.56, 0.08, 0.52);
    const seat = new THREE.Mesh(seatGeo, chairMat);
    seat.position.set(0, 0.46, 0);
    seat.castShadow = true;
    chair.add(seat);

    // Mesh High Backrest
    const backGeo = new THREE.BoxGeometry(0.52, 0.68, 0.06);
    const back = new THREE.Mesh(backGeo, chairMat);
    back.position.set(0, 0.82, 0.24);
    back.rotation.x = -0.12; // comfortable ergonomic tilt
    back.castShadow = true;
    chair.add(back);

    // Headrest
    const headrestGeo = new THREE.BoxGeometry(0.30, 0.14, 0.08);
    const headrest = new THREE.Mesh(headrestGeo, chairMat);
    headrest.position.set(0, 1.20, 0.30);
    headrest.rotation.x = -0.15;
    chair.add(headrest);

    // Ergonomic 4D Armrests
    [-0.28, 0.28].forEach((x) => {
      const armPost = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.04), metalMat);
      armPost.position.set(x, 0.56, 0.02);
      chair.add(armPost);

      const armPad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.26), chairMat);
      armPad.position.set(x, 0.68, 0.02);
      chair.add(armPad);
    });

    return chair;
  }

  private buildPeripherals() {
    const periGroup = new THREE.Group();
    periGroup.position.set(0, 0.755, 0.1);

    // Desk Mat (Dark Wool Felt / Leather)
    const matGeo = new THREE.BoxGeometry(0.9, 0.004, 0.42);
    const matMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
    });
    const deskMat = new THREE.Mesh(matGeo, matMat);
    deskMat.position.set(0, 0.002, 0);
    deskMat.receiveShadow = true;
    periGroup.add(deskMat);

    // Mechanical Keyboard (75% Form Factor)
    const kbChassis = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.016, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 })
    );
    kbChassis.position.set(-0.06, 0.01, 0.02);
    kbChassis.castShadow = true;
    periGroup.add(kbChassis);

    // Keycaps Surface with Subtle RGB Underglow
    const keycaps = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.01, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.4,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
      })
    );
    keycaps.position.set(-0.06, 0.02, 0.02);
    periGroup.add(keycaps);

    // Wireless Precision Mouse
    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.03, 0.11),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.4 })
    );
    mouse.position.set(0.24, 0.016, 0.02);
    mouse.castShadow = true;
    periGroup.add(mouse);

    // Coffee Mug with subtle cyan accent
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.036, 0.09, 24),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.2 })
    );
    mug.position.set(0.55, 0.045, -0.06);
    mug.castShadow = true;
    periGroup.add(mug);

    this.group.add(periGroup);
  }

  public update(progress: number, delta: number) {
    this.animTime += delta;

    // Chair slide reaction when character approaches and sits
    // At Scene 3 (0.45 -> 0.65), chair slides slightly forward to meet avatar
    if (progress >= 0.45 && progress <= 0.65) {
      const sitNorm = (progress - 0.45) / 0.20;
      // Gently rolls forward under desk
      this.chairGroup.position.z = 0.45 - sitNorm * 0.12;
    } else if (progress > 0.65) {
      this.chairGroup.position.z = 0.33;
    } else {
      this.chairGroup.position.z = 0.45;
    }

    // Dynamic Robin Display rendering on Canvas
    const ctx = this.screenContext;
    if (!ctx) return;

    const w = this.screenCanvas.width;
    const h = this.screenCanvas.height;

    // If before Scene 3, monitor is asleep or dim standby
    if (progress < 0.38) {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1e293b';
      ctx.font = '20px system-ui, sans-serif';
      ctx.fillText('STANDBY // AWAITING OPERATOR', w / 2 - 160, h / 2);
      this.screenMaterial.emissiveIntensity = 0.1;
      this.screenTexture.needsUpdate = true;
      return;
    }

    // Monitor is active! Render radiant Robin Neural UI
    const brightness = Math.min(1, (progress - 0.38) / 0.18);
    this.screenMaterial.emissiveIntensity = 0.4 + brightness * 0.8;

    // Background Cyber Dark Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#060814');
    bgGrad.addColorStop(0.5, '#0b0f26');
    bgGrad.addColorStop(1, '#050711');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative Circuit Grid Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 30; y < h; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Central Radiant Robin Neural Orb
    const cx = w * 0.32;
    const cy = h * 0.50;
    const pulse = Math.sin(this.animTime * 3) * 6;
    const radius = 64 + pulse;

    // Outer Glow Rings
    const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 1.8);
    glowGrad.addColorStop(0, 'rgba(217, 70, 239, 0.85)');
    glowGrad.addColorStop(0.4, 'rgba(147, 51, 234, 0.4)');
    glowGrad.addColorStop(0.8, 'rgba(6, 182, 212, 0.2)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Core Orb
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    coreGrad.addColorStop(0, '#fdf4ff');
    coreGrad.addColorStop(0.3, '#d946ef');
    coreGrad.addColorStop(0.7, '#8b5cf6');
    coreGrad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting Filament Rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 1.25, radius * 0.45, this.animTime * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // Right Side: Project Header & Live Telemetry Panel
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText('ROBIN // FLAGSHIP ASSISTANT', w * 0.54, 80);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('LOCAL-FIRST WINDOWS PERSONAL AI', w * 0.54, 110);

    // Status Cards
    const metrics = [
      { label: 'ARCHITECTURE', val: 'Agentic Micro-Kernel' },
      { label: 'PRIVACY & SECURITY', val: '100% On-Device Offline' },
      { label: 'SPEECH LATENCY', val: '< 145ms Real-Time' },
      { label: 'SEMANTIC MEMORY', val: 'Active Recall Engine' },
    ];

    metrics.forEach((m, idx) => {
      const cardY = 145 + idx * 56;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(w * 0.54, cardY, 410, 46, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(m.label, w * 0.54 + 14, cardY + 18);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(m.val, w * 0.54 + 14, cardY + 36);
    });

    // Animated Audio Waveforms at Bottom
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 60; x < w - 60; x += 10) {
      const freq = Math.sin(x * 0.05 + this.animTime * 6) * Math.cos(x * 0.02 + this.animTime * 3);
      const waveY = h - 50 + freq * 20;
      if (x === 60) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }
    ctx.stroke();

    this.screenTexture.needsUpdate = true;
  }

  public dispose() {
    this.screenTexture.dispose();
  }
}
