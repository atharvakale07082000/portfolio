import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-navy border-t border-white/5 py-12 mt-20">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-2">Atharva Kale</h3>
                    <p className="text-gray-400 text-sm">
                        Senior Backend & AI Engineer | Building intelligent systems.
                    </p>
                </div>

                <div className="flex gap-6">
                    <a
                        href="https://github.com/atharvakale07082000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-primary transition-all"
                    >
                        <Github size={20} />
                    </a>
                    <a
                        href="https://linkedin.com/in/atharva-kale-7b0b53177"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-primary transition-all"
                    >
                        <Linkedin size={20} />
                    </a>
                    <a
                        href="mailto:atharva.skale07@gmail.com"
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-primary transition-all"
                    >
                        <Mail size={20} />
                    </a>
                </div>

                <div className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Atharva Kale. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
