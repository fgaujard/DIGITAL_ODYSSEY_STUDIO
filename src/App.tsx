import { useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "./lang/i18";
import AnimatedBackground from "./components/AnimatedBackround";
import "./main.scss";

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  const navigate = useNavigate();

  const switchLanguage = (newLang: string) => {
    navigate(`/${newLang}`);
  };

  useEffect(() => {
    // Changer la langue en fonction du paramètre de l'URL
    if (lang && (lang === "en" || lang === "fr")) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <>
      <p>{t("description")}</p>
      <button onClick={() => switchLanguage("en")}>English</button>
      <button onClick={() => switchLanguage("fr")}>Français</button>
      <AnimatedBackground />
    </>
  );
};

export default App;
