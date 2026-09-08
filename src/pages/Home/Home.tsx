import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import FeatureSection from "./FeatureSection";
import CategoriesSection from "./categories";
import Stats from "./Stats";
import TestimonialCarousel from "./TestimonialCarousel";
import Footer from "../../components/footer/Footer";

/* ─── Design Tokens ───────────────────────────────── */
const T = {
  navy: "#0D1F3C",
  navyMid: "#163061",
  gold: "#C49A2A",
  goldLight: "#E8C05A",
  cream: "#F7F4EE",
  white: "#FFFFFF",
  slate: "#4A5568",
  muted: "#8A9BB0",
};

/* ─── Crest SVG (matches original exactly) ─────────── */
const Crest = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="36" cy="36" r="34" stroke={T.gold} strokeWidth="2" />
    <circle
      cx="36"
      cy="36"
      r="28"
      stroke={T.gold}
      strokeWidth="0.75"
      strokeDasharray="4 3"
    />
    <path
      d="M36 12 L40 26 L54 26 L43 34 L47 48 L36 40 L25 48 L29 34 L18 26 L32 26 Z"
      fill={T.gold}
      opacity="0.85"
    />
    <text
      x="36"
      y="60"
      textAnchor="middle"
      fontSize="6"
      fill={T.gold}
      fontFamily="Georgia, serif"
      letterSpacing="2"
    >
      LEAFLINE
    </text>
  </svg>
);

/* ─── Gold diamond divider ────────────────────────── */
const Divider = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      margin: "0",
      maxWidth: "300px",
    }}
  >
    <div style={{ flex: 1, height: "1px", background: T.gold, opacity: 0.4 }} />
    <div
      style={{
        width: "6px",
        height: "6px",
        background: T.gold,
        transform: "rotate(45deg)",
        opacity: 0.7,
      }}
    />
    <div style={{ flex: 1, height: "1px", background: T.gold, opacity: 0.4 }} />
  </div>
);

/* ─── 3-D Canvas Panel ────────────────────────────── */
const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    /* Renderer — alpha:true so white page shows through */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    /* No scene.background — transparent so white hero shows through */

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0.5, 9);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));

    const sun = new THREE.DirectionalLight(0xfff8e8, 2.2);
    sun.position.set(6, 10, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const goldPt = new THREE.PointLight(0xc49a2a, 3.5, 20);
    goldPt.position.set(-3, 2, 5);
    scene.add(goldPt);

    const navyPt = new THREE.PointLight(0x163061, 2.2, 16);
    navyPt.position.set(3, -3, 4);
    scene.add(navyPt);

    /* ── Shared materials ── */
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc49a2a,
      metalness: 0.78,
      roughness: 0.18,
      emissive: 0x7a5a10,
      emissiveIntensity: 0.12,
    });
    const pageMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e6,
      metalness: 0,
      roughness: 0.95,
    });

    /* ── Book factory ── */
    const bookPalette = [
      0x0d1f3c, 0x163061, 0x8b2020, 0x1a5a3a, 0x4a3080, 0x0a3a5a, 0x5a3510,
      0x1a4555,
    ];

    function makeBook(colorHex: number, thick: number) {
      const g = new THREE.Group();
      const BW = 1.1,
        BH = 1.65;
      const cMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: 0.06,
        roughness: 0.72,
      });

      const body = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, thick), cMat);
      body.castShadow = true;
      body.receiveShadow = true;
      g.add(body);

      const spine = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, BH, thick + 0.012),
        goldMat,
      );
      spine.position.x = -BW / 2 + 0.022;
      g.add(spine);

      const pages = new THREE.Mesh(
        new THREE.BoxGeometry(BW - 0.07, BH - 0.07, thick - 0.025),
        pageMat,
      );
      pages.position.x = 0.025;
      g.add(pages);

      const topBar = new THREE.Mesh(
        new THREE.BoxGeometry(BW, 0.03, thick + 0.012),
        goldMat,
      );
      topBar.position.y = BH / 2;
      g.add(topBar);

      return g;
    }

    /* ── Central open-book centrepiece ── */
    const openBook = new THREE.Group();

    const pageFaceL = new THREE.MeshStandardMaterial({
      color: 0xfaf6ee,
      metalness: 0,
      roughness: 0.9,
    });
    const pageFaceR = new THREE.MeshStandardMaterial({
      color: 0xf2ece0,
      metalness: 0,
      roughness: 0.9,
    });

    const leftPage = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.8, 0.06),
      pageFaceL,
    );
    leftPage.position.set(-0.67, 0, 0);
    leftPage.rotation.y = 0.18;
    leftPage.castShadow = true;
    openBook.add(leftPage);

    const rightPage = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.8, 0.06),
      pageFaceR,
    );
    rightPage.position.set(0.67, 0, 0);
    rightPage.rotation.y = -0.18;
    rightPage.castShadow = true;
    openBook.add(rightPage);

    const centerSpine = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.82, 0.14),
      goldMat,
    );
    openBook.add(centerSpine);

    /* ruling lines */
    for (let li = 0; li < 9; li++) {
      const y = -0.72 + li * 0.18;
      const ruleMat = new THREE.MeshStandardMaterial({
        color: 0xc49a2a,
        metalness: 0.4,
        roughness: 0.6,
      });
      const ruleL = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.01, 0.065),
        ruleMat,
      );
      ruleL.position.set(-0.67, y, 0.01);
      ruleL.rotation.y = 0.18;
      openBook.add(ruleL);
      const ruleR = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.01, 0.065),
        ruleMat,
      );
      ruleR.position.set(0.67, y, 0.01);
      ruleR.rotation.y = -0.18;
      openBook.add(ruleR);
    }

    openBook.position.set(0, 0.3, 0);
    openBook.rotation.x = -0.12;
    scene.add(openBook);

    /* ── Orbiting books ── */
    const orbitBooks: Array<{
      mesh: THREE.Group;
      angle: number;
      radius: number;
      baseY: number;
      orbitSpeed: number;
      rotX: number;
      rotY: number;
      floatFreq: number;
      floatPhase: number;
    }> = [];
    for (let i = 0; i < 8; i++) {
      const thick = 0.17 + Math.random() * 0.27;
      const bk = makeBook(bookPalette[i % bookPalette.length], thick);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 3.0 + Math.random() * 1.5;
      const baseY = (Math.random() - 0.5) * 3.5;

      bk.position.set(
        Math.cos(angle) * radius,
        baseY,
        Math.sin(angle) * radius * 0.32 - 1.2,
      );
      bk.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      );
      scene.add(bk);

      orbitBooks.push({
        mesh: bk,
        angle,
        radius,
        baseY,
        orbitSpeed:
          (0.0035 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1),
        rotX: (Math.random() - 0.5) * 0.008,
        rotY: (Math.random() - 0.5) * 0.011,
        floatFreq: 0.4 + Math.random() * 0.55,
        floatPhase: Math.random() * Math.PI * 2,
      });
    }

    /* ── Gold particles ── */
    const PARTS = 300;
    const pPos = new Float32Array(PARTS * 3);
    for (let i = 0; i < PARTS; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc49a2a,
      size: 0.055,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ── Decorative torus rings ── */
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xc49a2a,
      metalness: 0.88,
      roughness: 0.14,
      emissive: 0xb08020,
      emissiveIntensity: 0.12,
    });
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.0, 0.02, 16, 180),
      torusMat,
    );
    ring1.position.z = -3.5;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.9, 0.013, 16, 120),
      torusMat,
    );
    ring2.position.z = -2.5;
    ring2.rotation.x = Math.PI / 2.6;
    scene.add(ring2);

    /* ── Small sparkle spheres ── */
    const sparkMat = new THREE.MeshStandardMaterial({
      color: 0xe8c05a,
      metalness: 0.9,
      roughness: 0.08,
      emissive: 0xc49a2a,
      emissiveIntensity: 0.45,
    });
    [
      [-2.6, 2.2, 1.2],
      [2.4, 1.6, 0.6],
      [-1.6, -2.0, 0.9],
      [2.0, -1.6, 1.1],
      [-3.0, -0.5, 0.5],
      [0.5, 2.8, 0.8],
    ].forEach(([x, y, z]) => {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.06 + Math.random() * 0.05, 8, 8),
        sparkMat,
      );
      s.position.set(x, y, z);
      scene.add(s);
    });

    /* ── Mouse parallax ── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    /* ── Animation loop ── */
    let raf = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      /* open book floats gently */
      openBook.position.y = 0.3 + Math.sin(t * 0.6) * 0.12;
      openBook.rotation.y = Math.sin(t * 0.24) * 0.1;

      /* orbiting books */
      orbitBooks.forEach((b) => {
        b.angle += b.orbitSpeed;
        b.mesh.position.x = Math.cos(b.angle) * b.radius;
        b.mesh.position.y =
          b.baseY + Math.sin(t * b.floatFreq + b.floatPhase) * 0.32;
        b.mesh.position.z = Math.sin(b.angle) * b.radius * 0.32 - 1.2;
        b.mesh.rotation.x += b.rotX;
        b.mesh.rotation.y += b.rotY;
      });

      /* rings */
      ring1.rotation.z = t * 0.11;
      ring1.rotation.x = t * 0.055;
      ring2.rotation.y = t * 0.14;
      ring2.rotation.z = t * 0.07;

      /* particles drift */
      particles.rotation.y = t * 0.014;

      /* gold light pulse */
      goldPt.intensity = 3.0 + Math.sin(t * 1.2) * 0.7;

      renderer.render(scene, camera);
    };
    tick();

    /* ── Resize ── */
    const onResize = () => {
      const nW = mount.clientWidth;
      const nH = mount.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", minHeight: 500 }}
    />
  );
};

/* ─── Main Page ────────────────────────────────────── */
const Home = () => {
  return (
    <div
      style={{
        background: T.white,
        color: T.navy,
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');

        .leafline-hero { font-family:'Cormorant Garamond',Georgia,serif; }
        .leafline-body { font-family:'Source Sans 3',sans-serif; }

        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:#F7F4EE; border:1px solid rgba(196,154,42,0.35);
          border-radius:2px; padding:5px 14px;
          font-size:11px; letter-spacing:3px; text-transform:uppercase;
          color:#C49A2A;
          font-family:'Source Sans 3',sans-serif; font-weight:600;
        }

        .cta-primary {
          background:#0D1F3C; color:#E8C05A;
          border:1.5px solid #0D1F3C; padding:13px 36px;
          font-family:'Source Sans 3',sans-serif; font-weight:600;
          font-size:14px; letter-spacing:2px; text-transform:uppercase;
          border-radius:2px; cursor:pointer; transition:all 0.25s ease;
          text-decoration:none; display:inline-block;
        }
        .cta-primary:hover { background:#163061; border-color:#163061; transform:translateY(-2px); box-shadow:0 8px 24px rgba(13,31,60,0.18); }

        .cta-secondary {
          background:transparent; color:#0D1F3C;
          border:1.5px solid rgba(13,31,60,0.3); padding:13px 36px;
          font-family:'Source Sans 3',sans-serif; font-weight:600;
          font-size:14px; letter-spacing:2px; text-transform:uppercase;
          border-radius:2px; cursor:pointer; transition:all 0.25s ease;
          text-decoration:none; display:inline-block;
        }
        .cta-secondary:hover { border-color:#0D1F3C; background:rgba(13,31,60,0.04); }

        /* 3-D panel frame rings */
        .three-wrap {
          position:relative; width:100%; height:100%; min-height:520px;
        }
        .three-wrap::before {
          content:'';
          position:absolute; inset:-12px;
          border:1px solid rgba(196,154,42,0.18);
          border-radius:12px; pointer-events:none; z-index:2;
        }
        .three-wrap::after {
          content:'';
          position:absolute; inset:-24px;
          border:1px solid rgba(196,154,42,0.08);
          border-radius:18px; pointer-events:none; z-index:2;
        }

        /* floating info chips */
        .chip {
          position:absolute; z-index:10;
          background:rgba(255,255,255,0.92);
          border:1px solid rgba(196,154,42,0.28);
          border-radius:10px; backdrop-filter:blur(8px);
          padding:9px 14px;
          display:flex; align-items:center; gap:10px;
          font-family:'Source Sans 3',sans-serif;
          color:#0D1F3C;
          box-shadow:0 4px 20px rgba(13,31,60,0.09);
          white-space:nowrap;
        }
        .chip-icon {
          width:30px; height:30px; border-radius:7px;
          background:rgba(196,154,42,0.12);
          display:flex; align-items:center; justify-content:center; font-size:14px;
        }
        .chip-title { font-weight:600; font-size:12px; color:#0D1F3C; }
        .chip-sub   { font-size:10px; color:#8A9BB0; margin-top:1px; }

        @keyframes chipFloat {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-7px); }
        }
        .cf1 { animation:chipFloat 4.0s ease-in-out infinite; }
        .cf2 { animation:chipFloat 5.0s ease-in-out 0.8s infinite; }
        .cf3 { animation:chipFloat 4.6s ease-in-out 0.4s infinite; }

        .pattern-bg {
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(196,154,42,0.05) 39px,rgba(196,154,42,0.05) 40px),
            repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(196,154,42,0.05) 39px,rgba(196,154,42,0.05) 40px);
        }

        .trust-bar {
          background:#0D1F3C; padding:26px 24px;
          display:flex; align-items:center; justify-content:center;
          gap:clamp(20px,5vw,60px); flex-wrap:wrap;
        }
        .trust-item {
          display:flex; align-items:center; gap:10px;
          color:rgba(255,255,255,0.72); font-size:13px; letter-spacing:0.5px;
          font-family:'Source Sans 3',sans-serif;
        }

        .stat-divider {
          border-top:1px solid rgba(196,154,42,0.18);
          padding-top:28px; margin-top:36px;
          display:flex; gap:28px;
        }

        @media (max-width:900px) {
          .hero-grid { flex-direction:column !important; }
          .hero-left  { max-width:100% !important; align-items:center !important; text-align:center !important; }
          .three-wrap { min-height:360px !important; }
        }
      `}</style>

      {/* Navbar */}
      <Navbar />

      {/* ── Hero Section ── */}
      <section
        className="pattern-bg"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px 5% 60px",
          position: "relative",
          background: T.white,
          overflow: "hidden",
        }}
      >
        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: "clamp(80px,16vw,200px)",
            fontFamily: "'Cormorant Garamond',serif",
            fontWeight: 700,
            color: T.navy,
            opacity: 0.025,
            userSelect: "none",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            letterSpacing: "-4px",
          }}
        >
          LeafLine
        </div>

        {/* Two-column grid */}
        <div
          className="hero-grid"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 64,
            maxWidth: 1300,
            width: "100%",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ── LEFT column: original text ── */}
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              flex: "0 0 auto",
              maxWidth: 500,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Crest */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ marginBottom: 20 }}
            >
              <Crest />
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              style={{ marginBottom: 18 }}
            >
              <span className="hero-badge">
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: T.gold,
                    display: "inline-block",
                  }}
                />
                Your Gateway to Academic Excellence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="leafline-hero"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              style={{
                fontSize: "clamp(36px,4vw,62px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: T.navy,
                marginBottom: 14,
                letterSpacing: "-0.5px",
              }}
            >
              Read.{" "}
              <span style={{ color: T.gold, fontStyle: "italic" }}>Study.</span>{" "}
              Grow with{" "}
              <span
                style={{
                  color: T.navyMid,
                  borderBottom: `3px solid ${T.gold}`,
                  paddingBottom: 2,
                }}
              >
                LeafLine
              </span>
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ margin: "18px 0", transformOrigin: "left" }}
            >
              <Divider />
            </motion.div>

            {/* Sub copy */}
            <motion.p
              className="leafline-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{
                fontSize: "clamp(15px,1.6vw,17px)",
                color: T.slate,
                lineHeight: 1.8,
                marginBottom: 34,
                fontWeight: 300,
              }}
            >
              LeafLine is your personal digital study hub. Access thousands of
              curated study materials, read scholarly texts, and organise your
              academic journey with precision and clarity.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.82, duration: 0.5 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
            >
              <Link to="/auth/signup" className="cta-primary">
                Begin Your Journey
              </Link>
              <Link to="/explore" className="cta-secondary">
                Explore Library
              </Link>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              className="stat-divider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              {[
                { num: "50+", label: "Universities" },
                { num: "10K+", label: "Academic Texts" },
                { num: "120K+", label: "Students" },
              ].map((s, i) => (
                <div key={i}>
                  <div
                    className="leafline-hero"
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: T.navyMid,
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    className="leafline-body"
                    style={{
                      fontSize: 11,
                      color: T.muted,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT column: 3-D canvas ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1.0, ease: "easeOut" }}
            style={{ flex: 1, position: "relative", minHeight: 520 }}
          >
            <div className="three-wrap">
              {/* floating info chips */}
              <div className="chip cf1" style={{ top: "4%", right: "-2%" }}>
                <div className="chip-icon">📚</div>
                <div>
                  <div className="chip-title">10,000+ Resources</div>
                  <div className="chip-sub">Curated academic texts</div>
                </div>
              </div>

              <div className="chip cf2" style={{ bottom: "16%", right: "-3%" }}>
                <div className="chip-icon">🎓</div>
                <div>
                  <div className="chip-title">50+ Universities</div>
                  <div className="chip-sub">Institutional trust</div>
                </div>
              </div>

              <div className="chip cf3" style={{ top: "38%", left: "-2%" }}>
                <div className="chip-icon">⭐</div>
                <div>
                  <div className="chip-title">Peer-Reviewed</div>
                  <div className="chip-sub">Quality guaranteed</div>
                </div>
              </div>

              <ThreeScene />
            </div>
          </motion.div>
        </div>

        {/* Scroll nudge */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            marginTop: 52,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.38,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            className="leafline-body"
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: T.navy,
            }}
          >
            Scroll
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path
              d="M8 0 L8 20 M2 14 L8 20 L14 14"
              stroke={T.navy}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <motion.section
        className="trust-bar"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {[
          "Trusted by 50+ Universities",
          "10,000+ Academic Texts",
          "Peer-Reviewed Resources",
          "Secure & Private",
          "24 / 7 Access",
        ].map((label, i) => (
          <div key={i} className="trust-item">
            <span style={{ color: T.gold, fontSize: 14 }}>✦</span>
            {label}
          </div>
        ))}
      </motion.section>

      <CategoriesSection />
      <FeatureSection />
      <Stats />
      <TestimonialCarousel />
      <Footer />
    </div>
  );
};

export default Home;
