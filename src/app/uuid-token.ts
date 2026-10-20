import { InjectionToken } from '@angular/core';

export const UUID = new InjectionToken<() => string>('UUID');