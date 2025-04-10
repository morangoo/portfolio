'use client';
import { useEffect, useState } from "react";
import Welcome from "@/app/components/welcome";
import Header from "@/app/components/header";

export default function Home() {
  
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
  
      if (!entry.isIntersecting) {
        setShowWelcome(false);
        document.body.style.overflow = 'auto';
        const elemento = document.getElementById('welcome-container');
        if (elemento) {
          const alturaElementoRemovido = elemento.offsetHeight;
          window.scrollTo(0, window.scrollY - alturaElementoRemovido);
        }
      }
    }, {
      root: null,
      threshold: 0.1,
    });
  
    const targetElement = document.getElementById('welcomescreen');
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
      <Header />
      <p> teste </p>
      <p> testeee</p>
      <p> testeeeee</p>
    </div>
  );
}
