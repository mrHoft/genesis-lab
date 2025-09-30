// Global configuration for zoneless change detection

import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { provideZonelessChangeDetection } from '@angular/core';

jest.mock('zone.js', () => {
  const mockZone = {
    current: {
      get: (key: string) => undefined,
      run: (fn: Function, applyThis?: any, applyArgs?: any[]) => fn.apply(applyThis, applyArgs),
      runGuarded: (fn: Function, applyThis?: any, applyArgs?: any[]) => fn.apply(applyThis, applyArgs),
      runTask: (fn: Function, applyThis?: any, applyArgs?: any[]) => fn.apply(applyThis, applyArgs),
      fork: (spec: any) => mockZone.current
    },
    root: {
      run: (fn: Function) => fn()
    }
  };
  return mockZone;
});

jest.mock('zone.js/testing', () => {
  return {
    __zone_symbol__fakeAsyncPatch: true,
    async: (fn: Function) => async () => fn(),
    fakeAsync: (fn: Function) => fn,
    flush: () => { },
    tick: (ms: number = 0) => { },
    flushMicrotasks: () => { },
    discardPeriodicTasks: () => { }
  };
});

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: false }
  }
);

beforeEach(() => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection()
    ]
  });
});
