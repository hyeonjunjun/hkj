"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

/* ---------- generate soft circle sprite texture ---------- */
function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.5)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

/* ---------- generate random spherical position ---------- */
function randomSphere(radius: number): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = radius * Math.cbrt(Math.random());
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

/* ---------- expanded positions for project nodes ---------- */
const EXPANDED_POSITIONS: { x: number; y: number; z: number }[] = [
  { x: -8, y: 5, z: 2 },
  { x: 6, y: 6, z: -1 },
  { x: -5, y: -1, z: 3 },
  { x: 7, y: -2, z: -2 },
  { x: -9, y: -6, z: 1 },
  { x: 5, y: -7, z: -3 },
];

/* ---------- component ---------- */
export default function Constellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- noise ---- */
    const noise2D = createNoise2D();

    /* ---- renderer ---- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.insertBefore(renderer.domElement, container.firstChild);

    /* ---- scene, camera ---- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 30;

    /* ---- texture ---- */
    const particleTexture = createParticleTexture();

    /* ---- particle counts ---- */
    const projectCount = pieces.length; // 6
    const ambientCount = window.devicePixelRatio > 2 ? 80 : 120;
    const totalCount = projectCount + ambientCount;

    /* ---- group ---- */
    const group = new THREE.Group();
    scene.add(group);

    /* ---- project nodes ---- */
    const projectGeometry = new THREE.BufferGeometry();
    const projectPositions = new Float32Array(projectCount * 3);
    const projectCluster: THREE.Vector3[] = [];
    const projectExpanded: THREE.Vector3[] = [];

    for (let i = 0; i < projectCount; i++) {
      const clustered = randomSphere(4);
      projectCluster.push(clustered.clone());
      projectExpanded.push(new THREE.Vector3(EXPANDED_POSITIONS[i].x, EXPANDED_POSITIONS[i].y, EXPANDED_POSITIONS[i].z));
      // Start at origin for entrance animation
      projectPositions[i * 3] = 0;
      projectPositions[i * 3 + 1] = 0;
      projectPositions[i * 3 + 2] = 0;
    }

    projectGeometry.setAttribute("position", new THREE.BufferAttribute(projectPositions, 3));
    const projectMaterial = new THREE.PointsMaterial({
      size: 3,
      color: new THREE.Color("#f5f0e8"),
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const projectPoints = new THREE.Points(projectGeometry, projectMaterial);
    group.add(projectPoints);

    /* ---- ambient particles ---- */
    const ambientGeometry = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientCluster: THREE.Vector3[] = [];
    const ambientExpanded: THREE.Vector3[] = [];

    for (let i = 0; i < ambientCount; i++) {
      const clustered = randomSphere(5);
      ambientCluster.push(clustered.clone());
      ambientExpanded.push(randomSphere(18));
      // Start at origin for entrance
      ambientPositions[i * 3] = 0;
      ambientPositions[i * 3 + 1] = 0;
      ambientPositions[i * 3 + 2] = 0;
    }

    ambientGeometry.setAttribute("position", new THREE.BufferAttribute(ambientPositions, 3));
    const ambientMaterial = new THREE.PointsMaterial({
      size: 1.5,
      color: new THREE.Color("#f5f0e8"),
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const ambientPoints = new THREE.Points(ambientGeometry, ambientMaterial);
    group.add(ambientPoints);

    /* ---- raycaster ---- */
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 1.5 };
    const pointer = new THREE.Vector2(9999, 9999); // off-screen initially

    /* ---- state ---- */
    let mouse = { x: 0, y: 0 };
    let hoveredIndex = -1;
    let entranceDone = false;
    let expansion = 0; // 0 = clustered, 1 = expanded
    let frameId = 0;
    const currentProjectPos: THREE.Vector3[] = projectCluster.map(() => new THREE.Vector3(0, 0, 0));
    const currentAmbientPos: THREE.Vector3[] = ambientCluster.map(() => new THREE.Vector3(0, 0, 0));

    /* ---- entrance animation ---- */
    if (reducedMotion) {
      // Immediately place particles at cluster positions
      for (let i = 0; i < projectCount; i++) {
        currentProjectPos[i].copy(projectCluster[i]);
        projectPositions[i * 3] = projectCluster[i].x;
        projectPositions[i * 3 + 1] = projectCluster[i].y;
        projectPositions[i * 3 + 2] = projectCluster[i].z;
      }
      for (let i = 0; i < ambientCount; i++) {
        currentAmbientPos[i].copy(ambientCluster[i]);
        ambientPositions[i * 3] = ambientCluster[i].x;
        ambientPositions[i * 3 + 1] = ambientCluster[i].y;
        ambientPositions[i * 3 + 2] = ambientCluster[i].z;
      }
      projectGeometry.attributes.position.needsUpdate = true;
      ambientGeometry.attributes.position.needsUpdate = true;
      entranceDone = true;
      // Fade in edge labels immediately
      document.querySelectorAll(".edge-label").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
      });
    } else {
      // GSAP stagger entrance: particles fly from origin to cluster positions
      const entranceTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => { entranceDone = true; },
      });

      // Stagger project particles
      for (let i = 0; i < projectCount; i++) {
        entranceTimeline.to(
          currentProjectPos[i],
          {
            x: projectCluster[i].x,
            y: projectCluster[i].y,
            z: projectCluster[i].z,
            duration: 1.5,
          },
          0.5 + i * 0.08
        );
      }

      // Stagger ambient particles
      for (let i = 0; i < ambientCount; i++) {
        entranceTimeline.to(
          currentAmbientPos[i],
          {
            x: ambientCluster[i].x,
            y: ambientCluster[i].y,
            z: ambientCluster[i].z,
            duration: 1.2,
          },
          0.5 + (i * 0.01)
        );
      }

      // Edge labels fade in
      entranceTimeline.to(".edge-label", { opacity: 1, duration: 0.5, stagger: 0.05 }, 2.0);
    }

    /* ---- mouse / touch handlers ---- */
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.x = mouse.x;
      pointer.y = mouse.y;
    };

    let touchExpanded = false;
    const onTouchStart = (e: TouchEvent) => {
      const tx = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      const ty = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      const dist = Math.sqrt(tx * tx + ty * ty);
      if (dist < 0.5) {
        touchExpanded = !touchExpanded;
        if (touchExpanded) {
          mouse.x = 0;
          mouse.y = 0;
        } else {
          mouse.x = 2;
          mouse.y = 2;
        }
      } else {
        touchExpanded = false;
        mouse.x = 2;
        mouse.y = 2;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    /* ---- animation loop ---- */
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      /* -- rotation -- */
      if (!reducedMotion) {
        group.rotation.y += 0.0008;
      }

      /* -- proximity -- */
      const proximity = 1 - Math.min(1, Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) / 0.5);
      const shouldExpand = proximity > 0.3;
      const targetExpansion = shouldExpand ? 1 : 0;
      expansion += (targetExpansion - expansion) * 0.05;

      /* -- breathing -- */
      const breathe = reducedMotion ? 1 : 0.7 + 0.3 * Math.sin(time * 0.5);

      /* -- update project node positions -- */
      const projAttr = projectGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < projectCount; i++) {
        const cluster = projectCluster[i];
        const expanded = projectExpanded[i];
        const target = new THREE.Vector3().lerpVectors(cluster, expanded, expansion);

        // Noise drift
        if (!reducedMotion) {
          target.x += noise2D(i * 10, time * 0.3) * 0.3;
          target.y += noise2D(i * 10 + 100, time * 0.3) * 0.3;
          target.z += noise2D(i * 10 + 200, time * 0.3) * 0.15;
        }

        currentProjectPos[i].x += (target.x - currentProjectPos[i].x) * 0.05;
        currentProjectPos[i].y += (target.y - currentProjectPos[i].y) * 0.05;
        currentProjectPos[i].z += (target.z - currentProjectPos[i].z) * 0.05;

        projAttr.setXYZ(i, currentProjectPos[i].x, currentProjectPos[i].y, currentProjectPos[i].z);
      }
      projAttr.needsUpdate = true;

      /* -- update ambient positions -- */
      const ambAttr = ambientGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < ambientCount; i++) {
        const cluster = ambientCluster[i];
        const expanded = ambientExpanded[i];
        const target = new THREE.Vector3().lerpVectors(cluster, expanded, expansion * 0.6);

        // Noise drift
        if (!reducedMotion) {
          target.x += noise2D(i * 7 + 500, time * 0.2) * 0.2;
          target.y += noise2D(i * 7 + 600, time * 0.2) * 0.2;
          target.z += noise2D(i * 7 + 700, time * 0.2) * 0.1;
        }

        currentAmbientPos[i].x += (target.x - currentAmbientPos[i].x) * 0.05;
        currentAmbientPos[i].y += (target.y - currentAmbientPos[i].y) * 0.05;
        currentAmbientPos[i].z += (target.z - currentAmbientPos[i].z) * 0.05;

        ambAttr.setXYZ(i, currentAmbientPos[i].x, currentAmbientPos[i].y, currentAmbientPos[i].z);
      }
      ambAttr.needsUpdate = true;

      /* -- opacity -- */
      projectMaterial.opacity = breathe;
      ambientMaterial.opacity = breathe * (1 - expansion * 0.4);

      /* -- raycasting on project nodes (only when expanded enough) -- */
      let newHoveredIndex = -1;
      if (expansion > 0.3) {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(projectPoints);
        if (intersects.length > 0 && intersects[0].index !== undefined) {
          newHoveredIndex = intersects[0].index;
        }
      }
      hoveredIndex = newHoveredIndex;

      /* -- dim non-hovered when any is hovered -- */
      if (hoveredIndex >= 0) {
        const sizes = new Float32Array(projectCount);
        for (let i = 0; i < projectCount; i++) {
          sizes[i] = i === hoveredIndex ? 5 : 3;
        }
        projectGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      } else {
        projectGeometry.deleteAttribute("size");
      }

      /* -- project label positions (2D projection) -- */
      for (let i = 0; i < projectCount; i++) {
        const label = labelRefs.current[i];
        if (!label) continue;

        const pos = new THREE.Vector3(
          currentProjectPos[i].x,
          currentProjectPos[i].y,
          currentProjectPos[i].z
        );

        // Apply group rotation to get world position
        pos.applyMatrix4(group.matrixWorld);
        pos.project(camera);

        const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;

        label.style.left = `${x + 12}px`;
        label.style.top = `${y - 6}px`;

        const labelOpacity = expansion > 0.3 ? Math.min(1, (expansion - 0.3) / 0.3) : 0;
        const isHovered = hoveredIndex === i;
        const dimmed = hoveredIndex >= 0 && !isHovered;

        label.style.opacity = String(labelOpacity * (dimmed ? 0.3 : 1));
        label.style.color = isHovered ? "#eae6df" : "";
      }

      renderer.render(scene, camera);
    };

    animate();

    /* ---- resize ---- */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* ---- click handler via raycaster ---- */
    const onClick = () => {
      if (hoveredIndex >= 0 && hoveredIndex < pieces.length) {
        const piece = pieces[hoveredIndex];
        const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;
        window.location.href = href;
      }
    };
    renderer.domElement.addEventListener("click", onClick);

    /* ---- cleanup ---- */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.dispose();
      projectGeometry.dispose();
      projectMaterial.dispose();
      ambientGeometry.dispose();
      ambientMaterial.dispose();
      particleTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="constellation-canvas">
      <div className="project-labels">
        {pieces.map((piece, i) => (
          <Link
            key={piece.slug}
            href={piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`}
            className="project-label"
            data-slug={piece.slug}
            style={{ opacity: 0 }}
            ref={(el) => { labelRefs.current[i] = el; }}
          >
            {piece.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
