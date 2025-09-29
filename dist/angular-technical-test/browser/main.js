import {
  CommonModule,
  Component,
  RouterOutlet,
  bootstrapApplication,
  provideHttpClient,
  provideRouter,
  provideZoneChangeDetection,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement
} from "./chunk-7DZOZOOR.js";

// src/app/app.routes.ts
var routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },
  {
    path: "home",
    loadComponent: () => import("./chunk-3635SOO5.js").then((m) => m.FileExplorerComponent),
    data: { folderId: null, folderName: "Home" }
  },
  {
    path: "documents",
    loadComponent: () => import("./chunk-3635SOO5.js").then((m) => m.FileExplorerComponent),
    data: { folderId: "documents", folderName: "Documents" }
  },
  {
    path: "projects",
    loadComponent: () => import("./chunk-3635SOO5.js").then((m) => m.FileExplorerComponent),
    data: { folderId: "projects", folderName: "Projects" }
  },
  {
    path: "**",
    loadComponent: () => import("./chunk-3635SOO5.js").then((m) => m.FileExplorerComponent)
  }
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["ic-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [CommonModule, RouterOutlet], styles: ["\n\n[_nghost-%COMP%] {\n  height: 100%;\n  width: 100%;\n  display: block;\n}\n/*# sourceMappingURL=app.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{ selector: "ic-root", imports: [CommonModule, RouterOutlet], template: "<router-outlet></router-outlet>\r\n", styles: ["/* src/app/app.component.scss */\n:host {\n  height: 100%;\n  width: 100%;\n  display: block;\n}\n/*# sourceMappingURL=app.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 11 });
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
