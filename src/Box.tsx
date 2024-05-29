import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Box: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // color and intensity
    scene.add(ambientLight);

    // Add directional light (optional)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // color and intensity
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create a box
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const cube = new THREE.Mesh(boxGeo, material);
    cube.position.x = 0
    cube.position.y = 0
    cube.position.z = 0
    scene.add(cube);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Box;
