import { Injectable, computed, signal } from '@angular/core';

export interface Entry {
  id: string;
  title: string;
  description: string;
  /** Object URL de la imagen; vive solo mientras dure la sesión. */
  imageUrl: string | null;
  /** Posición en la superficie del tablero. null = sigue en la bandeja. */
  x: number | null;
  y: number | null;
  z: number;
}

let nextId = 0;

@Injectable({ providedIn: 'root' })
export class EntriesStore {
  private readonly entries = signal<Entry[]>([]);

  /** Entradas que aún no se han colocado, en el orden en que se crearon. */
  readonly tray = computed(() => this.entries().filter((e) => e.x === null));

  /** Entradas sobre el tablero, de abajo hacia arriba. */
  readonly placed = computed(() =>
    this.entries()
      .filter((e) => e.x !== null)
      .sort((a, b) => a.z - b.z)
  );

  add(title: string, description: string, imageUrl: string | null): void {
    this.entries.update((list) => [
      ...list,
      { id: `entry-${nextId++}`, title, description, imageUrl, x: null, y: null, z: 0 },
    ]);
  }

  place(id: string, x: number, y: number): void {
    this.entries.update((list) => list.map((e) => (e.id === id ? { ...e, x, y } : e)));
  }

  /** Devuelve una entrada del tablero a la bandeja. */
  unplace(id: string): void {
    this.entries.update((list) =>
      list.map((e) => (e.id === id ? { ...e, x: null, y: null } : e))
    );
  }

  /** Sin esto, al arrastrar una tarjeta se mete por debajo de las demás. */
  bringToFront(id: string): void {
    const top = Math.max(0, ...this.entries().map((e) => e.z));
    this.entries.update((list) => list.map((e) => (e.id === id ? { ...e, z: top + 1 } : e)));
  }

  remove(id: string): void {
    const entry = this.entries().find((e) => e.id === id);
    if (entry?.imageUrl) {
      URL.revokeObjectURL(entry.imageUrl);
    }
    this.entries.update((list) => list.filter((e) => e.id !== id));
  }
}
