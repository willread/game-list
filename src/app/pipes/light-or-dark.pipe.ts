import { Pipe, PipeTransform } from '@angular/core';

// Adapted from https://awik.io/determine-color-bright-dark-using-javascript/

@Pipe({
  name: 'lightOrDark'
})
export class LightOrDarkPipe implements PipeTransform {
  transform(color: string): boolean {
    if (!color) { return undefined; }

    const colorNumber = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
    const r = colorNumber >> 16;
    const g = colorNumber >> 8 & 255;
    const b = colorNumber & 255;

    const hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    return hsp > 127.5;
  }
}
