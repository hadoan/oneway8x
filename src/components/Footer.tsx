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
          
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} oneway8x.com. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;