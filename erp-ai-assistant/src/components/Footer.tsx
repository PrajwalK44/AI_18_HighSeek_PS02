import Link from "next/link";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IDMS AI
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-powered enterprise support solution for IDMS ERP system
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium">Product</h3>
              <nav className="mt-2 flex flex-col space-y-2">
                <Link href="/features" className="text-sm hover:underline">
                  Features
                </Link>
                <Link href="/modules" className="text-sm hover:underline">
                  ERP Modules
                </Link>
                <Link href="/workflow" className="text-sm hover:underline">
                  Workflow
                </Link>
                <Link href="/demo" className="text-sm hover:underline">
                  Demo
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-sm font-medium">Company</h3>
              <nav className="mt-2 flex flex-col space-y-2">
                <Link href="/about" className="text-sm hover:underline">
                  About
                </Link>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact
                </Link>
                <Link href="/privacy" className="text-sm hover:underline">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm hover:underline">
                  Terms
                </Link>
              </nav>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Stay Connected</h3>
            <div className="mt-2 flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <FiTwitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <FiGithub size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <FiLinkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} IDMS AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
