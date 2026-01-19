import { FiHeart, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="glass border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* Copyright - wraps on mobile */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-gray-400 text-xs sm:text-sm text-center">
            <span>Made with</span>
            <span className="text-pink-400">Zahid Manafli</span>
            <span>using</span>
            <a 
              href="https://www.jamendo.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              Jamendo API
            </a>
            <span>and</span>
            <a 
              href="https://big.az"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              Big.az
            </a>
            <span>and</span>
            <a 
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              YouTube
            </a>
          </div>

          {/* Links - centered on mobile */}
          <div className="flex items-center justify-center text-gray-400">
            <span className="text-xs sm:text-sm text-center">All music is royalty-free under Creative Commons</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a 
              href="#" 
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              aria-label="GitHub"
            >
              <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              aria-label="Twitter"
            >
              <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              aria-label="Instagram"
            >
              <FiInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
