import { Project, Expertise, Role, Skill } from "./types";

export const INITIAL_ROLES: Role[] = [
  {
    title: "Mining Engineer",
    description: "Specializing in open-pit optimization and sustainable resource extraction."
  },
  {
    title: "Petroleum Student",
    description: "Focusing on reservoir engineering and enhanced oil recovery techniques."
  }
];

export const INITIAL_EXPERTISE: Expertise[] = [
  {
    title: "Mine Planning",
    description: "Proficient in Surpac and Whittle for strategic mine design and optimization."
  },
  {
    title: "Reservoir Simulation",
    description: "Hands-on experience with Eclipse and Petrel for fluid flow modeling."
  },
  {
    title: "Drilling Engineering",
    description: "Understanding of well design, casing selection, and drilling fluid properties."
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    title: "Open Pit Optimization Study",
    description: "A comprehensive study on maximizing NPV for a gold mine in Kalimantan using Lerchs-Grossmann algorithm.",
    imageUrl: "https://images.unsplash.com/photo-1578307338691-f5bc05b17976?q=80&w=1000&auto=format&fit=crop",
    category: "Mining",
    year: "2023"
  },
  {
    title: "EOR Feasibility Analysis",
    description: "Evaluating the potential of CO2 injection for a mature oil field in Sumatra.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
    category: "Petroleum",
    year: "2024"
  }
];

export const SKILLS: Skill[] = [
  { name: "Surpac", level: 90 },
  { name: "Petrel", level: 85 },
  { name: "Whittle", level: 80 },
  { name: "AutoCAD", level: 85 },
  { name: "Python (Data Analysis)", level: 75 },
  { name: "Project Management", level: 80 }
];
