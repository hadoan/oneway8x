const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">HA</span>
            </div>
            <span className="font-bold">hadoan.xyz</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} hadoan.xyz. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;