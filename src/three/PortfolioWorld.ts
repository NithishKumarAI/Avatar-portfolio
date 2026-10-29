import * as THREE from 'three';
import { StudioEnvironment } from './Environment';
import { Workstation } from './Workstation';
import { CharacterModel, type CharacterType } from './CharacterModel';
import { CameraDirector } from './CameraDirector';

export interface WorldTelemetry {
  fps: number;
  frameTimeMs: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  characterLoaded: boolean;
  activeAction: string;
}

export class PortfolioWorld {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public cameraDirector: CameraDirector;
  public environment: StudioEnvironment;
  public workstation: Workstation;
  public character: CharacterModel;

  private canvas: HTMLCanvasElement;
  private isRunning: boolean = false;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;
  private progress: number = 0;

  // Telemetry tracking
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private currentFps: number = 60;
  private currentFrameTime: number = 16.6;
  private lastAction: string = '';
  public onTelemetry?: (stats: WorldTelemetry) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030712);
    this.scene.fog = new THREE.FogExp2(0x030712, 0.035);

    // 2. Camera Director
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    this.cameraDirector = new CameraDirector(42, width / height, 0.1, 100);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 4. Subsystems
    this.environment = new StudioEnvironment();
    this.scene.add(this.environment.group);

    this.workstation = new Workstation();
    this.scene.add(this.workstation.group);

    this.character = new CharacterModel();
    this.scene.add(this.character.group);
  }

  public setCharacterType(type: CharacterType) {
    if (this.character.characterType === type && this.character.isLoaded) return;
    this.character.load(type);
  }

  public updateProgress(p: number) {
    this.progress = Math.min(1, Math.max(0, p));
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private loop = () => {
    if (!this.isRunning) return;

    const startMs = performance.now();
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // 1. Update Camera
    this.cameraDirector.update(this.progress);

    // 2. Update Character
    this.character.update(this.progress, delta);

    // 3. Update Workstation (Monitor dynamic canvas, chair)
    this.workstation.update(this.progress, delta);

    // 4. Update Studio Environment (Lighting bloom, grid)
    this.environment.update(this.progress);

    // 5. Render Scene
    this.renderer.render(this.scene, this.cameraDirector.camera);

    const endMs = performance.now();
    this.currentFrameTime = endMs - startMs;
    this.frameCount++;

    const currentAction = (this.character as any).currentActionName || 'idle';
    const actionChanged = currentAction !== this.lastAction;

    if (endMs - this.lastTime >= 200 || actionChanged) {
      this.lastAction = currentAction;
      this.currentFps = Math.round((this.frameCount * 1000) / Math.max(1, endMs - this.lastTime));
      this.frameCount = 0;
      this.lastTime = endMs;

      if (this.onTelemetry) {
        this.onTelemetry({
          fps: this.currentFps,
          frameTimeMs: parseFloat(this.currentFrameTime.toFixed(2)),
          drawCalls: this.renderer.info.render.calls,
          triangles: this.renderer.info.render.triangles,
          geometries: this.renderer.info.memory.geometries,
          textures: this.renderer.info.memory.textures,
          characterLoaded: this.character.isLoaded,
          activeAction: currentAction,
        });
      }
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  public getSpeechBubbleAnchor(): { x: number; y: number; visible: boolean } {
    return this.character.getHeadScreenPosition(
      this.cameraDirector.camera,
      this.canvas.clientWidth || window.innerWidth,
      this.canvas.clientHeight || window.innerHeight
    );
  }

  public resize(width: number, height: number) {
    this.cameraDirector.resize(width, height);
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  public dispose() {
    this.stop();
    this.environment.dispose();
    this.workstation.dispose();
    this.character.dispose();
    this.renderer.dispose();
  }
}
