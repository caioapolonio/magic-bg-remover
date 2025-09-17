import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-8 flex flex-col items-center gap-4 text-fuchsia-200 sm:flex-row">
      <p className="text-sm">Made with ❤️ by me</p>
      <div className="flex gap-4">
        <a
          href="https://github.com/caioapolonio"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative transform transition-transform duration-300 hover:scale-125 hover:rotate-6 hover:text-white"
        >
          <FaGithub size={24} />
          <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-purple-800 px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
            GitHub
          </span>
        </a>
        <a
          href="https://linkedin.com/caioviniciusmendes"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative transform transition-transform duration-300 hover:scale-125 hover:-rotate-6 hover:text-white"
        >
          <FaLinkedin size={24} />
          <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-purple-800 px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
            LinkedIn
          </span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
