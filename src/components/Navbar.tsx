import { useEffect, useState, useRef, RefObject, MouseEvent } from "react";

export default function Navbar() {
  const [isSticky, setSticky] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const underlineRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const handleScroll: () => void = () => {
      if (window.scrollY > 66.5) {
        setSticky(true);
      } else {
        setSticky(false);
      }

      const sections: NodeListOf<HTMLElement> =
        document.querySelectorAll("section");

      let currentSection: string = "home";

      sections.forEach((section: HTMLElement) => {
        const sectionTop: number = section.offsetTop;

        if (window.scrollY >= sectionTop - 50) {
          currentSection = section.getAttribute("id") || "home";
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isSticky) {
      document.body.classList.add("stickyNav");
    } else {
      document.body.classList.remove("stickyNav");
    }
  }, [isSticky]);

  useEffect(() => {
    const updateUnderlinePosition = () => {
      const activeLink = document.querySelector(
        `.comp-navbar_menuCenter a[data-section="${activeSection}"]`
      );
      const underline: HTMLDivElement | null = underlineRef.current;

      if (activeLink && underline) {
        const linkRect: DOMRect = activeLink.getBoundingClientRect();

        const menuCenterElement: HTMLElement | null = document.querySelector(
          ".comp-navbar_menuCenter"
        );

        if (menuCenterElement) {
          const menuCenterRect: DOMRect =
            menuCenterElement.getBoundingClientRect();

          underline.style.width = `${linkRect.width}px`;

          underline.style.transform = `translateX(${
            linkRect.left - menuCenterRect.left
          }px)`;
        }
      }
    };

    updateUnderlinePosition();

    window.addEventListener("resize", updateUnderlinePosition);

    return () => {
      window.removeEventListener("resize", updateUnderlinePosition);
    };
  }, [activeSection]);

  const handleClick = (
    e: MouseEvent<HTMLAnchorElement>,
    section: string
  ): void => {
    e.preventDefault();

    if (section === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      const targetSection: HTMLElement | null =
        document.getElementById(section);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <header className="comp-navbar">
      <h1 className="comp-navbar_title">DIGITAL ODYSSEY STUDIO</h1>

      <nav className={`comp-navbar_menu${isSticky ? " sticky" : ""}`}>
        <div className="comp-navbar_menuCenter">
          <a
            href="#home"
            data-section="home"
            className={activeSection === "home" ? "active" : ""}
            onClick={(e) => handleClick(e, "home")}
          >
            Home
          </a>
          <a
            href="#projects"
            data-section="projects"
            className={activeSection === "projects" ? "active" : ""}
            onClick={(e) => handleClick(e, "projects")}
          >
            Projects
          </a>
          <a
            href="#skills"
            data-section="skills"
            className={activeSection === "skills" ? "active" : ""}
            onClick={(e) => handleClick(e, "skills")}
          >
            Skills
          </a>
          <a
            href="#contact"
            data-section="contact"
            className={activeSection === "contact" ? "active" : ""}
            onClick={(e) => handleClick(e, "contact")}
          >
            Contact
          </a>
          <div className="comp-navbar_underline" ref={underlineRef} />
        </div>

        <div className="comp-navbar_menuRight">
          <a
            href="https://github.com/fgaujard?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fab fa-github"
              style={{ marginRight: "0.5rem", scale: "1.5" }}
            />
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
