import { Injectable, signal } from '@angular/core';

/** Los tres lavados de color del lienzo definidos en el handoff. */
export type BoardTheme = 'cielo' | 'menta' | 'laguna';

/** Estado del lienzo en sí, separado de las entradas que viven encima. */
@Injectable({ providedIn: 'root' })
export class BoardStore {
  private readonly _background = signal<string | null>(null);
  private readonly _theme = signal<BoardTheme>('cielo');

  readonly background = this._background.asReadonly();
  readonly theme = this._theme.asReadonly();

  setTheme(theme: BoardTheme): void {
    this._theme.set(theme);
  }

  setBackground(url: string): void {
    this.revoke();
    this._background.set(url);
  }

  clearBackground(): void {
    this.revoke();
    this._background.set(null);
  }

  private revoke(): void {
    const current = this._background();
    if (current) {
      URL.revokeObjectURL(current);
    }
  }
}
