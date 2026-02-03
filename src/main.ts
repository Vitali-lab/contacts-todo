import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
 <h1>contacts-todo</h1>
    
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
