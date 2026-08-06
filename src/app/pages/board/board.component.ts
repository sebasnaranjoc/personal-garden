import { Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BoardStore } from '../../core/board.store';
import { Entry, EntriesStore } from '../../core/entries.store';

/** Ancho de una tarjeta sobre el tablero. También lo usa el fantasma del arrastre. */
const CARD_WIDTH = 200;
/** Alto estimado para acotar el drop de entradas que aún no se han renderizado. */
const CARD_HEIGHT = 160;
/** Píxeles de movimiento antes de considerar que esto es un arrastre y no un clic. */
const DRAG_THRESHOLD = 4;

/**
 * Lienzo de referencia del handoff. Las estrellas vienen en píxeles absolutos
 * para ese tamaño; se convierten a porcentaje para que la constelación
 * mantenga su forma en cualquier pantalla.
 */
const SPARKLE_REFERENCE = { width: 1200, height: 720 };

/** Posiciones de las estrellas decorativas, tal cual las fija el handoff. */
const SPARKLE_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [70, 160],
  [350, 120],
  [690, 150],
  [1060, 300],
  [240, 620],
  [610, 660],
  [930, 600],
  [420, 410],
  [1090, 90],
];

interface Sparkle {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

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
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  private readonly store = inject(EntriesStore);
  private readonly board = inject(BoardStore);

  readonly tray = this.store.tray;
  readonly placed = this.store.placed;
  readonly background = this.board.background;
  readonly theme = this.board.theme;

  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLElement>;
  @ViewChild('surface', { static: true }) private surface!: ElementRef<HTMLElement>;
  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  readonly drag = signal<DragState | null>(null);
  readonly overCanvas = signal(false);
  readonly cardWidth = CARD_WIDTH;

  readonly sparkles: readonly Sparkle[] = SPARKLE_POSITIONS.map(([left, top], i) => ({
    left: (left / SPARKLE_REFERENCE.width) * 100,
    top: (top / SPARKLE_REFERENCE.height) * 100,
    size: 14 + (i % 3) * 7,
    duration: 2.2 + (i % 4) * 0.6,
    delay: i * 0.25,
  }));

  // --- formulario de creación -------------------------------------------

  readonly imagePreview = signal<string | null>(null);
  readonly imageName = signal<string | null>(null);
  title = '';
  description = '';

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
    this.imageName.set(file.name);
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
    this.imageName.set(null);
    this.clearFileInput();
  }

  /** Botón "cancelar": vacía el formulario sin crear nada. */
  cancel(): void {
    const preview = this.imagePreview();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    this.imagePreview.set(null);
    this.imageName.set(null);
    this.title = '';
    this.description = '';
    this.clearFileInput();
  }

  private clearFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // --- fondo del tablero -------------------------------------------------

  onBackgroundFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.board.setBackground(URL.createObjectURL(file));
    // Sin esto, volver a elegir el mismo archivo no dispara el change.
    input.value = '';
  }

  clearBackground(): void {
    this.board.clearBackground();
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
    if (!state?.moved) {
      return;
    }

    if (this.isOverCanvas(event.clientX, event.clientY)) {
      const surface = this.surface.nativeElement.getBoundingClientRect();
      const x = event.clientX - state.offsetX - surface.left;
      const y = event.clientY - state.offsetY - surface.top;
      // Se guarda como fracción del lienzo, acotada para que la tarjeta entera
      // quede dentro incluso apurando el borde.
      this.store.place(
        state.entry.id,
        clamp(x / surface.width, 0, (surface.width - CARD_WIDTH) / surface.width),
        clamp(y / surface.height, 0, (surface.height - state.height) / surface.height)
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

  /**
   * Las fracciones sobreviven al resize, pero una tarjeta pegada al borde
   * derecho o inferior se saldría al encoger la ventana: aquí se reajusta con
   * el alto real de cada tarjeta ya renderizada.
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    const surface = this.surface.nativeElement;
    const { width, height } = surface.getBoundingClientRect();
    if (!width || !height) {
      return;
    }
    const cards = surface.querySelectorAll<HTMLElement>('.card');
    const maxX = (width - CARD_WIDTH) / width;

    this.placed().forEach((entry, index) => {
      const cardHeight = cards[index]?.offsetHeight ?? CARD_HEIGHT;
      const x = clamp(entry.x, 0, maxX);
      const y = clamp(entry.y, 0, (height - cardHeight) / height);
      if (x !== entry.x || y !== entry.y) {
        this.store.place(entry.id, x, y);
      }
    });
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
