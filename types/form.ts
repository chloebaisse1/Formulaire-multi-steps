export type FormData = {
  nom: string
  prenom: string
  email: string
  description: string
  url_github?: string
  url_youtube?: string
  url_site?: string
  job: string
  technologies: string[]
}

export const jobOptions = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backtend" },
  { value: "fullstack", label: "Fullstack" },
]

export const techOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "node", label: "Node" },
  { value: "express", label: "Express" },
  { value: "nest", label: "Nest" },
]
