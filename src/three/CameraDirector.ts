import * as THREE from 'three';

export interface CameraWaypoint {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

export class CameraDirector {
  public camera: THREE.PerspectiveCamera;
  private currentTarget: THREE.Vector3 = new THREE.Vector3(0.7, 1.05, 0);

  constructor(fov: number = 42, aspect: number = 16 / 9, near: number = 0.1, far: number = 100) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0.4, 1.45, 4.4);
    this.camera.lookAt(this.currentTarget);
  }

  // Calculate deterministic waypoint at any progress (0.0 -> 1.0)
  public getWaypoint(progress: number): CameraWaypoint {
    // Stage 1: Scene 1 Hero Welcome (0.00 -> 0.20)
    if (progress <= 0.20) {
      const pos = new THREE.Vector3(0.4, 1.45, 4.4);
      const target = new THREE.Vector3(0.7, 1.05, 0);
      return { pos, target };
    }

    // Stage 2: Scene 2 Walking & About Me (0.20 -> 0.45)
    if (progress <= 0.45) {
      const t = (progress - 0.20) / 0.25;
      const easeT = this.easeInOutCubic(t);

      const p1 = new THREE.Vector3(0.4, 1.45, 4.4);
      const p2 = new THREE.Vector3(-0.4, 1.40, 4.0);
      const pos = p1.lerp(p2, easeT);

      const t1 = new THREE.Vector3(0.7, 1.05, 0);
      const t2 = new THREE.Vector3(-0.6, 1.0, 0);
      const target = t1.lerp(t2, easeT);

      return { pos, target };
    }

    // Stage 3: Scene 3 Sitting Down at Workstation (0.45 -> 0.65)
    if (progress <= 0.65) {
      const t = (progress - 0.45) / 0.20;
      const easeT = this.easeInOutCubic(t);

      const p1 = new THREE.Vector3(-0.4, 1.40, 4.0);
      const p2 = new THREE.Vector3(-0.55, 1.28, 3.1);
      const pos = p1.lerp(p2, easeT);

      const t1 = new THREE.Vector3(-0.6, 1.0, 0);
      const t2 = new THREE.Vector3(-1.3, 0.95, -0.4);
      const target = t1.lerp(t2, easeT);

      return { pos, target };
    }

    // Stage 4: Scene 4 Flagship Projects (0.65 -> 0.85)
    if (progress <= 0.85) {
      const t = (progress - 0.65) / 0.20;
      const easeT = this.easeInOutCubic(t);

      const p1 = new THREE.Vector3(-0.55, 1.28, 3.1);
      const p2 = new THREE.Vector3(-0.48, 1.25, 2.9);
      const pos = p1.lerp(p2, easeT);

      const t1 = new THREE.Vector3(-1.3, 0.95, -0.4);
      const t2 = new THREE.Vector3(-1.25, 0.95, -0.4);
      const target = t1.lerp(t2, easeT);

      return { pos, target };
    }

    // Stage 5: Toolkit, Journey, Contact (0.85 -> 1.00)
    const t = (progress - 0.85) / 0.15;
    const easeT = this.easeInOutCubic(t);

    const p1 = new THREE.Vector3(-0.48, 1.25, 2.9);
    const p2 = new THREE.Vector3(0.0, 1.50, 4.4);
    const pos = p1.lerp(p2, easeT);

    const t1 = new THREE.Vector3(-1.25, 0.95, -0.4);
    const t2 = new THREE.Vector3(-0.5, 1.0, -0.2);
    const target = t1.lerp(t2, easeT);

    return { pos, target };
  }

  public update(progress: number, dampFactor: number = 0.08) {
    const { pos, target } = this.getWaypoint(progress);

    // Smoothly interpolate to target waypoint without jitter
    this.camera.position.lerp(pos, dampFactor);
    this.currentTarget.lerp(target, dampFactor);
    this.camera.lookAt(this.currentTarget);
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    // Adjust FOV for mobile portrait screens to keep character and workstation framed
    if (this.camera.aspect < 1.0) {
      this.camera.fov = 58;
    } else {
      this.camera.fov = 42;
    }
    this.camera.updateProjectionMatrix();
  }

  private easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
}
