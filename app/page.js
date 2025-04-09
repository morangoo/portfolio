'use client';
import { useEffect, useState } from "react";
import Welcome from "@/app/components/welcome";

export default function Home() {
  
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setShowWelcome(false);
        document.body.style.overflow = 'auto';
      } else {
        setShowWelcome(true);
        document.body.style.overflow = 'hidden';
      }
    }, {
      root: null,
      threshold: 0.1, 
    });

    // Observar o #teste
    const targetElement = document.getElementById('teste');
    if (targetElement) {
      observer.observe(targetElement);
    }

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, []);

  return (
    <div>
      {showWelcome && <Welcome />}
      <div id="teste" className="flex h-screen items-center justify-center">
        <h1>Agora podes dar scroll!</h1>
      </div>
      <div id="teste2" className="flex h-screen items-center justify-center">
        <h1>Agora podes dar scroll!2</h1>
      </div>
    </div>
  );
}
