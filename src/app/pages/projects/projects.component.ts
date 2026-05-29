import { Component } from '@angular/core';

interface Project {
  name: string;
  description: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  projects: Project[] = [
    { name: 'Personal Garden', description: 'Mi jardín digital de notas e ideas.' },
    { name: 'Blog', description: 'Artículos sobre desarrollo y aprendizaje.' },
    { name: 'Experimentos', description: 'Pequeñas pruebas de concepto y prototipos.' },
  ];
}
