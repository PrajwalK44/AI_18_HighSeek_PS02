"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            IDMS AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 md:gap-10">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="/modules"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Modules
          </Link>
          <Link
            href="/workflow"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Workflow
          </Link>
          <Link
            href="/chat"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Chat
          </Link>
          <Link
            href="/demo"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Demo
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 md:hidden">
          <div className="relative h-full w-full rounded-md bg-background shadow-lg">
            <nav className="flex flex-col p-6 space-y-4">
              <Link
                href="/"
                className="text-lg font-medium hover:text-primary"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/features"
                className="text-lg font-medium hover:text-primary"
                onClick={toggleMenu}
              >
                Features
              </Link>
              <Link
                href="/modules"
                className="text-lg font-medium hover:text-primary"
                onClick={toggleMenu}
              >
                Modules
              </Link>
              <Link
                href="/workflow"
                className="text-lg font-medium hover:text-primary"
                onClick={toggleMenu}
              >
                Workflow
              </Link>
              <Link
                href="/chat"
                className="text-lg font-medium hover:text-primary"
                onClick={toggleMenu}
              >
                Chat
              </Link>
              <Link
                href="/demo"
                className="text-lg font-medium hover:text-primary"
                onClick={toggleMenu}
              >
                Demo
              </Link>
              <Link
                href="/contact"
                className="text-lg font-medium hover:text-primary"
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
