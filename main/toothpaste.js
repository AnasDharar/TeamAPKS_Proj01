gsap.registerPlugin(ScrollTrigger);

    let scene, camera, renderer;
    let toothpasteModel, toothpasteGroup;
    let dropletsGroup; // small droplet meshes

    init();
    animate();

    function init() {
      scene = new THREE.Scene();
      // scene.background = new THREE.Color(0x000000);

      camera = new THREE.PerspectiveCamera(
        45,
        500 / 500,
        0.1,
        100
      );
      camera.position.set(0, 0, 5);
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true  // Add this line
      });
      renderer.setClearColor(0x000000, 0); // Add this line for full transparency
      renderer.setSize(500,500);
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
        toothpasteGroup.scale.set(0.15, 0.15, 0.1);
        toothpasteModel.rotation.set(1, 0, 0);


        // Create scroll animation
        createScrollAnimation();
      });

      window.addEventListener('resize', onWindowResize);
    }


    function createScrollAnimation() {
      /* FIX #1: Increase total scroll length to 2500,
                and each tween's duration from 0.5 to 1 for slower spin */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#container',
          start: 'top top',
          end: '+=3500',
          scrub: true,
          pin: true
        }
      });

      // Move toothpaste to center & slightly forward
      tl.to(toothpasteGroup.position, {
        y: 0,
        z: 0.75,
        duration: 0.5
      });

      // Rotate to point at user
      tl.to(toothpasteModel.rotation, {
        x: Math.PI * 0.05,
        y: Math.PI,
        duration: 1
      }, '<');

      
      // Show big splash image & text
      tl.to('#big-splash-container', {
        duration: 0.2,
        opacity: 1,
        ease: 'power2.inOut'
      }, '+=0.5');

      // Hide big splash
      tl.to('#big-splash-container', {
        duration: 1,
        opacity: 0,
        ease: 'power2.inOut'
      }, '+=2.0');

      // Move toothpaste away
      tl.to(toothpasteGroup.position, {
        y: 2,
        duration: 1,
        ease: 'power1.inOut'
      }, '<');
    }

    function onWindowResize() {
      camera.aspect = 500 / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(500, 500);
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }