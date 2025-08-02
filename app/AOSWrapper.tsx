// app/AOSWrapper.tsx
'use client';

import { useEffect } from "react";
import AOS from "aos";

export default function AOSWrapper() {
  useEffect(() => {
    AOS.init({
      // Настройки анимации, если нужно
      duration: 800,
      once: true,
    });
  }, []);

  return null;
}
