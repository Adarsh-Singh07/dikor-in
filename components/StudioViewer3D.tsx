"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface StudioViewer3DProps {
  category?: string; // 'Pets' | 'Couples' | 'Kids' | 'Idols' | 'Decor'
  petName?: string;
  tagText?: string;
  sizeInches?: number;
  finish?: "painted" | "gold" | "white_resin";
  className?: string;
}

export default function StudioViewer3D({
  category = "Pets",
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

  // Sync state if prop changes
  useEffect(() => {
    setActiveFinish(finish);
  }, [finish]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#FAF5EC");

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

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Pedestal Base (Walnut / Obsidian Beveled Plinth)
    const baseGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.28, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1f1b19,
      roughness: 0.35,
      metalness: 0.1,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.14;
    baseMesh.receiveShadow = true;
    rootGroup.add(baseMesh);

    // Gold Rim Ring on Pedestal
    const ringGeo = new THREE.TorusGeometry(1.4, 0.02, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc9a227,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0;
    rootGroup.add(ringMesh);

    // Engraved Brass Plaque on Pedestal Face
    const plaqueGeo = new THREE.BoxGeometry(0.85, 0.14, 0.02);
    const plaqueMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.25,
    });
    const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaqueMesh.position.set(0, -0.12, 1.44);
    rootGroup.add(plaqueMesh);

    // Figurine Material based on finish
    const getFigurineMaterial = (f: "painted" | "gold" | "white_resin") => {
      if (f === "gold") {
        return new THREE.MeshStandardMaterial({
          color: 0xc9a227,
          metalness: 0.88,
          roughness: 0.22,
        });
      }
      if (f === "white_resin") {
        return new THREE.MeshStandardMaterial({
          color: 0xfaf5ec,
          metalness: 0.05,
          roughness: 0.45,
        });
      }
      // Hand-Painted Satin Finish
      return new THREE.MeshStandardMaterial({
        color: 0xb76e79,
        roughness: 0.5,
        metalness: 0.15,
      });
    };

    const figurineMat = getFigurineMaterial(activeFinish);

    // Sculpted Figurine Group
    const figurineGroup = new THREE.Group();
    rootGroup.add(figurineGroup);

    // Build stylized artisan sculpt based on category
    if (category === "Pets") {
      // Dog / Cat Sculpted Body
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

      // Ears (Perky Golden Retriever / Cat Ears)
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
    } else if (category === "Couples") {
      // Two Figures Intertwined
      const f1Body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 1.2, 24), figurineMat);
      f1Body.position.set(-0.35, 0.6, 0);
      f1Body.castShadow = true;
      figurineGroup.add(f1Body);

      const f1Head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), figurineMat);
      f1Head.position.set(-0.35, 1.35, 0);
      figurineGroup.add(f1Head);

      const f2Body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 1.1, 24), figurineMat);
      f2Body.position.set(0.35, 0.55, 0);
      f2Body.castShadow = true;
      figurineGroup.add(f2Body);

      const f2Head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), figurineMat);
      f2Head.position.set(0.35, 1.25, 0);
      figurineGroup.add(f2Head);

      // Heart Accent Arc
      const heartArcGeo = new THREE.TorusGeometry(0.7, 0.03, 16, 32, Math.PI);
      const heartArcMat = new THREE.MeshStandardMaterial({ color: 0xb76e79, metalness: 0.6 });
      const heartArc = new THREE.Mesh(heartArcGeo, heartArcMat);
      heartArc.position.set(0, 1.3, 0);
      heartArc.rotation.z = Math.PI;
      figurineGroup.add(heartArc);
    } else {
      // Idols / Sculptural Figurine
      const idolBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.65, 1.3, 32), figurineMat);
      idolBody.position.y = 0.65;
      idolBody.castShadow = true;
      figurineGroup.add(idolBody);

      const idolCrown = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.55, 24), ringMat);
      idolCrown.position.set(0, 1.55, 0);
      figurineGroup.add(idolCrown);

      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 16, 48), ringMat);
      halo.position.set(0, 1.45, -0.15);
      figurineGroup.add(halo);
    }

    // Scale proportional to sizeInches
    const scaleFactor = Math.max(0.75, Math.min(1.4, sizeInches / 5));
    figurineGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Real-life scale comparison object (iPhone 16 Pro reference)
    const phoneGroup = new THREE.Group();
    const phoneGeo = new THREE.BoxGeometry(0.12, 1.45, 0.72);
    const phoneMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.2, metalness: 0.8 });
    const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat);
    phoneMesh.position.set(1.6, 0.72, 0);
    phoneGroup.add(phoneMesh);

    if (showComparison) {
      scene.add(phoneGroup);
    }

    setLoading(false);

    // Mouse Interaction / Orbit Dragging
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

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

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

    // Resize Handler
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
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [category, activeFinish, sizeInches, isRotating, showComparison]);

  return (
    <div className={`relative flex flex-col bg-cream-dark/30 rounded-3xl border border-gold/40 p-4 overflow-hidden ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing rounded-2xl relative flex items-center justify-center"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream/80 backdrop-blur-sm z-10">
            <span className="text-xs uppercase tracking-widest text-rosegold-dark font-semibold">
              Loading 3D Studio...
            </span>
          </div>
        )}
      </div>

      {/* Floating Plaque Tag Realtime Preview */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-charcoal/85 text-cream px-3 py-1.5 rounded-full border border-gold/40 backdrop-blur-md shadow-card">
          <p className="text-[10px] uppercase tracking-widest text-gold font-semibold">Live 3D Preview</p>
          <p className="text-xs font-serif font-bold text-white tracking-wide">{petName || "Your Keepsake"}</p>
        </div>
      </div>

      {/* 3D Controls Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-charcoal/10">
        {/* Finish Selector */}
        <div className="flex items-center gap-1.5 bg-white/70 p-1 rounded-2xl border border-charcoal/15">
          <button
            onClick={() => setActiveFinish("painted")}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
              activeFinish === "painted"
                ? "bg-rosegold text-cream font-semibold shadow-sm"
                : "text-charcoal-soft hover:text-charcoal"
            }`}
          >
            Hand-Painted
          </button>
          <button
            onClick={() => setActiveFinish("gold")}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
              activeFinish === "gold"
                ? "bg-gold text-charcoal font-semibold shadow-sm"
                : "text-charcoal-soft hover:text-charcoal"
            }`}
          >
            Antique Gold
          </button>
          <button
            onClick={() => setActiveFinish("white_resin")}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
              activeFinish === "white_resin"
                ? "bg-charcoal text-cream font-semibold shadow-sm"
                : "text-charcoal-soft hover:text-charcoal"
            }`}
          >
            Artisan White
          </button>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-3 py-1.5 rounded-xl border border-charcoal/20 bg-white/80 text-xs font-medium text-charcoal hover:border-gold"
          >
            {isRotating ? "Pause 360°" : "Auto-Rotate"}
          </button>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
              showComparison
                ? "border-rosegold bg-blush text-rosegold-dark font-semibold"
                : "border-charcoal/20 bg-white/80 text-charcoal"
            }`}
          >
            Scale vs iPhone
          </button>
        </div>
      </div>
    </div>
  );
}
