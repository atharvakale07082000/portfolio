import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";

/* The React Compiler rules ship in eslint-plugin-react-hooks@7. Next already
   registers the plugin, so only the rule set is layered on top. Every
   compiler rule is an error: fix the code, never disable the rule. */
const compilerRules = Object.fromEntries(
    Object.entries(reactHooks.configs.flat["recommended-latest"].rules).map(([rule, level]) => [
        rule,
        level === "warn" && rule !== "react-hooks/incompatible-library" ? "error" : level,
    ])
);

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    { rules: compilerRules },
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "backend/**", "scripts/**"]),
]);
