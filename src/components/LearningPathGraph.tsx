import React, { useEffect, useRef, useState, useCallback } from "react";

interface Course {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface Link {
  from: string;
  to: string;
}

const LearningPathGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  // Configuration
  const NODE_RADIUS = 30;
  const BUTTON_RADIUS = 8;
  const BUTTON_DISTANCE = 80;
  const BASE_FONT_SIZE = 14;
  const HIDE_DELAY = 1000; // délai en ms avant de cacher les boutons

  // États
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCourse, setHoveredCourse] = useState<Course | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [displayedCourse, setDisplayedCourse] = useState<Course | null>(null);

  // Données
  const [courses] = useState<Course[]>([
    { id: "cli", name: "CLI", x: -300, y: 0 },
    { id: "html", name: "HTML", x: -150, y: 0 },
    { id: "css", name: "CSS", x: 0, y: 0 },
    { id: "js", name: "JavaScript", x: 150, y: -100 },
    { id: "react", name: "React", x: 300, y: -100 },
    { id: "node", name: "Node.js", x: 450, y: -100 },
    { id: "express", name: "Express", x: 600, y: -100 },
    { id: "php", name: "PHP", x: 150, y: 100 },
    { id: "symfony", name: "Symfony", x: 300, y: 100 },
  ]);

  const [links] = useState<Link[]>([
    { from: "cli", to: "html" },
    { from: "html", to: "css" },
    { from: "css", to: "js" },
    { from: "css", to: "php" },
    { from: "js", to: "react" },
    { from: "react", to: "node" },
    { from: "node", to: "express" },
    { from: "php", to: "symfony" },
  ]);

  // Calcul des angles en fonction des liens existants
  const calculateAngles = useCallback(() => {
    const cssNode = courses.find((c) => c.id === "css");
    const jsNode = courses.find((c) => c.id === "js");
    const phpNode = courses.find((c) => c.id === "php");

    if (!cssNode || !jsNode || !phpNode) return [];

    // Calcul des angles des diagonales existantes
    const topAngle = Math.atan2(jsNode.y - cssNode.y, jsNode.x - cssNode.x);
    const bottomAngle = Math.atan2(
      phpNode.y - cssNode.y,
      phpNode.x - cssNode.x
    );

    return [
      { angle: -Math.PI / 2, name: "top" }, // Haut
      { angle: topAngle, name: "topRight" }, // Diagonale haute
      { angle: 0, name: "right" }, // Droite
      { angle: bottomAngle, name: "bottomRight" }, // Diagonale basse
      { angle: Math.PI / 2, name: "bottom" }, // Bas
    ];
  }, [courses]);

  // Initialisation du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        setContext(ctx);
      }
    }
  }, []);

  const getScaledFontSize = useCallback(
    (baseSize: number) => {
      const scaledSize = baseSize / Math.sqrt(scale);
      return Math.min(Math.max(8, scaledSize), 20);
    },
    [scale]
  );

  // Gestionnaire de souris avec délai de maintien
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDragging) {
        setOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
        return;
      }

      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Vérifier le survol des cours
      let foundCourse: Course | null = null;
      for (const course of courses) {
        const scaledX = course.x * scale + offset.x;
        const scaledY = course.y * scale + offset.y;

        if (Math.hypot(x - scaledX, y - scaledY) <= NODE_RADIUS * scale) {
          foundCourse = course;
          break;
        }
      }

      // Réinitialiser le timer si on survole un nouveau cours
      if (foundCourse) {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
        setHoveredCourse(foundCourse);
        setDisplayedCourse(foundCourse);
      }

      // Vérifier le survol des boutons
      if (displayedCourse) {
        const courseX = displayedCourse.x * scale + offset.x;
        const courseY = displayedCourse.y * scale + offset.y;

        let foundButton: string | null = null;
        const buttonPositions = calculateAngles();
        for (const pos of buttonPositions) {
          const buttonX =
            courseX + Math.cos(pos.angle) * BUTTON_DISTANCE * scale;
          const buttonY =
            courseY + Math.sin(pos.angle) * BUTTON_DISTANCE * scale;

          if (Math.hypot(x - buttonX, y - buttonY) <= BUTTON_RADIUS * scale) {
            foundButton = pos.name;
            break;
          }
        }
        setHoveredButton(foundButton);
      }

      // Si on ne survole plus le cours, démarrer le timer pour cacher les boutons
      if (!foundCourse && !hideTimeoutRef.current) {
        hideTimeoutRef.current = window.setTimeout(() => {
          setDisplayedCourse(null);
          setHoveredCourse(null);
          setHoveredButton(null);
          hideTimeoutRef.current = null;
        }, HIDE_DELAY);
      }
    },
    [
      courses,
      isDragging,
      dragStart,
      scale,
      offset,
      displayedCourse,
      calculateAngles,
    ]
  );

  const handleMouseLeave = useCallback(() => {
    // Démarrer le timer pour cacher les boutons
    if (!hideTimeoutRef.current) {
      hideTimeoutRef.current = window.setTimeout(() => {
        setDisplayedCourse(null);
        setHoveredCourse(null);
        setHoveredButton(null);
        hideTimeoutRef.current = null;
      }, HIDE_DELAY);
    }
  }, []);

  // Reste des gestionnaires d'événements...
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button === 0) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      }
    },
    [offset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => {
      const newScale = Math.min(Math.max(0.1, prev * scaleFactor), 5);
      return newScale;
    });
  }, []);

  // Rendu du canvas
  useEffect(() => {
    if (!context) return;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.save();
    context.translate(offset.x, offset.y);
    context.scale(scale, scale);

    // Dessiner les liens
    links.forEach((link) => {
      const fromCourse = courses.find((c) => c.id === link.from);
      const toCourse = courses.find((c) => c.id === link.to);
      if (!fromCourse || !toCourse) return;

      const angle = Math.atan2(
        toCourse.y - fromCourse.y,
        toCourse.x - fromCourse.x
      );

      context.beginPath();
      context.moveTo(fromCourse.x, fromCourse.y);
      context.lineTo(toCourse.x, toCourse.y);
      context.strokeStyle = "#94a3b8";
      context.lineWidth = 2 / scale;
      context.stroke();

      // Flèche
      const arrowLength = 10 / scale;
      const arrowWidth = 6 / scale;

      context.save();
      context.translate(toCourse.x, toCourse.y);
      context.rotate(angle);
      context.translate(-NODE_RADIUS, 0);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(-arrowLength, -arrowWidth);
      context.lineTo(-arrowLength, arrowWidth);
      context.closePath();
      context.fillStyle = "#94a3b8";
      context.fill();

      context.restore();
    });

    // Dessiner les cours
    courses.forEach((course) => {
      const isHovered = hoveredCourse === course;
      const isDisplayed = displayedCourse === course;

      // Cercle du cours
      context.beginPath();
      context.arc(course.x, course.y, NODE_RADIUS, 0, Math.PI * 2);
      context.fillStyle = isHovered || isDisplayed ? "#3b82f6" : "white";
      context.fill();
      context.strokeStyle = "#3b82f6";
      context.lineWidth = 2 / scale;
      context.stroke();

      // Texte du cours
      const fontSize = getScaledFontSize(BASE_FONT_SIZE);
      context.font = `${fontSize}px sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = isHovered || isDisplayed ? "white" : "#374151";
      context.fillText(course.name, course.x, course.y);

      // Dessiner les boutons d'ajout
      if (isDisplayed) {
        const buttonPositions = calculateAngles();
        buttonPositions.forEach((pos) => {
          const buttonX = course.x + Math.cos(pos.angle) * BUTTON_DISTANCE;
          const buttonY = course.y + Math.sin(pos.angle) * BUTTON_DISTANCE;
          const isButtonHovered = hoveredButton === pos.name;

          context.beginPath();
          context.arc(buttonX, buttonY, BUTTON_RADIUS, 0, Math.PI * 2);
          context.fillStyle = isButtonHovered ? "#2563eb" : "#3b82f6";
          context.fill();

          const buttonFontSize = getScaledFontSize(BASE_FONT_SIZE * 1.2);
          context.font = `${buttonFontSize}px sans-serif`;
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillStyle = "white";
          context.fillText("+", buttonX, buttonY);
        });
      }
    });

    context.restore();
  }, [
    context,
    courses,
    links,
    hoveredCourse,
    displayedCourse,
    hoveredButton,
    offset,
    scale,
    getScaledFontSize,
    calculateAngles,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-screen"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
    />
  );
};

export default LearningPathGraph;
