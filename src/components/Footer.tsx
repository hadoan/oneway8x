import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand & Bio */}
          <div className="md:col-span-2">
            <a href="/" className="inline-flex items-center space-x-2 mb-4 group">
              <img src="/logo.svg" alt="OW Logo" className="w-8 h-8 rounded-lg shadow-sm" />
              <span className="font-bold text-xl group-hover:text-primary transition-colors">oneway8x.com</span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-4">
              Founder-engineer building AI products and scalable software systems.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Berlin-based. Working with founders and teams across Europe.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/#works" className="text-sm text-muted-foreground hover:text-primary transition-colors">Work</a>
              </li>
              <li>
                <a href="/#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</a>
              </li>
              <li>
                <a href="/writing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Writing</a>
              </li>
              <li>
                <a href="/#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a>
              </li>
              <li>
                <a href="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Socials & Studio */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://ai-mvp.oneway8x.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  AI MVP Studio
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/oneway8x" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/oneway8x" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Ha Doan (oneway8x). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
