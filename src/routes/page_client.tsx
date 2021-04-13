import React from "https://dev.jspm.io/react";
import ReactDOM from "https://dev.jspm.io/react-dom";
import { App } from "../components/App.tsx";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}

// @ts-ignore: No fucking type check
(ReactDOM as any).hydrate(<App {...window.__initialData}/>, document.querySelector("#root"));
