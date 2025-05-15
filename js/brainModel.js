import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

class BrainViewer {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.controls = null;
    this.brain = null;
    
    this.init();
  }

  init() {
    // Setup renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera.position.z = 50;

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 10;
    this.controls.maxDistance = 80;
    this.controls.rotateSpeed = 3.0;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.enableDamping = true;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x880808, 0.9);
    this.scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    this.camera.add(pointLight);
    this.scene.add(this.camera);

    // Load brain model
    this.loadBrainModel();

    // Add event listeners
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation loop
    this.animate();
  }

  loadBrainModel() {
    const manager = new THREE.LoadingManager();
    const loader = new OBJLoader(manager);
    
    // Add loading indicator
    this.container.innerHTML = '<div class="loading">Loading brain model...</div>';

    loader.load(
      '/models/freesurff.obj', // Update this path to match your model location
      (object) => {
        this.brain = object;
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
              color: 0x6a0dad,
              specular: 0x444444,
              shininess: 30
            });
          }
        });
        this.scene.add(object);
        this.container.querySelector('.loading')?.remove();
      },
      (xhr) => {
        const percent = (xhr.loaded / xhr.total * 100);
        const loading = this.container.querySelector('.loading');
        if (loading) {
          loading.textContent = `Loading brain model... ${Math.round(percent)}%`;
        }
      },
      (error) => {
        console.error('Error loading brain model:', error);
        this.container.innerHTML = '<div class="error">Error loading brain model</div>';
      }
    );
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

export default BrainViewer;