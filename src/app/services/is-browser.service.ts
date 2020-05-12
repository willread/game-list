import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class IsBrowserService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  public isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
