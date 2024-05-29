import {useEffect, useRef} from 'react';
import * as THREE from 'three';
import './FloorPlan.css'
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {demoFloorPlan} from "./DemoFloorPlan.ts";
import {Volt} from "./FlootPlan";

export const FloorPlan = () => {

  const mountRef = useRef<HTMLDivElement | null>(null);
  // const objects = useRef<THREE.Object3D[]>([]);
  const objects = useRef<THREE.Mesh[]>([]);
  const scene = useRef(new THREE.Scene());
  const boxGeometry = useRef(new THREE.BoxGeometry(20, 20, 20).toNonIndexed());

  const spawnRandomCube = () => {
    const boxMaterial = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      flatShading: true,
      vertexColors: true
    });
    boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace);

    const box = new THREE.Mesh(boxGeometry.current, boxMaterial);
    box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
    box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
    box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

    scene.current.add(box);
    objects.current.push(box);
  }

  const wallMaterialExterior = new THREE.MeshStandardMaterial({color: 0xff8080});
  const wallMaterialInterior = new THREE.MeshStandardMaterial({color: 0x8080ff});

  const spawnWall = (wall: Volt.Wall, material: THREE.Material) => {
    // Create the wall geometry
    const width = Math.abs(wall.x2 - wall.x1);
    const height = wall.height;
    const depth = Math.abs(wall.y2 - wall.y1);
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);


    // Create the wall mesh
    const wallMesh = new THREE.Mesh(wallGeometry, material);

    // Position the wall mesh
    wallMesh.position.set(
      (wall.x1 + wall.x2) / 2, // X position (centered between x1 and x2)
      height / 2,              // Y position (half the height)
      (wall.y1 + wall.y2) / 2  // Z position (centered between y1 and y2)
    );

    // Add the wall mesh to the scene
    scene.current.add(wallMesh);
  }

  // Create a material for the window (e.g., a transparent material to simulate glass)
  const windowMaterial = new THREE.MeshStandardMaterial({color: 0x2020ff});
  // const windowMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA, opacity: 0.6, transparent: true});

  const spawnWindow = (windowStructure: Volt.Window) => {
    // Create the window geometry
    const windowWidth = windowStructure.width;
    const windowHeight = windowStructure.height;
    const windowDepth = windowStructure.depth;
    const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);

    // Create the window mesh
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);

    // Position the window mesh
    const windowCenterX = (windowStructure.leftPositionX + windowStructure.rightPositionX) / 2;
    const windowCenterY = windowStructure.distanceFromFloor + (windowHeight / 2);
    const windowCenterZ = (windowStructure.leftPositionY + windowStructure.rightPositionY) / 2;
    windowMesh.position.set(windowCenterX, windowCenterY, windowCenterZ);

    // Rotate the window to align with the wall if necessary
    const windowAngle = Math.atan2(
      windowStructure.rightPositionY - windowStructure.leftPositionY,
      windowStructure.rightPositionX - windowStructure.leftPositionX
    );
    windowMesh.rotation.y = -windowAngle; // Adjust the rotation direction if needed

    // Add the window mesh to the scene
    scene.current.add(windowMesh);
  }

  const spawnFloorPlan = () => {
    demoFloorPlan.levels.forEach((level) => {
      level.walls.filter(_ => _.type === 'EXTERIOR').forEach(w => spawnWall(w, wallMaterialExterior))
      level.walls.filter(_ => _.type === 'INTERIOR').forEach(w => spawnWall(w, wallMaterialInterior))
      level.locations.forEach((location) => {
        location.windows.forEach(spawnWindow)
      })
    })
  }

  const spawnCubeZero = () => {
    const boxMaterial = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      flatShading: true,
      vertexColors: true
    });
    boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace);

    const box = new THREE.Mesh(boxGeometry.current, boxMaterial);
    box.position.x = 0; // Right/Left
    box.position.y = 10; // Up/Down
    box.position.z = -100; // Front/Back

    scene.current.add(box);
    objects.current.push(box);
  }

  useEffect(() => {

    let camera, renderer, controls;

    objects.current = [];

    let raycaster;

    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;

    let prevTime = performance.now();
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const vertex = new THREE.Vector3();
    const color = new THREE.Color();

    init();
    animate();

    function init() {
      if (!mountRef.current) return

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.y = 10;

      scene.current.background = new THREE.Color(0xffffff);
      scene.current.fog = new THREE.Fog(0xffffff, 0, 750);

      const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 2.5);
      light.position.set(0.5, 1, 0.75);
      scene.current.add(light);

      controls = new PointerLockControls(camera, document.body);

      const blocker = document.getElementById('blocker');
      const instructions = document.getElementById('instructions');

      instructions.addEventListener('click', function () {

        controls.lock();

      });

      controls.addEventListener('lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

      });

      controls.addEventListener('unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

      });

      scene.current.add(controls.getObject());

      const onKeyDown = function (event: KeyboardEvent) {

        switch (event.code) {

          case 'ArrowUp':
          case 'KeyW':
            moveForward = true;
            break;

          case 'ArrowLeft':
          case 'KeyA':
            moveLeft = true;
            break;

          case 'ArrowDown':
          case 'KeyS':
            moveBackward = true;
            break;

          case 'ArrowRight':
          case 'KeyD':
            moveRight = true;
            break;

          case 'Space':
            if (canJump === true) velocity.y += 350;
            canJump = false;
            break;

        }

      };

      const onKeyUp = function (event: KeyboardEvent) {

        switch (event.code) {

          case 'ArrowUp':
          case 'KeyW':
            moveForward = false;
            break;

          case 'ArrowLeft':
          case 'KeyA':
            moveLeft = false;
            break;

          case 'ArrowDown':
          case 'KeyS':
            moveBackward = false;
            break;

          case 'ArrowRight':
          case 'KeyD':
            moveRight = false;
            break;

        }

      };

      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);

      raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

      // floor

      let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
      floorGeometry.rotateX(-Math.PI / 2);

      // vertex displacement

      let floorPosition = floorGeometry.attributes.position;

      for (let i = 0, l = floorPosition.count; i < l; i++) {

        vertex.fromBufferAttribute(floorPosition, i);

        vertex.x += Math.random() * 20 - 10;
        // vertex.y += Math.random() * 2; // Don't use this, it will make the floor height very random (too high, or low).
        vertex.y += Math.random() * .01; // Floor height almost zero.
        vertex.z += Math.random() * 20 - 10;

        floorPosition.setXYZ(i, vertex.x, vertex.y, vertex.z);

      }

      floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

      floorPosition = floorGeometry.attributes.position;
      const colorsFloor = [];

      for (let i = 0, l = floorPosition.count; i < l; i++) {

        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace);
        colorsFloor.push(color.r, color.g, color.b);

      }

      floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsFloor, 3));

      const floorMaterial = new THREE.MeshBasicMaterial({vertexColors: true});

      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      scene.current.add(floor);

      // objects

      const boxPosition = boxGeometry.current.attributes.position;
      const colorsBox = [];

      for (let i = 0, l = boxPosition.count; i < l; i++) {

        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75, THREE.SRGBColorSpace);
        colorsBox.push(color.r, color.g, color.b);

      }

      boxGeometry.current.setAttribute('color', new THREE.Float32BufferAttribute(colorsBox, 3));

      // Don't spawn cubes for now
      // for (let i = 0; i < 500; i++) {
      //   spawnRandomCube()
      // }
      spawnCubeZero()
      spawnFloorPlan()

      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      // Original appended to the body, but in react we append to a div within this component.
      // document.body.appendChild(renderer.domElement);
      mountRef.current.appendChild(renderer.domElement);

      //

      window.addEventListener('resize', onWindowResize);

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {

      requestAnimationFrame(animate);

      const time = performance.now();

      if (controls.isLocked === true) {

        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects(objects.current, false);

        const onObject = intersections.length > 0;

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (onObject === true) {

          velocity.y = Math.max(0, velocity.y);
          canJump = true;

        }

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta); // new behavior

        if (controls.getObject().position.y < 10) {

          velocity.y = 0;
          controls.getObject().position.y = 10;

          canJump = true;

        }

      }

      prevTime = time;

      renderer.render(scene.current, camera);

    }

    // Clean up on unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div id="blocker">
        <div id="instructions">
          <p style={{fontSize: '36px'}}>
            Click to play
          </p>
          <p>
            Move: WASD<br/>
            Jump: SPACE<br/>
            Look: MOUSE
          </p>
        </div>
      </div>
      <div style={{position: 'fixed', top: 0, left: 0, padding: '0 8px', backgroundColor: 'rgba(0,0,0,.5)'}}>Press M to
        add box
      </div>
      <div ref={mountRef}/>
    </>
  )
}