import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Rudra Tank
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Passionate full-stack developer crafting innovative solutions and bringing creative ideas to life through elegant code.
              </p>
              <div className="pt-2">
                <a
                  href="mailto:rudratank07@gmail.com"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  rudratank07gmail.com
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#projects" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#skills" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Skills
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-sm text-gray-600">
                  Let's connect and build something amazing together!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Rudra Tank. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-300">|</span>
              <a href="/terms-of-service" className="text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;