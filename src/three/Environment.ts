import * as THREE from 'three';

export class StudioEnvironment {
  public group: THREE.Group;
  public floorMesh: THREE.Mesh;
  public gridHelper: THREE.GridHelper;
  public keyLight: THREE.DirectionalLight;
  public fillLight: THREE.DirectionalLight;
  public rimLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public monitorGlowLight: THREE.PointLight;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'StudioEnvironment';

    // 1. Ambient Lighting
    this.ambientLight = new THREE.AmbientLight(0x0f172a, 0.9);
    this.group.add(this.ambientLight);

    // 2. Key Directional Light (Soft White with High-Res Shadows)
    this.keyLight = new THREE.DirectionalLight(0xf8fafc, 1.8);
    this.keyLight.position.set(4, 8, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.camera.left = -6;
    this.keyLight.shadow.camera.right = 6;
    this.keyLight.shadow.camera.top = 6;
    this.keyLight.shadow.camera.bottom = -6;
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.radius = 2.5;
    this.group.add(this.keyLight);

    // 3. Cyan Fill Light (Cyber/AI Accent)
    this.fillLight = new THREE.DirectionalLight(0x06b6d4, 0.9);
    this.fillLight.position.set(-6, 4, 3);
    this.group.add(this.fillLight);

    // 4. Violet Rim/Backlight (Cinematic Silhouette Edge)
    this.rimLight = new THREE.DirectionalLight(0x8b5cf6, 1.4);
    this.rimLight.position.set(0, 5, -6);
    this.group.add(this.rimLight);

    // 5. Workstation Monitor Glow Light (Illuminates avatar and desk in Scene 3 & 4)
    this.monitorGlowLight = new THREE.PointLight(0xa855f7, 0, 8, 2);
    this.monitorGlowLight.position.set(-1.6, 1.25, -0.3);
    this.group.add(this.monitorGlowLight);

    // 6. High-End Studio Reflective Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050814,
      roughness: 0.28,
      metalness: 0.65,
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.receiveShadow = true;
    this.group.add(this.floorMesh);

    // 7. Subtle Cyber Grid for Spatial Depth & Perspective
    this.gridHelper = new THREE.GridHelper(40, 40, 0x38bdf8, 0x1e293b);
    this.gridHelper.position.y = 0.002;
    if (Array.isArray(this.gridHelper.material)) {
      this.gridHelper.material.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.15;
      });
    } else {
      this.gridHelper.material.transparent = true;
      this.gridHelper.material.opacity = 0.15;
    }
    this.group.add(this.gridHelper);

    // 8. Subtle Geometric Accent Pillars in Deep Background
    this.createBackgroundAccents();
  }

  private createBackgroundAccents() {
    const pillarGeo = new THREE.BoxGeometry(0.12, 12, 0.12);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.2,
    });

    const positions = [
      [-10, 6, -12],
      [-5, 6, -14],
      [5, 6, -14],
      [10, 6, -12],
    ];

    positions.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(pillarGeo, glowMat);
      pillar.position.set(x, y, z);
      this.group.add(pillar);
    });
  }

  public update(progress: number) {
    // Monitor glow activates during Scene 3 (0.45+) and peaks at Scene 4 (0.65-0.85)
    if (progress < 0.40) {
      this.monitorGlowLight.intensity = 0;
    } else if (progress < 0.60) {
      const factor = (progress - 0.40) / 0.20;
      this.monitorGlowLight.intensity = factor * 2.2;
    } else {
      this.monitorGlowLight.intensity = 2.5;
    }
  }

  public dispose() {
    this.floorMesh.geometry.dispose();
    if (Array.isArray(this.floorMesh.material)) {
      this.floorMesh.material.forEach((m) => m.dispose());
    } else {
      this.floorMesh.material.dispose();
    }
    this.gridHelper.geometry.dispose();
    if (Array.isArray(this.gridHelper.material)) {
      this.gridHelper.material.forEach((m) => m.dispose());
    } else {
      this.gridHelper.material.dispose();
    }
  }
}
