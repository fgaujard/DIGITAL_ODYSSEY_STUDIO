import React, { useEffect, useRef, useState } from "react";
import { Menu, X, Code, Palette, Globe, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../scss/pages/_style.scss";

// Enregistrement du plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AnimatedBackground: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Refs pour les sections
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroButtonsRef = useRef(null);
  const heroScrollRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);

  const services = [
    {
      icon: <Code className="icon" />,
      title: "Développement Web",
      description:
        "Sites sur mesure, applications web performantes et solutions e-commerce innovantes.",
    },
    {
      icon: <Palette className="icon" />,
      title: "Design UI/UX",
      description:
        "Interfaces élégantes et intuitives, expérience utilisateur optimisée.",
    },
    {
      icon: <Globe className="icon" />,
      title: "Marketing Digital",
      description:
        "Stratégies SEO, campagnes marketing et présence sociale impactante.",
    },
  ];

  useEffect(() => {
    // Contexte pour le nettoyage
    const ctx = gsap.context(() => {
      // Animation Hero section
      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: heroTitleRef.current,
          start: "top 80%",
        },
      });

      heroTl
        .fromTo(
          ".hero__title span",
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2 }
        )
        .fromTo(
          heroSubtitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".hero__buttons .button",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
          "-=0.5"
        )
        .fromTo(
          heroScrollRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        );

      // Animation Navigation au scroll
      ScrollTrigger.create({
        start: "top -80",
        onUpdate: (self) => {
          const nav = document.querySelector(".nav");
          if (nav) {
            if (self.direction === 1) {
              nav.classList.add("scrolled");
            } else {
              nav.classList.remove("scrolled");
            }
          }
        },
      });

      // Animation Services avec meilleure performance
      const servicesCards = gsap.utils.toArray(".services__card");
      servicesCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            delay: index * 0.2, // Ajout d'un délai progressif
          }
        );
      });

      // Animation CTA améliorée
      gsap.fromTo(
        ctaRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Cleanup
    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav__container">
          <div className="nav__logo">WebAgence</div>

          <div className="nav__menu">
            <div className="nav__links">
              <a href="#" className="nav__link">
                Accueil
              </a>
              <a href="#" className="nav__link">
                Services
              </a>
              <a href="#" className="nav__link">
                Portfolio
              </a>
              <a href="#" className="nav__link">
                Contact
              </a>
            </div>
          </div>

          <button
            className="nav__toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div className={`nav__mobile ${isMenuOpen ? "is-open" : ""}`}>
          <a href="#" className="nav__mobile-link">
            Accueil
          </a>
          <a href="#" className="nav__mobile-link">
            Services
          </a>
          <a href="#" className="nav__mobile-link">
            Portfolio
          </a>
          <a href="#" className="nav__mobile-link">
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          <h1 className="hero__title" ref={heroTitleRef}>
            <span>Donnez vie à vos</span>
            <span className="hero__title-gradient">projets digitaux</span>
          </h1>
          <p className="hero__subtitle" ref={heroSubtitleRef}>
            Nous créons des expériences web exceptionnelles pour faire briller
            votre entreprise dans le monde numérique.
          </p>
          <div className="hero__buttons" ref={heroButtonsRef}>
            <button className="hero__cta button button--primary">
              Démarrer un projet
              <ArrowRight />
            </button>
            <button className="hero__cta button button--secondary">
              En savoir plus
            </button>
          </div>
          <div className="scroll-indicator">
            <div className="container">
              <span className="text">Découvrir</span>
              <div className="mouse">
                <div className="dot"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero__background">
          <div className="blob blob--1"></div>
          <div className="blob blob--2"></div>
          <div className="blob blob--3"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" ref={servicesRef}>
        <div className="services__container">
          <h2 className="services__title">Nos Services</h2>
          <p className="services__subtitle">
            Des solutions adaptées à vos besoins spécifiques
          </p>

          <div className="services__grid">
            {services.map((service, index) => (
              <div key={index} className="services__card">
                <div className="services__card-icon">{service.icon}</div>
                <h3 className="services__card-title">{service.title}</h3>
                <p className="services__card-description">
                  {service.description}
                </p>
                <a href="#" className="services__card-link">
                  En savoir plus
                  <ArrowRight />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" ref={ctaRef}>
        <div className="cta__container">
          <div className="cta__content">
            <h2 className="cta__title">
              <span>Prêt à transformer</span>
              <span>votre présence en ligne ?</span>
            </h2>
            <p className="cta__text">
              Contactez-nous dès aujourd'hui pour discuter de votre projet
            </p>
            <button className="button button--white">
              Commencer maintenant
              <ArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnimatedBackground;
