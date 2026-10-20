import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
})
export class RainbowDirective {
  @HostBinding('style.color') color: string = '';
  @HostBinding('style.borderColor') borderColor: string = '';

  @HostListener('keyup') onKeyUp(): void {
    const randomColor = this.getRandomColor();
    this.color = randomColor;
    this.borderColor = randomColor;
  }

  private getRandomColor(): string {
    const hexChars = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += hexChars[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
