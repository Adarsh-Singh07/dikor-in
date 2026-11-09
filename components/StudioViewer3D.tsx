"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface StudioViewer3DProps {
  category?: "Dogs" | "Cats" | "Humans" | "Pets" | string;
  petName?: string;
  tagText?: string;
  sizeInches?: number;
  finish?: "painted" | "gold" | "white_resin";
  className?: string;
}

export default function StudioViewer3D({
  category = "Dogs",
  petName = "Babu",
  tagText = "DIKOR ATELIER",
  sizeInches = 5,
  finish = "painted",
  className = "",
}: StudioViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [activeFinish, setActiveFinish] = useState<"painted" | "gold" | "white_resin">(finish);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveFinish(finish);
  }, [finish]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#FAF7F2");

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // Studio 3-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 1.0);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xb76e79, 1.5);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Pedestal Base (Walnut / Obsidian Beveled Plinth)
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.22, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x221c1a,
      roughness: 0.35,
      metalness: 0.1,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.11;
    baseMesh.receiveShadow = true;
    rootGroup.add(baseMesh);

    // Inset Brass Ring on Plinth
    const ringGeo = new THREE.TorusGeometry(1.18, 0.02, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.005;
    rootGroup.add(ringMesh);

    // Engraved Brass Name Plaque on Front of Base
    const plaqueGeo = new THREE.BoxGeometry(0.85, 0.14, 0.03);
    const plaqueMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.15,
    });
    const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaqueMesh.position.set(0, -0.08, 1.25);
    rootGroup.add(plaqueMesh);

    // Material definitions for Figurines
    let figurineMat: THREE.Material;
    if (activeFinish === "gold") {
      figurineMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.88,
        roughness: 0.22,
      });
    } else if (activeFinish === "white_resin") {
      figurineMat = new THREE.MeshStandardMaterial({
        color: 0xf5f3ee,
        roughness: 0.45,
        metalness: 0.05,
      });
    } else {
      // Hand-Painted Warm Satin Acrylic
      figurineMat = new THREE.MeshStandardMaterial({
        color: category === "Cats" ? 0xd88a58 : category === "Humans" ? 0xcc8d76 : 0xc68a4c,
        roughness: 0.5,
        metalness: 0.08,
      });
    }

    const figurineGroup = new THREE.Group();
    rootGroup.add(figurineGroup);

    // Build stylized artisan sculpt strictly for Dogs, Cats, and Humans
    if (category === "Cats") {
      // Slender Feline Body
      const bodyGeo = new THREE.CylinderGeometry(0.32, 0.45, 1.05, 32);
      const bodyMesh = new THREE.Mesh(bodyGeo, figurineMat);
      bodyMesh.position.y = 0.52;
      bodyMesh.castShadow = true;
      figurineGroup.add(bodyMesh);

      // Feline Head
      const headGeo = new THREE.SphereGeometry(0.36, 32, 32);
      const headMesh = new THREE.Mesh(headGeo, figurineMat);
      headMesh.position.set(0, 1.2, 0.1);
      headMesh.castShadow = true;
      figurineGroup.add(headMesh);

      // Cat Muzzle
      const snoutGeo = new THREE.BoxGeometry(0.18, 0.14, 0.18);
      const snoutMesh = new THREE.Mesh(snoutGeo, figurineMat);
      snoutMesh.position.set(0, 1.12, 0.38);
      snoutMesh.castShadow = true;
      figurineGroup.add(snoutMesh);

      // Pointed Triangle Cat Ears
      const earGeo = new THREE.ConeGeometry(0.12, 0.28, 16);
      const earL = new THREE.Mesh(earGeo, figurineMat);
      earL.position.set(-0.22, 1.48, 0.1);
      earL.rotation.z = -0.2;
      figurineGroup.add(earL);

      const earR = new THREE.Mesh(earGeo, figurineMat);
      earR.position.set(0.22, 1.48, 0.1);
      earR.rotation.z = 0.2;
      figurineGroup.add(earR);

      // Graceful Cat Tail
      const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.1, -0.35),
        new THREE.Vector3(0.1, 0.45, -0.6),
        new THREE.Vector3(0.25, 0.75, -0.45),
        new THREE.Vector3(0.2, 0.95, -0.35),
      ]);
      const tailGeo = new THREE.TubeGeometry(tailCurve, 24, 0.05, 12, false);
      const tailMesh = new THREE.Mesh(tailGeo, figurineMat);
      figurineGroup.add(tailMesh);
    } else if (category === "Humans") {
      // Human Torso & Shoulders
      const torsoGeo = new THREE.CylinderGeometry(0.38, 0.46, 1.1, 32);
      const torso = new THREE.Mesh(torsoGeo, figurineMat);
      torso.position.y = 0.58;
      torso.castShadow = true;
      figurineGroup.add(torso);

      // Neck
      const neckGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.2, 16);
      const neck = new THREE.Mesh(neckGeo, figurineMat);
      neck.position.set(0, 1.18, 0);
      figurineGroup.add(neck);

      // Head
      const headGeo = new THREE.SphereGeometry(0.32, 32, 32);
      const head = new THREE.Mesh(headGeo, figurineMat);
      head.position.set(0, 1.42, 0);
      head.castShadow = true;
      figurineGroup.add(head);

      // Hair Silhouette
      const hairGeo = new THREE.SphereGeometry(0.34, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const hair = new THREE.Mesh(hairGeo, figurineMat);
      hair.position.set(0, 1.44, -0.02);
      figurineGroup.add(hair);
    } else {
      // Default: Dog Miniature Sculpt
      const bodyGeo = new THREE.CylinderGeometry(0.4, 0.55, 1.1, 32);
      const bodyMesh = new THREE.Mesh(bodyGeo, figurineMat);
      bodyMesh.position.y = 0.55;
      bodyMesh.castShadow = true;
      figurineGroup.add(bodyMesh);

      // Head
      const headGeo = new THREE.SphereGeometry(0.42, 32, 32);
      const headMesh = new THREE.Mesh(headGeo, figurineMat);
      headMesh.position.set(0, 1.25, 0.15);
      headMesh.castShadow = true;
      figurineGroup.add(headMesh);

      // Muzzle / Snout
      const snoutGeo = new THREE.BoxGeometry(0.25, 0.2, 0.3);
      const snoutMesh = new THREE.Mesh(snoutGeo, figurineMat);
      snoutMesh.position.set(0, 1.15, 0.45);
      snoutMesh.castShadow = true;
      figurineGroup.add(snoutMesh);

      // Ears (Golden Retriever / Hound Flop Ears)
      const earGeo = new THREE.ConeGeometry(0.16, 0.35, 16);
      const earL = new THREE.Mesh(earGeo, figurineMat);
      earL.position.set(-0.3, 1.45, 0.1);
      earL.rotation.z = -0.3;
      earL.rotation.x = -0.2;
      figurineGroup.add(earL);

      const earR = new THREE.Mesh(earGeo, figurineMat);
      earR.position.set(0.3, 1.45, 0.1);
      earR.rotation.z = 0.3;
      earR.rotation.x = -0.2;
      figurineGroup.add(earR);

      // Tail
      const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.1, -0.4),
        new THREE.Vector3(0, 0.4, -0.7),
        new THREE.Vector3(0.15, 0.7, -0.65),
      ]);
      const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.08, 12, false);
      const tailMesh = new THREE.Mesh(tailGeo, figurineMat);
      figurineGroup.add(tailMesh);
    }

    // Scale proportional to sizeInches
    const scaleFactor = Math.max(0.75, Math.min(1.4, sizeInches / 5));
    figurineGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Optional Phone for Scale Comparison
    if (showComparison) {
      const phoneGeo = new THREE.BoxGeometry(0.7, 1.45, 0.08);
      const phoneMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.8 });
      const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat);
      phoneMesh.position.set(1.1, 0.65, 0);
      phoneMesh.castShadow = true;
      rootGroup.add(phoneMesh);
    }

    setLoading(false);

    // Mouse & Touch Interaction / Orbit Dragging
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      rootGroup.rotation.y += deltaX * 0.01;
      camera.position.y = Math.max(0.5, Math.min(3.5, camera.position.y - deltaY * 0.01));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      rootGroup.rotation.y += deltaX * 0.01;
      camera.position.y = Math.max(0.5, Math.min(3.5, camera.position.y - deltaY * 0.01));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (isRotating && !isDragging) {
        rootGroup.rotation.y += 0.008;
      }
      camera.lookAt(0, 0.75, 0);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [category, activeFinish, sizeInches, isRotating, showComparison]);

  return (
    <div className={`relative flex flex-col bg-[#F5EFEB] rounded-2xl border border-charcoal/15 p-4 overflow-hidden ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing rounded-xl relative flex items-center justify-center bg-[#FAF7F2]"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF7F2]/80 z-10">
            <span className="text-xs uppercase tracking-widest text-rosegold-dark font-semibold">
              Loading 3D Studio...
            </span>
          </div>
        )}
      </div>

      {/* Floating Plaque Tag Realtime Preview */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-charcoal/90 text-white px-3 py-1.5 rounded-lg border border-charcoal/30 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-gold-light font-semibold">Live 3D Studio</p>
          <p className="text-xs font-serif font-bold text-white tracking-wide">{petName || "Your Miniature"}</p>
        </div>
      </div>

      {/* 3D Controls Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-charcoal/10">
        {/* Finish Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-charcoal/15">
          <button
            type="button"
            onClick={() => setActiveFinish("painted")}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
              activeFinish === "painted"
                ? "bg-rosegold text-white shadow-sm"
                : "text-charcoal-soft hover:text-charcoal"
            }`}
          >
            Hand-Painted
          </button>
          <button
            type="button"
            onClick={() => setActiveFinish("gold")}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
              activeFinish === "gold"
                ? "bg-charcoal text-white shadow-sm"
                : "text-charcoal-soft hover:text-charcoal"
            }`}
          >
            Antique Gold
          </button>
          <button
            type="button"
            onClick={() => setActiveFinish("white_resin")}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
              activeFinish === "white_resin"
                ? "bg-charcoal text-white shadow-sm"
                : "text-charcoal-soft hover:text-charcoal"
            }`}
          >
            Artisan White
          </button>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-charcoal/20 bg-white text-xs font-semibold text-charcoal hover:border-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark"
          >
            {isRotating ? "Pause 360°" : "Auto-Rotate"}
          </button>
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
              showComparison
                ? "border-rosegold bg-blush text-rosegold-dark"
                : "border-charcoal/20 bg-white text-charcoal hover:border-charcoal"
            }`}
          >
            Scale Reference
          </button>
        </div>
      </div>
    </div>
  );
}
