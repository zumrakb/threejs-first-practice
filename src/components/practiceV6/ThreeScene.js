/* Sahne, Kamera ve Işıklandırma */
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function ThreeScene({ mountRef, cameraRef, sceneRef, controlsRef }) {
  const rendererRef = useRef(null); // Renderer'ı saklamak için useRef kullanıyoruz

  useEffect(() => {
    if (!mountRef.current) return; // mountRef'in null olup olmadığını kontrol et

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer; // Renderer'ı useRef'e kaydediyoruz

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Işıklar
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
    hemisphereLight.position.set(0, 50, 0);
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(15, 40, 35);
    scene.add(spotLight);

    // Sahnedeki nesne sayısını kontrol et
    console.log("Scene children count:", scene.children.length);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (mountRef.current && rendererRef.current) {
        rendererRef.current.setSize(
          mountRef.current.clientWidth,
          mountRef.current.clientHeight
        );
        camera.aspect =
          mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      // Renderer temizliği
      rendererRef.current.dispose();
    };
  }, [mountRef, cameraRef, sceneRef, controlsRef]);

  return null;
}

export default ThreeScene;
