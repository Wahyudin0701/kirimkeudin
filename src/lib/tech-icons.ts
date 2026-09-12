/**
 * Tech Stack Icon Mapping
 * Memetakan nama teknologi ke slug devicon + warna brand.
 * Menggunakan CDN: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/
 */

export type TechInfo = {
  slug: string;       // slug devicon
  variant: string;    // variant icon (original, plain, etc.)
  color: string;      // brand hex color
  label: string;      // display label
};

// Mapping case-insensitive: key = lowercase name → TechInfo
const TECH_MAP: Record<string, TechInfo> = {
  // Languages
  "javascript":    { slug: "javascript",    variant: "original",       color: "#F7DF1E", label: "JavaScript" },
  "js":            { slug: "javascript",    variant: "original",       color: "#F7DF1E", label: "JavaScript" },
  "typescript":    { slug: "typescript",    variant: "original",       color: "#3178C6", label: "TypeScript" },
  "ts":            { slug: "typescript",    variant: "original",       color: "#3178C6", label: "TypeScript" },
  "python":        { slug: "python",        variant: "original",       color: "#3776AB", label: "Python" },
  "java":          { slug: "java",          variant: "original",       color: "#ED8B00", label: "Java" },
  "c":             { slug: "c",             variant: "original",       color: "#A8B9CC", label: "C" },
  "c++":           { slug: "cplusplus",     variant: "original",       color: "#00599C", label: "C++" },
  "cplusplus":     { slug: "cplusplus",     variant: "original",       color: "#00599C", label: "C++" },
  "c#":            { slug: "csharp",        variant: "original",       color: "#239120", label: "C#" },
  "csharp":        { slug: "csharp",        variant: "original",       color: "#239120", label: "C#" },
  "go":            { slug: "go",            variant: "original",       color: "#00ADD8", label: "Go" },
  "golang":        { slug: "go",            variant: "original",       color: "#00ADD8", label: "Go" },
  "rust":          { slug: "rust",          variant: "original",       color: "#000000", label: "Rust" },
  "php":           { slug: "php",           variant: "original",       color: "#777BB4", label: "PHP" },
  "ruby":          { slug: "ruby",          variant: "original",       color: "#CC342D", label: "Ruby" },
  "swift":         { slug: "swift",         variant: "original",       color: "#F05138", label: "Swift" },
  "kotlin":        { slug: "kotlin",        variant: "original",       color: "#7F52FF", label: "Kotlin" },
  "dart":          { slug: "dart",          variant: "original",       color: "#0175C2", label: "Dart" },
  "r":             { slug: "r",             variant: "original",       color: "#276DC3", label: "R" },
  "lua":           { slug: "lua",           variant: "original",       color: "#2C2D72", label: "Lua" },
  "scala":         { slug: "scala",         variant: "original",       color: "#DC322F", label: "Scala" },

  // Frontend Frameworks
  "react":         { slug: "react",         variant: "original",       color: "#61DAFB", label: "React" },
  "react.js":      { slug: "react",         variant: "original",       color: "#61DAFB", label: "React" },
  "reactjs":       { slug: "react",         variant: "original",       color: "#61DAFB", label: "React" },
  "react native":  { slug: "react",         variant: "original",       color: "#61DAFB", label: "React Native" },
  "next.js":       { slug: "nextjs",        variant: "original",       color: "#000000", label: "Next.js" },
  "nextjs":        { slug: "nextjs",        variant: "original",       color: "#000000", label: "Next.js" },
  "vue":           { slug: "vuejs",         variant: "original",       color: "#4FC08D", label: "Vue.js" },
  "vue.js":        { slug: "vuejs",         variant: "original",       color: "#4FC08D", label: "Vue.js" },
  "vuejs":         { slug: "vuejs",         variant: "original",       color: "#4FC08D", label: "Vue.js" },
  "angular":       { slug: "angular",       variant: "original",       color: "#DD0031", label: "Angular" },
  "svelte":        { slug: "svelte",        variant: "original",       color: "#FF3E00", label: "Svelte" },
  "nuxt":          { slug: "nuxtjs",        variant: "original",       color: "#00DC82", label: "Nuxt" },
  "nuxt.js":       { slug: "nuxtjs",        variant: "original",       color: "#00DC82", label: "Nuxt" },
  "astro":         { slug: "astro",         variant: "original",       color: "#FF5D01", label: "Astro" },

  // CSS / Styling
  "tailwind":      { slug: "tailwindcss",   variant: "original",       color: "#06B6D4", label: "Tailwind CSS" },
  "tailwindcss":   { slug: "tailwindcss",   variant: "original",       color: "#06B6D4", label: "Tailwind CSS" },
  "tailwind css":  { slug: "tailwindcss",   variant: "original",       color: "#06B6D4", label: "Tailwind CSS" },
  "css":           { slug: "css3",          variant: "original",       color: "#1572B6", label: "CSS" },
  "css3":          { slug: "css3",          variant: "original",       color: "#1572B6", label: "CSS3" },
  "html":          { slug: "html5",         variant: "original",       color: "#E34F26", label: "HTML" },
  "html5":         { slug: "html5",         variant: "original",       color: "#E34F26", label: "HTML5" },
  "sass":          { slug: "sass",          variant: "original",       color: "#CC6699", label: "Sass" },
  "bootstrap":     { slug: "bootstrap",     variant: "original",       color: "#7952B3", label: "Bootstrap" },
  "material ui":   { slug: "materialui",    variant: "original",       color: "#007FFF", label: "Material UI" },
  "materialui":    { slug: "materialui",    variant: "original",       color: "#007FFF", label: "Material UI" },

  // Backend Frameworks
  "node.js":       { slug: "nodejs",        variant: "original",       color: "#339933", label: "Node.js" },
  "nodejs":        { slug: "nodejs",        variant: "original",       color: "#339933", label: "Node.js" },
  "node":          { slug: "nodejs",        variant: "original",       color: "#339933", label: "Node.js" },
  "express":       { slug: "express",       variant: "original",       color: "#000000", label: "Express" },
  "express.js":    { slug: "express",       variant: "original",       color: "#000000", label: "Express" },
  "expressjs":     { slug: "express",       variant: "original",       color: "#000000", label: "Express" },
  "django":        { slug: "django",        variant: "plain",          color: "#092E20", label: "Django" },
  "flask":         { slug: "flask",         variant: "original",       color: "#000000", label: "Flask" },
  "fastapi":       { slug: "fastapi",       variant: "original",       color: "#009688", label: "FastAPI" },
  "laravel":       { slug: "laravel",       variant: "original",       color: "#FF2D20", label: "Laravel" },
  "spring":        { slug: "spring",        variant: "original",       color: "#6DB33F", label: "Spring" },
  "rails":         { slug: "rails",         variant: "plain",          color: "#CC0000", label: "Rails" },
  "ruby on rails": { slug: "rails",         variant: "plain",          color: "#CC0000", label: "Rails" },
  ".net":          { slug: "dot-net",       variant: "original",       color: "#512BD4", label: ".NET" },
  "dotnet":        { slug: "dot-net",       variant: "original",       color: "#512BD4", label: ".NET" },

  // Databases
  "postgresql":    { slug: "postgresql",    variant: "original",       color: "#4169E1", label: "PostgreSQL" },
  "postgres":      { slug: "postgresql",    variant: "original",       color: "#4169E1", label: "PostgreSQL" },
  "postgree":      { slug: "postgresql",    variant: "original",       color: "#4169E1", label: "PostgreSQL" },
  "mysql":         { slug: "mysql",         variant: "original",       color: "#4479A1", label: "MySQL" },
  "mongodb":       { slug: "mongodb",       variant: "original",       color: "#47A248", label: "MongoDB" },
  "mongo":         { slug: "mongodb",       variant: "original",       color: "#47A248", label: "MongoDB" },
  "redis":         { slug: "redis",         variant: "original",       color: "#DC382D", label: "Redis" },
  "sqlite":        { slug: "sqlite",        variant: "original",       color: "#003B57", label: "SQLite" },
  "supabase":      { slug: "supabase",      variant: "original",       color: "#3FCF8E", label: "Supabase" },
  "firebase":      { slug: "firebase",      variant: "original",       color: "#FFCA28", label: "Firebase" },

  // DevOps & Cloud
  "docker":        { slug: "docker",        variant: "original",       color: "#2496ED", label: "Docker" },
  "kubernetes":    { slug: "kubernetes",    variant: "original",       color: "#326CE5", label: "Kubernetes" },
  "aws":           { slug: "amazonwebservices", variant: "original-wordmark", color: "#FF9900", label: "AWS" },
  "gcp":           { slug: "googlecloud",   variant: "original",       color: "#4285F4", label: "GCP" },
  "google cloud":  { slug: "googlecloud",   variant: "original",       color: "#4285F4", label: "GCP" },
  "azure":         { slug: "azure",         variant: "original",       color: "#0078D4", label: "Azure" },
  "vercel":        { slug: "vercel",        variant: "original",       color: "#000000", label: "Vercel" },
  "netlify":       { slug: "netlify",       variant: "original",       color: "#00C7B7", label: "Netlify" },
  "nginx":         { slug: "nginx",         variant: "original",       color: "#009639", label: "Nginx" },
  "linux":         { slug: "linux",         variant: "original",       color: "#FCC624", label: "Linux" },
  "git":           { slug: "git",           variant: "original",       color: "#F05032", label: "Git" },
  "github":        { slug: "github",        variant: "original",       color: "#181717", label: "GitHub" },

  // Mobile
  "flutter":       { slug: "flutter",       variant: "original",       color: "#02569B", label: "Flutter" },
  "android":       { slug: "android",       variant: "original",       color: "#3DDC84", label: "Android" },
  "ios":           { slug: "apple",         variant: "original",       color: "#000000", label: "iOS" },

  // Tools & Others
  "figma":         { slug: "figma",         variant: "original",       color: "#F24E1E", label: "Figma" },
  "graphql":       { slug: "graphql",       variant: "plain",          color: "#E10098", label: "GraphQL" },
  "prisma":        { slug: "prisma",        variant: "original",       color: "#2D3748", label: "Prisma" },
  "webpack":       { slug: "webpack",       variant: "original",       color: "#8DD6F9", label: "Webpack" },
  "vite":          { slug: "vitejs",        variant: "original",       color: "#646CFF", label: "Vite" },
  "jest":          { slug: "jest",          variant: "plain",          color: "#C21325", label: "Jest" },
  "tensorflow":    { slug: "tensorflow",    variant: "original",       color: "#FF6F00", label: "TensorFlow" },
  "pytorch":       { slug: "pytorch",       variant: "original",       color: "#EE4C2C", label: "PyTorch" },
  "opencv":        { slug: "opencv",        variant: "original",       color: "#5C3EE8", label: "OpenCV" },
  "arduino":       { slug: "arduino",       variant: "original",       color: "#00979D", label: "Arduino" },
  "raspberry pi":  { slug: "raspberrypi",   variant: "original",       color: "#A22846", label: "Raspberry Pi" },
};

/**
 * Get tech info for a given tech name.
 * Returns TechInfo if found, null otherwise.
 */
export function getTechInfo(name: string): TechInfo | null {
  const key = name.toLowerCase().trim();
  return TECH_MAP[key] || null;
}

/**
 * Get devicon CDN URL for a tech.
 */
export function getTechIconUrl(slug: string, variant: string): string {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${variant}.svg`;
}

/**
 * Get all info needed to render a tech icon.
 * Falls back to a text badge if not in the mapping.
 */
export function resolveTech(name: string): {
  label: string;
  iconUrl: string | null;
  color: string;
} {
  const info = getTechInfo(name);
  if (info) {
    return {
      label: info.label,
      iconUrl: getTechIconUrl(info.slug, info.variant),
      color: info.color,
    };
  }
  return {
    label: name,
    iconUrl: null,
    color: "#0D2D6B",
  };
}
