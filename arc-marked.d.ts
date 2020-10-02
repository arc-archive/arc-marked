import { ArcMarkedElement } from './src/ArcMarkedElement.js';

declare global {
  interface HTMLElementTagNameMap {
    "arc-marked": ArcMarkedElement;
  }
}
