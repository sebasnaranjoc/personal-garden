import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Entry, EntriesStore } from '../../core/entries.store';

/** Ancho de una tarjeta sobre el tablero. También lo usa el fantasma del arrastre. */
const CARD_WIDTH = 200;
/** Alto estimado para acotar el drop de entradas que aún no se han renderizado. */
const CARD_HEIGHT = 160;
/** Píxeles de movimiento antes de considerar que esto es un arrastre y no un clic. */
const DRAG_THRESHOLD = 4;

interface DragState {
  entry: Entry;
  /** Distancia del puntero a la esquina superior izquierda de la tarjeta. */
  offsetX: number;
  offsetY: number;
  height: number;
  pointerX: number;
  pointerY: number;
  moved: boolean;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  private readonly store = inject(EntriesStore);

  readonly tray = this.store.tray;
  readonly placed = this.store.placed;

  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLElement>;
  @ViewChild('surface', { static: true }) private surface!: ElementRef<HTMLElement>;
  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  readonly drag = signal<DragState | null>(null);
  readonly overCanvas = signal(false);
  readonly cardWidth = CARD_WIDTH;

  // --- formulario de creación -------------------------------------------

  readonly formOpen = signal(false);
  readonly imagePreview = signal<string | null>(null);
  title = '';
  description = '';

  toggleForm(): void {
    if (this.formOpen()) {
      this.resetForm();
    }
    this.formOpen.update((open) => !open);
  }

  onFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    const previous = this.imagePreview();
    if (previous) {
      URL.revokeObjectURL(previous);
    }
    this.imagePreview.set(URL.createObjectURL(file));
  }

  create(): void {
    const title = this.title.trim();
    if (!title) {
      return;
    }
    // El object URL pasa a ser propiedad del store: aquí ya no se revoca.
    this.store.add(title, this.description.trim(), this.imagePreview());
    this.title = '';
    this.description = '';
    this.imagePreview.set(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.formOpen.set(false);
  }

  private resetForm(): void {
    const preview = this.imagePreview();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    this.imagePreview.set(null);
    this.title = '';
    this.description = '';
  }

  // --- arrastre ----------------------------------------------------------

  /**
   * Mismo handler para la bandeja y para el tablero: la única diferencia es de
   * dónde sale el agarre. Desde la bandeja la tarjeta se toma por el centro
   * superior, porque el chip de la lista no tiene el tamaño de la tarjeta final.
   */
  startDrag(event: PointerEvent, entry: Entry, fromTray: boolean): void {
    if (event.button !== 0) {
      return;
    }
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();

    this.drag.set({
      entry,
      offsetX: fromTray ? CARD_WIDTH / 2 : event.clientX - rect.left,
      offsetY: fromTray ? 24 : event.clientY - rect.top,
      height: fromTray ? CARD_HEIGHT : rect.height,
      pointerX: event.clientX,
      pointerY: event.clientY,
      moved: false,
    });

    if (!fromTray) {
      this.store.bringToFront(entry.id);
    }
    el.setPointerCapture(event.pointerId);
  }

  moveDrag(event: PointerEvent): void {
    const state = this.drag();
    if (!state) {
      return;
    }
    const moved =
      state.moved ||
      Math.abs(event.clientX - state.pointerX) > DRAG_THRESHOLD ||
      Math.abs(event.clientY - state.pointerY) > DRAG_THRESHOLD;

    this.drag.set({ ...state, pointerX: event.clientX, pointerY: event.clientY, moved });
    this.overCanvas.set(this.isOverCanvas(event.clientX, event.clientY));
  }

  endDrag(event: PointerEvent): void {
    const state = this.drag();
    this.drag.set(null);
    this.overCanvas.set(false);
    if (!state || !state.moved) {
      return;
    }

    if (this.isOverCanvas(event.clientX, event.clientY)) {
      // La superficie puede estar desplazada: su rect ya refleja el scroll.
      const surface = this.surface.nativeElement.getBoundingClientRect();
      const x = event.clientX - state.offsetX - surface.left;
      const y = event.clientY - state.offsetY - surface.top;
      this.store.place(
        state.entry.id,
        clamp(x, 0, surface.width - CARD_WIDTH),
        clamp(y, 0, surface.height - state.height)
      );
    } else if (state.entry.x !== null) {
      // Soltada fuera del tablero: vuelve a la bandeja.
      this.store.unplace(state.entry.id);
    }
  }

  cancelDrag(): void {
    this.drag.set(null);
    this.overCanvas.set(false);
  }

  remove(id: string): void {
    this.store.remove(id);
  }

  private isOverCanvas(x: number, y: number): boolean {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}
