import type { IconType } from "react-icons";
import {
    SiCelery,
    SiCrewai,
    SiDocker,
    SiFastapi,
    SiGithubactions,
    SiGooglecloud,
    SiGooglegemini,
    SiHuggingface,
    SiKubernetes,
    SiLangchain,
    SiLanggraph,
    SiMongodb,
    SiNextdotjs,
    SiOllama,
    SiPostgresql,
    SiPydantic,
    SiPython,
    SiPytorch,
    SiRabbitmq,
    SiReact,
    SiRedis,
    SiTailwindcss,
    SiTypescript,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";

const ICONS: Record<string, IconType> = {
    python: SiPython,
    langchain: SiLangchain,
    langgraph: SiLanggraph,
    crewai: SiCrewai,
    pytorch: SiPytorch,
    huggingface: SiHuggingface,
    gemini: SiGooglegemini,
    ollama: SiOllama,
    fastapi: SiFastapi,
    pydantic: SiPydantic,
    rabbitmq: SiRabbitmq,
    celery: SiCelery,
    redis: SiRedis,
    mongodb: SiMongodb,
    postgresql: SiPostgresql,
    aws: FaAws,
    docker: SiDocker,
    kubernetes: SiKubernetes,
    githubactions: SiGithubactions,
    googlecloud: SiGooglecloud,
    react: SiReact,
    nextjs: SiNextdotjs,
    typescript: SiTypescript,
    tailwind: SiTailwindcss,
};

/** A brand logo by key, or a monogram when no logo exists (e.g. Strands). */
export default function TechIcon({
    icon,
    name,
    className = "",
    style,
}: {
    icon: string;
    name: string;
    className?: string;
    style?: React.CSSProperties;
}) {
    const Icon = ICONS[icon];
    if (Icon) return <Icon aria-hidden="true" className={className} style={style} />;
    const mono = name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2);
    return (
        <span
            aria-hidden="true"
            className={`inline-grid place-items-center font-semibold leading-none ${className}`}
            style={{ ...style, fontSize: "0.62em" }}
        >
            {mono}
        </span>
    );
}
