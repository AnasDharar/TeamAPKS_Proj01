gsap.registerPlugin(ScrollTrigger);

let scene, camera, renderer;
let toothpasteModel, toothpasteGroup;
let dropletsGroup; // small droplet meshes

init();
animate();

function init() {
  // Basic Three.js setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(3, 10, 10);
  scene.add(dirLight);

  // Load Toothpaste Model
  const loader = new THREE.GLTFLoader();
  loader.load('toothpaste.gltf', (gltf) => {
    toothpasteModel = gltf.scene;

    // Group to move/scale the toothpaste
    toothpasteGroup = new THREE.Group();
    toothpasteGroup.add(toothpasteModel);
    scene.add(toothpasteGroup);

    // Center the model so pivot is at center
    const box = new THREE.Box3().setFromObject(toothpasteModel);
    const center = box.getCenter(new THREE.Vector3());
    toothpasteModel.position.sub(center);

    // Position & rotate so it's pointing outward
    toothpasteGroup.position.set(0, -2, 0);
    toothpasteGroup.scale.set(0.15, 0.15, 0.15);
    toothpasteModel.rotation.set(0, 0, 0);

    // Create 3 droplet spheres
    dropletsGroup = createDroplets3D(3);
    scene.add(dropletsGroup);

    // Create scroll animation
    createScrollAnimation();
  });

  window.addEventListener('resize', onWindowResize);
}

// function createDroplets3D(count) {
//   const group = new THREE.Group();
//   const geometry = new THREE.SphereGeometry(0.06, 16, 16);
//   const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
//   for (let i = 0; i < count; i++) {
//     const drop = new THREE.Mesh(geometry, material.clone());
//     drop.visible = false;
//     group.add(drop);
//   }
//   return group;
// }

function createScrollAnimation() {
  // Increase total scroll length to 3000
  // Each tween's duration is 1 for slower spin
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#container',
      start: 'top top',
      end: '+=3000',
      scrub: true,
      pin: true
    }
  });

  // Move toothpaste to center & slightly forward
  tl.to(toothpasteGroup.position, {
    y: 0,
    z: 0.75,
    duration: 1
  });

  // Rotate to point at user
  tl.to(toothpasteModel.rotation, {
    x: Math.PI * 0.05,
    y: Math.PI,
    duration: 1
  }, '<');

  // // Lower the droplets so they spawn from a lower cap
  // const capLocal = new THREE.Vector3(0, 0.1, 0.8);
  // toothpasteModel.localToWorld(capLocal);

  // Fire off droplets
  dropletsGroup.children.forEach((drop, i) => {
    const delay = i * 0.3;
    tl.set(drop, { visible: true }, `+=${delay}`);
    tl.set(drop.position, { x: capLocal.x, y: capLocal.y, z: capLocal.z });

    const randX = (Math.random() -
