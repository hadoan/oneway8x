import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-8 md:py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs md:text-sm">OW</span>
            </div>
            <span className="font-bold text-sm md:text-base">oneway8x.com</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/hadoan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://x.com/hadoanx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="X (Twitter)"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/doanmanhha/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
              <Link to="/talelingo/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link to="/talelingo/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} oneway8x.com. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
