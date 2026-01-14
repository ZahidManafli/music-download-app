import { FiHeart, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="glass border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Made with</span>
            <FiHeart className="w-4 h-4 text-pink-500" />
            <span>using</span>
            <a 
              href="https://www.jamendo.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              Jamendo API
            </a>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-gray-400">
            <span className="text-sm">All music is royalty-free under Creative Commons</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <FiTwitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <FiInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
