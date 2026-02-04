import "./styles/main.scss";
import { renderHeader } from "./components/header.ts";
import { renderContacts } from "./components/contacts.ts";
import { renderLeftMenu } from "./components/leftMenu.ts";
import { renderMask } from "./components/mask.ts";
import { renderGroups } from "./components/groups.ts";
import type { Contact, Group } from "./types/index.ts";
import { renderToast } from "./components/toast.ts";
import { renderPoap } from "./components/poap.ts";
import { validationContacts } from "./functions/validationContacts.ts";
import { validationGroups } from "./functions/validationGroups.ts";
import { showToast } from "./functions/showToast.ts";

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
  ${renderPoap()}
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

let elementId: string | null = null;

app.addEventListener("click", (e) => {
  //открытие и закрытие левого меню
  const leftMenu = document.querySelector<HTMLDivElement>(".left-menu-add")!;
  const groups = document.querySelector<HTMLDivElement>(".groups")!;
  const mask = document.querySelector<HTMLDivElement>(".mask")!;
  const toast = document.querySelector<HTMLDivElement>(".toast")!;
  const toastText = document.querySelector<HTMLDivElement>(".toast__text")!;
  const poap = document.querySelector<HTMLDivElement>(".poap")!;
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
    elementId = deleteBtn.dataset.groupId!;
    poap.style.display = "block";
    setTimeout(() => {
      poap.style.opacity = "1";
    }, 100);

    mask.style.display = "block";
    groups.style.transform = "translateX(-100%)";
    console.log(elementId);
    return;
  }
  console.log(elementId);

  const poapConfirm = target.closest<HTMLButtonElement>(
    ".poap__button_confirm",
  );
  const poapCancel = target.closest<HTMLButtonElement>(".poap__button_cancel");

  if (poapCancel) {
    poap.style.opacity = "0";
    setTimeout(() => {
      poap.style.display = "none";
      mask.style.display = "none";
    }, 100);
    return;
  }

  if (poapConfirm && elementId) {
    const groupsArray = JSON.parse(localStorage.getItem("groups") || "[]");
    const contactsArray = JSON.parse(localStorage.getItem("contacts") || "[]");
    const updatedGroups = groupsArray.filter(
      (group: Group) => group.id !== elementId,
    );
    const updatedContacts = contactsArray.filter(
      (contact: Contact) => contact.groupId !== elementId,
    );
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    localStorage.setItem("groups", JSON.stringify(updatedGroups));

    elementId = null;

    showToast(toast, toastText, "Группа успешно удалена");

    setTimeout(() => {
      poap.style.display = "none";
      mask.style.display = "none";
      renderApp();
    }, 2000);
  }
  //добавление групп
  if (target.id === "add-group") {
    const groupsInput =
      document.querySelector<HTMLInputElement>("#group-name")!;

    if (localStorage.getItem("groups")) {
      const groupsArray = JSON.parse(localStorage.getItem("groups")!);

      if (validationGroups(groupsArray, groupsInput, toastText, toast)) {
        groupsInput.value = "";
        return;
      }

      groupsArray.push({
        id: Date.now().toString(),
        name: groupsInput.value,
      });
      localStorage.setItem("groups", JSON.stringify(groupsArray));
    }
    groupsInput.value = "";
    showToast(toast, toastText, "Группа успешно добавлена");
    setTimeout(() => {
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

      if (
        validationContacts(
          contactsArray,
          contactInputName,
          contactInputNumber,
          toastText,
          toast,
        )
      )
        return;

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

    showToast(toast, toastText, "Контакт успешно добавлен");
    setTimeout(() => {
      renderApp();
    }, 2000);
  }
  //открытие и закрытие контактов
  const arrowBtn = target.closest<HTMLButtonElement>(".arrow-button");
  if (arrowBtn) {
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
  }

  const deleteContact = target.closest<HTMLButtonElement>(
    ".delete-contact-button",
  );
  if (deleteContact) {
    const contactId =
      deleteContact.closest<HTMLDivElement>(".contact-list")!.dataset.id;
    const contacts = localStorage.getItem("contacts");
    if (contacts) {
      const contactsArray = JSON.parse(contacts);
      const updatedContacts = contactsArray.filter(
        (contact: Contact) => contact.id !== contactId,
      );
      localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    }
    showToast(toast, toastText, "Контакт успешно удален");
    setTimeout(() => {
      renderApp();
    }, 2000);
  }
});
