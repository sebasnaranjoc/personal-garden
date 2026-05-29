import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio · Personal Garden' },
  { path: 'proyectos', component: ProjectsComponent, title: 'Proyectos · Personal Garden' },
  { path: 'contacto', component: ContactComponent, title: 'Contacto · Personal Garden' },
  { path: '**', redirectTo: '' },
];
