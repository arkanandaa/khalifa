export interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  year: string;
}

export interface Expertise {
  id?: string;
  title: string;
  description: string;
}

export interface Role {
  id?: string;
  title: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
}
