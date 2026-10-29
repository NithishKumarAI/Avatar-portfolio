import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type CharacterType = 'humanoid' | 'cyber';

export class CharacterModel {
  public group: THREE.Group;
  public mixer: THREE.AnimationMixer | null = null;
  public actions: Map<string, THREE.AnimationAction> = new Map();
  public isLoaded: boolean = false;
  public characterType: CharacterType = 'humanoid';
  private loadId: number = 0;

  private headBone: THREE.Object3D | null = null;
  private currentActionName: string = '';
  private animClock: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'CharacterRoot';
  }

  public async load(type: CharacterType = 'humanoid'): Promise<void> {
    const currentId = ++this.loadId;
    this.characterType = type;
    this.isLoaded = false;
    this.actions.clear();

    const loader = new GLTFLoader();
    const modelUrl = type === 'humanoid' ? '/models/Xbot.glb' : '/models/RobotExpressive.glb';

    return new Promise((resolve, reject) => {
      loader.load(
        modelUrl,
        (gltf) => {
          if (currentId !== this.loadId) return; // Stale concurrent load, drop it

          // Clear previous children completely
          this.group.clear();
          const model = gltf.scene;

          // Enable shadow casting and receiving on all character meshes
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              // Enhance material styling
              if (mesh.material && !Array.isArray(mesh.material)) {
                const stdMat = mesh.material as THREE.MeshStandardMaterial;
                stdMat.roughness = 0.35;
                stdMat.metalness = 0.55;
              }
            }

            // Detect head bone for speech bubble anchoring
            const name = child.name.toLowerCase();
            if (name.includes('head') && !name.includes('top') && !name.includes('end')) {
              this.headBone = child;
            }
          });

          // Scale and ground adjustment
          if (type === 'humanoid') {
            // Xbot is native Mixamo unit, sits at 1.0 scale
            model.scale.set(1.0, 1.0, 1.0);
            model.position.set(0, 0, 0);
          } else {
            // RobotExpressive is smaller, scale to human height ~1.8m
            model.scale.set(0.65, 0.65, 0.65);
            model.position.set(0, 0, 0);
          }

          this.group.add(model);
          this.mixer = new THREE.AnimationMixer(model);

          if (type === 'humanoid') {
            this.setupHumanoidAnimations(gltf.animations);
          } else {
            this.setupCyberAnimations(gltf.animations);
          }

          // Initial pose: Start with wave / idle
          this.playAction('wave', 0.2);

          this.isLoaded = true;
          resolve();
        },
        undefined,
        (err) => {
          console.error('Failed to load character GLB:', err);
          reject(err);
        }
      );
    });
  }

  private setupHumanoidAnimations(clips: THREE.AnimationClip[]) {
    if (!this.mixer) return;

    // 1. Built-in Idle and Walk
    let idleClip: THREE.AnimationClip | undefined;
    clips.forEach((clip) => {
      const name = clip.name.toLowerCase();
      if (name.includes('idle')) {
        idleClip = clip;
        this.actions.set('idle', this.mixer!.clipAction(clip));
      } else if (name.includes('walk')) {
        this.actions.set('walk', this.mixer!.clipAction(clip));
      } else if (name.includes('agree')) {
        this.actions.set('agree', this.mixer!.clipAction(clip));
      }
    });

    // 2. Synthesize High-Quality Greeting Wave Clip for Xbot
    const waveClip = this.createHumanoidWaveClip(idleClip);
    this.actions.set('wave', this.mixer.clipAction(waveClip));

    // 3. Synthesize Clean Sit Clip for Xbot
    const sitClip = this.createHumanoidSitClip(idleClip);
    this.actions.set('sit', this.mixer.clipAction(sitClip));

    // 4. Synthesize Typing Clip for Xbot
    const typingClip = this.createHumanoidTypingClip(idleClip);
    this.actions.set('typing', this.mixer.clipAction(typingClip));
  }

  private setupCyberAnimations(clips: THREE.AnimationClip[]) {
    if (!this.mixer) return;

    clips.forEach((clip) => {
      const name = clip.name;
      if (name === 'Idle') this.actions.set('idle', this.mixer!.clipAction(clip));
      if (name === 'Wave') this.actions.set('wave', this.mixer!.clipAction(clip));
      if (name === 'Walking') this.actions.set('walk', this.mixer!.clipAction(clip));
      if (name === 'Sitting') this.actions.set('sit', this.mixer!.clipAction(clip));
      if (name === 'ThumbsUp') this.actions.set('thumbsUp', this.mixer!.clipAction(clip));
    });

    // Alias typing to sitting with active motion
    if (this.actions.has('sit')) {
      this.actions.set('typing', this.actions.get('sit')!);
    }
  }

  private createHumanoidWaveClip(idleClip?: THREE.AnimationClip): THREE.AnimationClip {
    // Preserve natural relaxed idle body posture (left arm hanging down, spine breathing)
    const tracks: THREE.KeyframeTrack[] = idleClip
      ? idleClip.tracks
          .filter(
            (t) =>
              !t.name.startsWith('mixamorigRightArm') &&
              !t.name.startsWith('mixamorigRightForeArm') &&
              !t.name.startsWith('mixamorigRightHand')
          )
          .map((t) => t.clone())
      : [];

    const times = [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4];
    const qArmRest = new THREE.Quaternion(0.104, 0.095, 0.532, 0.835);
    const qArmUp = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0.2, 1.8));

    const qForeRest = new THREE.Quaternion(0, 0, 0, 1);
    const qForeBent = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 1.4));

    const qHandRest = new THREE.Quaternion(0, 0, 0, 1);
    const qHandLeft = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.45));
    const qHandRight = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.45));

    const armValues = [
      ...qArmRest.toArray(),
      ...qArmUp.toArray(),
      ...qArmUp.toArray(),
      ...qArmUp.toArray(),
      ...qArmUp.toArray(),
      ...qArmUp.toArray(),
      ...qArmRest.toArray(),
    ];

    const foreValues = [
      ...qForeRest.toArray(),
      ...qForeBent.toArray(),
      ...qForeBent.toArray(),
      ...qForeBent.toArray(),
      ...qForeBent.toArray(),
      ...qForeBent.toArray(),
      ...qForeRest.toArray(),
    ];

    const handValues = [
      ...qHandRest.toArray(),
      ...qHandLeft.toArray(),
      ...qHandRight.toArray(),
      ...qHandLeft.toArray(),
      ...qHandRight.toArray(),
      ...qHandLeft.toArray(),
      ...qHandRest.toArray(),
    ];

    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightArm.quaternion', times, armValues));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightForeArm.quaternion', times, foreValues));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightHand.quaternion', times, handValues));

    return new THREE.AnimationClip('wave', 2.5, tracks);
  }

  private createHumanoidSitClip(idleClip?: THREE.AnimationClip): THREE.AnimationClip {
    const tracks: THREE.KeyframeTrack[] = idleClip
      ? idleClip.tracks
          .filter(
            (t) =>
              !t.name.startsWith('mixamorigHips.position') &&
              !t.name.startsWith('mixamorigLeftUpLeg') &&
              !t.name.startsWith('mixamorigRightUpLeg') &&
              !t.name.startsWith('mixamorigLeftLeg') &&
              !t.name.startsWith('mixamorigRightLeg') &&
              !t.name.startsWith('mixamorigLeftArm') &&
              !t.name.startsWith('mixamorigRightArm') &&
              !t.name.startsWith('mixamorigLeftForeArm') &&
              !t.name.startsWith('mixamorigRightForeArm')
          )
          .map((t) => t.clone())
      : [];

    const times = [0, 1.0];
    const qThigh = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    const qKnee = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    const qLeftArm = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0.2, -0.6));
    const qRightArm = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, -0.2, 0.6));
    const qLeftFore = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -1.2));
    const qRightFore = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 1.2));

    // Lower hips in local units (rest is ~104cm, chair is ~56cm)
    const hipPos = [0, 56.0, 2.07];

    tracks.push(new THREE.VectorKeyframeTrack('mixamorigHips.position', times, [...hipPos, ...hipPos]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigLeftUpLeg.quaternion', times, [...qThigh.toArray(), ...qThigh.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightUpLeg.quaternion', times, [...qThigh.toArray(), ...qThigh.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigLeftLeg.quaternion', times, [...qKnee.toArray(), ...qKnee.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightLeg.quaternion', times, [...qKnee.toArray(), ...qKnee.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigLeftArm.quaternion', times, [...qLeftArm.toArray(), ...qLeftArm.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightArm.quaternion', times, [...qRightArm.toArray(), ...qRightArm.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigLeftForeArm.quaternion', times, [...qLeftFore.toArray(), ...qLeftFore.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightForeArm.quaternion', times, [...qRightFore.toArray(), ...qRightFore.toArray()]));

    return new THREE.AnimationClip('sit', 1.0, tracks);
  }

  private createHumanoidTypingClip(idleClip?: THREE.AnimationClip): THREE.AnimationClip {
    const tracks: THREE.KeyframeTrack[] = idleClip
      ? idleClip.tracks
          .filter(
            (t) =>
              !t.name.startsWith('mixamorigHips.position') &&
              !t.name.startsWith('mixamorigLeftUpLeg') &&
              !t.name.startsWith('mixamorigRightUpLeg') &&
              !t.name.startsWith('mixamorigLeftLeg') &&
              !t.name.startsWith('mixamorigRightLeg') &&
              !t.name.startsWith('mixamorigLeftArm') &&
              !t.name.startsWith('mixamorigRightArm') &&
              !t.name.startsWith('mixamorigLeftForeArm') &&
              !t.name.startsWith('mixamorigRightForeArm') &&
              !t.name.startsWith('mixamorigLeftHand') &&
              !t.name.startsWith('mixamorigRightHand')
          )
          .map((t) => t.clone())
      : [];

    const times = [0, 0.25, 0.5, 0.75, 1.0];
    const qThigh = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    const qKnee = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    const qLeftArm = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0.2, -0.6));
    const qRightArm = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, -0.2, 0.6));
    const qLeftFore = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -1.2));
    const qRightFore = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 1.2));

    // Alternating wrist taps for typing
    const qTapLeft1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.15, 0, -0.05));
    const qTapLeft2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, 0, 0.02));
    const qTapRight1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, 0, 0.02));
    const qTapRight2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.15, 0, -0.05));

    const hipPos = [0, 56.0, 2.07];

    tracks.push(new THREE.VectorKeyframeTrack('mixamorigHips.position', [0, 1.0], [...hipPos, ...hipPos]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigLeftUpLeg.quaternion', [0, 1.0], [...qThigh.toArray(), ...qThigh.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightUpLeg.quaternion', [0, 1.0], [...qThigh.toArray(), ...qThigh.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigLeftLeg.quaternion', [0, 1.0], [...qKnee.toArray(), ...qKnee.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightLeg.quaternion', [0, 1.0], [...qKnee.toArray(), ...qKnee.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigLeftArm.quaternion', [0, 1.0], [...qLeftArm.toArray(), ...qLeftArm.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightArm.quaternion', [0, 1.0], [...qRightArm.toArray(), ...qRightArm.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigLeftForeArm.quaternion', [0, 1.0], [...qLeftFore.toArray(), ...qLeftFore.toArray()]));
    tracks.push(new THREE.QuaternionKeyframeTrack('mixamorigRightForeArm.quaternion', [0, 1.0], [...qRightFore.toArray(), ...qRightFore.toArray()]));

    tracks.push(
      new THREE.QuaternionKeyframeTrack('mixamorigLeftHand.quaternion', times, [
        ...qTapLeft1.toArray(),
        ...qTapLeft2.toArray(),
        ...qTapLeft1.toArray(),
        ...qTapLeft2.toArray(),
        ...qTapLeft1.toArray(),
      ])
    );
    tracks.push(
      new THREE.QuaternionKeyframeTrack('mixamorigRightHand.quaternion', times, [
        ...qTapRight1.toArray(),
        ...qTapRight2.toArray(),
        ...qTapRight1.toArray(),
        ...qTapRight2.toArray(),
        ...qTapRight1.toArray(),
      ])
    );

    return new THREE.AnimationClip('typing', 1.0, tracks);
  }

  public playAction(name: string, fadeDuration: number = 0.3) {
    if (!this.mixer) return;
    const targetAction = this.actions.get(name);
    if (!targetAction) return;

    if (this.currentActionName === name) return;

    const prevAction = this.actions.get(this.currentActionName);
    if (prevAction) {
      prevAction.fadeOut(fadeDuration);
    }

    targetAction.reset();
    targetAction.setEffectiveTimeScale(1);
    targetAction.setEffectiveWeight(1);
    targetAction.fadeIn(fadeDuration);
    targetAction.play();

    this.currentActionName = name;
  }

  public update(progress: number, delta: number) {
    if (!this.isLoaded || !this.mixer) return;
    this.animClock += delta;

    // Update skeletal mixer
    this.mixer.update(delta);

    // 1. Scene 1: Welcome (0.00 -> 0.20)
    // Character on right side of stage, facing user
    if (progress <= 0.20) {
      this.group.position.set(1.5, 0, 0);
      this.group.rotation.y = -0.22;

      if (progress < 0.08) {
        this.playAction('wave', 0.25);
      } else {
        this.playAction('idle', 0.4);
      }
    }
    // 2. Scene 2: Walking & About Me (0.20 -> 0.45)
    // Avatar turns towards workstation and walks left across the virtual floor
    else if (progress > 0.20 && progress <= 0.45) {
      const t = (progress - 0.20) / 0.25; // 0.0 -> 1.0
      // Turn left towards desk (-PI / 2)
      this.group.rotation.y = -0.22 - t * (Math.PI / 2 - 0.22);

      // Walk from x = 1.5 to x = -1.2, z from 0 to -0.3
      const curX = 1.5 - t * 2.7;
      const curZ = 0 - t * 0.3;
      this.group.position.set(curX, 0, curZ);

      this.playAction('walk', 0.2);
    }
    // 3. Scene 3: Workstation Transition & Sitting (0.45 -> 0.65)
    // Reaches chair at x = -1.5, z = -0.48, turns to face desk, sits down
    else if (progress > 0.45 && progress <= 0.65) {
      const t = (progress - 0.45) / 0.20; // 0.0 -> 1.0
      const curX = -1.2 - t * 0.3;
      const curZ = -0.3 - t * 0.18;
      this.group.position.set(curX, 0, curZ);

      // Rotate to face desk
      this.group.rotation.y = -Math.PI / 2 + t * (Math.PI / 2 + 0.2);

      if (t > 0.3) {
        this.playAction('sit', 0.35);
      } else {
        this.playAction('walk', 0.2);
      }
    }
    // 4. Scene 4 & 5: Seated at Workstation, Typing (0.65 -> 1.00)
    else {
      this.group.position.set(-1.5, 0, -0.48);
      this.group.rotation.y = 0.2;
      this.playAction('typing', 0.3);
    }
  }

  // Returns 2D screen coordinates of character head for anchoring speech bubble
  public getHeadScreenPosition(camera: THREE.Camera, width: number, height: number): { x: number; y: number; visible: boolean } {
    const headPos = new THREE.Vector3();
    if (this.headBone) {
      this.headBone.getWorldPosition(headPos);
      headPos.y += 0.25; // slightly above head
    } else {
      // Default estimate based on group position + standing height ~1.85m
      this.group.getWorldPosition(headPos);
      headPos.y += 1.85;
    }

    const projected = headPos.clone().project(camera);
    const visible = projected.z < 1.0 && projected.x >= -1.2 && projected.x <= 1.2 && projected.y >= -1.2 && projected.y <= 1.2;

    const x = (projected.x * 0.5 + 0.5) * width;
    const y = (-(projected.y * 0.5) + 0.5) * height;

    return { x, y, visible };
  }

  public dispose() {
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
  }
}
