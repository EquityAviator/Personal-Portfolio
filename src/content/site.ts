/**
 * Profile, navigation, education, skills and narrative content.
 * Source of truth: the author's provided profile documentation.
 */

export const profile = {
  name: "Muhammad Hamza Mushtaq",
  shortName: "Hamza Mushtaq",
  firstName: "Hamza",
  role: "Software & AI Engineer",
  specialization: [
    "AI Systems",
    "Machine Learning",
    "Computer Vision",
    "Full-Stack Engineering",
  ],
  location: "Attock, Pakistan",
  timezone: "UTC+5 · Asia/Karachi",
  availability: "Open to Software & AI roles — 2026 graduate",
  email: "m.hamza.mushtaq.14@gmail.com",
  phone: "+92 303 7370044",
  phoneHref: "tel:+923037370044",
  github: "https://github.com/EquityAviator",
  linkedin: "https://www.linkedin.com/in/muhammad-hamza-mushtaq-93b47428b",
} as const;

export const heroValue =
  "I build AI-enabled software systems — from model experimentation and dataset engineering to production products people actually use.";

export const heroStatement = {
  lead: "I turn models and algorithms into",
  highlight: "usable systems",
  tail: "— not AI bolted onto a product.",
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const proofStrip = [
  {
    index: "01",
    title: "Multimodal AI",
    text: "Vision–language systems for dark-pattern detection and image captioning — dataset creation, fine-tuning, evaluation.",
  },
  {
    index: "02",
    title: "Full-stack products",
    text: "Learning platforms, trust infrastructure and review systems — Next.js, FastAPI, Prisma, Socket.IO, deployment.",
  },
  {
    index: "03",
    title: "Evidence-driven research",
    text: "Fixed evaluation protocols, artifact provenance, documented failures and corrected results.",
  },
  {
    index: "04",
    title: "Systems thinking",
    text: "State machines, event pipelines, background jobs, RBAC, realtime mirroring — engineered, not assembled.",
  },
] as const;

export const howIBuild = [
  {
    step: "01",
    title: "Understand",
    text: "Define the actual problem before the solution — who it serves and what 'working' means.",
  },
  {
    step: "02",
    title: "Design",
    text: "Architecture, UX and system boundaries. Decide what owns state, what stays pure, what fails first.",
  },
  {
    step: "03",
    title: "Build",
    text: "Implement frontend, backend and AI layers against typed contracts and structured outputs.",
  },
  {
    step: "04",
    title: "Validate",
    text: "Test behavior, performance and model output under one fixed evaluation protocol.",
  },
  {
    step: "05",
    title: "Deploy",
    text: "Package and release the system — Docker, migrations, HTTPS, backups, operational tooling.",
  },
  {
    step: "06",
    title: "Improve",
    text: "Measure limitations honestly, document failures, and iterate with evidence.",
  },
] as const;

export const skillGroups = [
  {
    name: "AI · ML & Computer Vision",
    items: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "Keras",
      "Machine Learning",
      "Computer Vision",
      "CNN",
      "LSTM",
      "Vision-Language Models",
      "LLM Integration",
      "Multimodal AI",
      "Model Fine-Tuning",
      "QLoRA",
      "Unsloth",
      "Dataset Creation & Annotation",
      "Model Evaluation",
      "Reinforcement Learning",
      "GRPO",
      "Attention Mechanisms",
      "Image Captioning",
      "Hallucination Analysis",
      "Confidence Calibration",
    ],
  },
  {
    name: "AI Systems & Intelligent Applications",
    items: [
      "AI Model Integration",
      "Local LLM/VLM Inference",
      "Prompt Engineering",
      "AI Provider Abstraction",
      "Structured AI Outputs",
      "AI Moderation",
      "Human-in-the-Loop Systems",
      "Semantic Analysis",
      "OOD Detection & Routing",
      "AI-assisted Automation",
    ],
  },
  {
    name: "Full-Stack & Web",
    items: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "HTML/CSS",
      "Tailwind CSS",
      "REST APIs",
      "FastAPI",
      "Node.js",
      "Prisma",
      "Socket.IO",
    ],
  },
  {
    name: "Backend & Data",
    items: [
      "SQL",
      "MySQL",
      "PostgreSQL",
      "SQLite",
      "Relational Database Design",
      "Database Modeling",
      "API Design",
      "Authentication",
      "RBAC",
      "Background Jobs",
      "Event-Driven Workflows",
      "Realtime Systems",
    ],
  },
  {
    name: "Software Engineering",
    items: [
      "OOP",
      "Data Structures & Algorithms",
      "SDLC",
      "System Design",
      "Software Architecture",
      "Design Principles",
      "Modular Architecture",
      "MVC",
      "Debugging",
      "Testing",
      "Technical Documentation",
    ],
  },
  {
    name: "DevOps & Tools",
    items: [
      "Docker",
      "Git",
      "GitHub",
      "Linux / CLI Workflows",
      "VS Code",
      "Visual Studio",
      "IntelliJ IDEA",
    ],
  },
  {
    name: "Specialized",
    items: [
      "Chrome Extension APIs",
      "Manifest V3",
      "Browser Automation",
      "DOM Analysis",
      "Cryptographic Hashing",
      "Blockchain / EVM Integration",
      "FSRS Spaced Repetition",
    ],
  },
] as const;

export const technicalFocus = [
  {
    domain: "AI / ML",
    items: "Multimodal AI · Computer Vision · VLMs · Fine-Tuning · Model Evaluation",
  },
  {
    domain: "Software",
    items: "Full-Stack Development · Backend Systems · APIs · System Architecture",
  },
  {
    domain: "Intelligent Systems",
    items: "AI Agents · Automation · AI Integration · Human-in-the-Loop Workflows",
  },
  {
    domain: "Research",
    items: "Experimental Design · Ablation Studies · Dataset Engineering · Reproducible Evaluation",
  },
] as const;

export const education = [
  {
    school: "COMSATS University Islamabad",
    campus: "Attock Campus",
    degree: "Bachelor of Software Engineering",
    period: "2022 — 2026",
    detail: "CGPA 3.34 / 4.00",
    focus: ["AI / ML", "Software Engineering", "Computer Vision", "Databases", "Algorithms"],
  },
  {
    school: "The Hope Science School & College",
    campus: "Kamra",
    degree: "F.Sc. (ICS)",
    period: "2019 — 2021",
    detail: "87.9%",
    focus: [],
  },
] as const;

export const about = {
  paragraphs: [
    "Software Engineering graduate (2026, CGPA 3.34/4.00) building AI-enabled software systems across machine learning, computer vision, multimodal AI, full-stack applications, and backend engineering. My work spans the full path from experimentation and dataset development to model fine-tuning, inference, API integration, and user-facing products.",
    "Built and evaluated multimodal AI systems for dark-pattern detection and image captioning, including custom dataset creation, vision-language model experimentation, fine-tuning, evaluation, hallucination analysis, and local inference optimization. Also developed full-stack platforms combining adaptive learning, real-time communication, AI moderation, cryptographic verification, blockchain-compatible infrastructure, analytics, and production deployment.",
    "I enjoy working at the intersection of AI research, software engineering, and practical product development — turning models and algorithms into usable systems rather than treating AI as an isolated component.",
  ],
  currently:
    "Currently: building AI-powered systems and exploring production-oriented agentic workflows.",
  interests: [
    "Artificial Intelligence",
    "Computer Vision",
    "Machine Learning Research",
    "Multimodal AI",
    "AI Agents & Automation",
    "Open-Source AI Models",
    "Software Architecture",
    "Backend Systems",
    "Emerging Technologies",
  ],
} as const;

export const researchIntro =
  "Not every improvement survives evaluation — and that is the point. Across my projects, model work is treated as an evidence-driven search: identify the bottleneck, change one variable, measure under one fixed protocol, and keep only what the evidence justifies. The CaptionAI program below is the clearest example.";
