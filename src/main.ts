import "./styles/main.scss";
import { renderHeader } from "./components/header.ts";
import { renderContacts } from "./components/contacts.ts";
import { renderLeftMenu } from "./components/leftMenu.ts";
import { renderMask } from "./components/mask.ts";
import { renderGroups } from "./components/groups.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
${renderMask()}
${renderHeader()}
${renderContacts()}
${renderLeftMenu()}
${renderGroups()}

`;

if (!localStorage.getItem("contacts")) {
  localStorage.setItem("contacts", JSON.stringify([]));
}
if (!localStorage.getItem("groups")) {
  localStorage.setItem("groups", JSON.stringify([]));
}

// if(localStorage.getItem("contacts")) {
//   const contacts = JSON.parse(localStorage.getItem("contacts")!);
//   const contactsList = document.querySelector<HTMLDivElement>(".main__container")!;
//   contacts.forEach((contact: { name: string; phone: string; group: string }) => {
//     contactsList.innerHTML += `
//       <div class="contact"></div>
//         <div class="contact__name">${contact.name}</div>
// }

const app = document.querySelector<HTMLDivElement>("#app")!;
const leftMenu = document.querySelector<HTMLDivElement>(".left-menu-add")!;
const mask = document.querySelector<HTMLDivElement>(".mask")!;
const groups = document.querySelector<HTMLDivElement>(".groups")!;
const groupsInput = document.querySelector<HTMLInputElement>("#group-name")!;

app.addEventListener("click", (e) => {
  const target = e.target as HTMLButtonElement;
  if (target.id === "add-contact") {
    leftMenu.style.transform = "translateX(0)";
    mask.style.display = "block";
  }

  if (target.id === "group") {
    groups.style.transform = "translateX(0)";
    mask.style.display = "block";
  }
});
document.getElementById("close-menu")?.addEventListener("click", () => {
  leftMenu.style.transform = "translateX(-100%)";
  mask.style.display = "none";
});

document.getElementById("close-groups")?.addEventListener("click", () => {
  groups.style.transform = "translateX(-100%)";
  mask.style.display = "none";
});

document.getElementById("add-group")?.addEventListener("click", () => {
  const groups = localStorage.getItem("groups");
  if (groups) {
    const groupsArray = JSON.parse(groups);
    groupsArray.push(groupsInput.value);
    localStorage.setItem("groups", JSON.stringify(groupsArray));
  }
  groupsInput.value = "";
});
