import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'personal-garden';

  private readonly router = inject(Router);

  /**
   * El tablero trae su propio header, marquee y footer según el handoff Y2K,
   * así que ocupa el ancho completo y reemplaza al chrome global.
   */
  readonly isBoard = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/tablero'))
    ),
    { initialValue: this.router.url.startsWith('/tablero') }
  );
}
