"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CursorSpotlight() {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  // Spotlight springs
  const springX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 25 });

  // Ripple state
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const lastRipplePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      // Update spotlight position
      mouseX.set(e.clientX - 300);
      mouseY.set(e.clientY - 300);

      // Create water ripples
      const dist = Math.hypot(e.clientX - lastRipplePos.current.x, e.clientY - lastRipplePos.current.y);
      // Spawn a new ripple every 50px of movement
      if (dist > 50) {
        lastRipplePos.current = { x: e.clientX, y: e.clientY };
        
        const newRipple = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
        };
        
        // Keep max 20 ripples to prevent lag
        setRipples((prev) => [...prev.slice(-19), newRipple]);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] hidden md:block overflow-hidden">
      {/* 1. Soft Spotlight */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px]"
        style={{
          x: springX,
          y: springY,
          opacity: isVisible ? 1 : 0,
          background: "radial-gradient(circle, rgba(245, 197, 24, 0.08) 0%, rgba(245, 197, 24, 0.02) 40%, transparent 60%)",
          transition: "opacity 0.5s ease",
        }}
      />

      {/* 2. Water Ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              left: ripple.x - 40, // Center an 80px circle
              top: ripple.y - 40,
              width: 80,
              height: 80,
              // Glassy water ripple look
              border: "1px solid rgba(13, 45, 107, 0.15)", // ku-navy faint
              boxShadow: "inset 0 0 15px rgba(245, 197, 24, 0.1)", // ku-yellow inner glow
              backdropFilter: "blur(1px)",
            }}
            initial={{ scale: 0.1, opacity: 0.8, borderWidth: "3px" }}
            animate={{ scale: 2.5, opacity: 0, borderWidth: "1px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
