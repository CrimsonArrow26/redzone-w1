import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-red-50 to-slate-100 border-t border-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Brand and Tagline */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-red-600">RedZone</h3>
          <p className="text-gray-600 text-sm mt-1">
            Transforming Safety through Technology and Community.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-red-600 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-sm text-center md:text-right">
          &copy; {new Date().getFullYear()} RedZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
