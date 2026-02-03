import "./styles/main.scss";
import { renderHeader } from "./components/header.ts";
import { renderContacts } from "./components/contacts.ts";
import { renderLeftMenu } from "./components/leftMenu.ts";
import { renderMask } from "./components/mask.ts";
import { renderGroups } from "./components/groups.ts";
import type { Contact, Group } from "./types/index.ts";
import { renderToast } from "./components/toast.ts";

function renderApp() {
  const contactsData: Contact[] = JSON.parse(
    localStorage.getItem("contacts") || "[]",
  );
  const groupsData: Group[] = JSON.parse(
    localStorage.getItem("groups") || "[]",
  );

  app.innerHTML = `
  ${renderMask()}
  ${renderHeader()}
  ${renderContacts(contactsData, groupsData)}
  ${renderLeftMenu(contactsData, groupsData)}
  ${renderGroups(groupsData)}
  ${renderToast()}
  `;
}
if (!localStorage.getItem("contacts")) {
  localStorage.setItem("contacts", JSON.stringify([]));
}
if (!localStorage.getItem("groups")) {
  localStorage.setItem("groups", JSON.stringify([]));
}
const app = document.querySelector("#app")!;
renderApp();

app.addEventListener("click", (e) => {
  //открытие и закрытие левого меню
  const leftMenu = document.querySelector<HTMLDivElement>(".left-menu-add")!;
  const groups = document.querySelector<HTMLDivElement>(".groups")!;
  const mask = document.querySelector<HTMLDivElement>(".mask")!;
  const toast = document.querySelector<HTMLDivElement>(".toast")!;
  const toastText = document.querySelector<HTMLDivElement>(".toast__text")!;

  const target = e.target as HTMLButtonElement;

  if (!leftMenu || !mask || !groups) return;

  if (target.id === "add-contact") {
    leftMenu.style.transform = "translateX(0)";
    mask.style.display = "block";
  }

  if (target.id === "group") {
    groups.style.transform = "translateX(0)";
    mask.style.display = "block";
  }

  const buttonAdd = target.closest<HTMLButtonElement>(".left-menu-add__button");

  if (buttonAdd && buttonAdd.id === "close-menu") {
    leftMenu.style.transform = "translateX(-100%)";
    mask.style.display = "none";
  }

  const buttonGroup = target.closest<HTMLButtonElement>(
    ".groups__button_close",
  );

  if (buttonGroup && buttonGroup.id === "close-groups") {
    groups.style.transform = "translateX(-100%)";
    mask.style.display = "none";
  }

  //удаление групп

  const deleteBtn = target.closest<HTMLButtonElement>(".groups__button_delete");
  if (deleteBtn) {
    if (localStorage.getItem("groups")) {
      const groupsArray = JSON.parse(localStorage.getItem("groups")!);

      if (!deleteBtn) return;

      const groupId = deleteBtn.dataset.groupId;

      if (!groupId) return;

      const updatedGroups = groupsArray.filter(
        (group: Group) => group.id !== groupId,
      );

      localStorage.setItem("groups", JSON.stringify(updatedGroups));
      toastText.textContent = "Группа успешно удалена";
      toast.style.transform = "translateX(0)";
      setTimeout(() => {
        toast.style.transform = "translateX(150%)";
        renderApp();
      }, 2000);
    }
  }

  //добавление групп
  if (target.id === "add-group") {
    const groupsInput =
      document.querySelector<HTMLInputElement>("#group-name")!;

    if (localStorage.getItem("groups")) {
      const groupsArray = JSON.parse(localStorage.getItem("groups")!);
      groupsArray.push({
        id: Date.now().toString(),
        name: groupsInput.value,
      });
      localStorage.setItem("groups", JSON.stringify(groupsArray));
    }
    groupsInput.value = "";
    toastText.textContent = "Группа успешно добавлена";
    toast.style.transform = "translateX(0)";
    setTimeout(() => {
      toast.style.transform = "translateX(150%)";
      renderApp();
    }, 2000);
  }

  // добавление контакта

  if (target.id === "add-new-contact") {
    const contactInputName =
      document.querySelector<HTMLInputElement>("#contact-name")!;
    const contactInputNumber =
      document.querySelector<HTMLInputElement>("#contact-number")!;
    const groupsSelect =
      document.querySelector<HTMLSelectElement>("#contact-group")!;

    if (!contactInputName.value) {
      contactInputName.style.border = "1px solid red";
      toastText.textContent = "Введите имя";
      toast.style.transform = "translateX(0)";
      setTimeout(() => {
        toast.style.transform = "translateX(150%)";
      }, 2000);
      return;
    } else if (!contactInputNumber.value) {
      contactInputNumber.style.border = "1px solid red";
      toastText.textContent = "Введите номер";
      toast.style.transform = "translateX(0)";
      setTimeout(() => {
        toast.style.transform = "translateX(150%)";
      }, 2000);
      return;
    }

    const contacts = localStorage.getItem("contacts");
    if (contacts) {
      const contactsArray = JSON.parse(contacts);
      contactsArray.push({
        id: Date.now().toString(),
        name: contactInputName.value,
        phone: contactInputNumber.value,
        groupId: groupsSelect.value,
      });

      localStorage.setItem("contacts", JSON.stringify(contactsArray));
    }
    contactInputName.value = "";
    contactInputNumber.value = "";
    groupsSelect.value = "";

    toastText.textContent = "Контакт успешно добавлен";
    toast.style.transform = "translateX(0)";
    setTimeout(() => {
      toast.style.transform = "translateX(150%)";
      renderApp();
    }, 2000);
  }

  const arrowBtn = target.closest<HTMLButtonElement>(".arrow-button");
  if (!arrowBtn) return;

  const groupContainer = arrowBtn.closest<HTMLDivElement>(".group-list");
  if (!groupContainer) return;

  const groupName =
    groupContainer.querySelector<HTMLDivElement>(".group__name");
  if (!groupName) return;

  const contactsContainer =
    groupContainer.querySelector<HTMLDivElement>(".contacts");
  if (!contactsContainer) return;

  const isOpen = contactsContainer.style.display === "block";
  contactsContainer.style.display = isOpen ? "none" : "block";

  arrowBtn.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";

  groupName.style.color = isOpen ? "#111827" : "#005BFE";
});
