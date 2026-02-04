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
import { renderLoader } from "./components/loader.ts";
import { showLoader } from "./functions/showLoader.ts";
import { renderEditingContacts } from "./components/editingContacts.ts";
import IMask from "imask";

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
  ${renderLoader()}
  ${renderEditingContacts()}
  `;
}
if (!localStorage.getItem("contacts")) {
  localStorage.setItem("contacts", JSON.stringify([]));
}
if (!localStorage.getItem("groups")) {
  localStorage.setItem("groups", JSON.stringify([]));
}
const app = document.querySelector("#app")!;
function initMasks() {
  const inputs = ["#contact-number", "#edit-contact-number"];

  inputs.forEach((selector) => {
    const input = document.querySelector<HTMLInputElement>(selector);
    if (input && !(input as any)._imask) {
      IMask(input, { mask: "+{7} (000) 000-00-00" });
    }
  });
}
renderApp();
initMasks();

let elementId: string | null = null;
let editingContactId: string | null = null;
let selectedGroupId: string | null = null;

app.addEventListener("click", (e) => {
  const leftMenu = document.querySelector<HTMLDivElement>(".left-menu-add")!;
  const groups = document.querySelector<HTMLDivElement>(".groups")!;
  const mask = document.querySelector<HTMLDivElement>(".mask")!;
  const toast = document.querySelector<HTMLDivElement>(".toast")!;
  const toastText = document.querySelector<HTMLDivElement>(".toast__text")!;
  const poap = document.querySelector<HTMLDivElement>(".poap")!;
  const loader = document.querySelector<HTMLDivElement>(".loader__container")!;
  const editContactButtonSave = document.querySelector<HTMLButtonElement>(
    ".editing-contacts__button_save",
  );
  const editContactButtonCancel = document.querySelector<HTMLButtonElement>(
    ".editing-contacts__button_cancel",
  );
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
    showLoader(loader, true);
    poap.style.display = "none";
    setTimeout(() => {
      mask.style.display = "none";
      renderApp();
      showLoader(loader, false);
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
    console.log(loader, "load");

    showLoader(loader, true);
    showToast(toast, toastText, "Группа успешно добавлена");
    setTimeout(() => {
      showLoader(loader, false);
      renderApp();
    }, 2000);
  }

  // добавление контакта

  if (target.id === "add-new-contact") {
    const contactInputName =
      document.querySelector<HTMLInputElement>("#contact-name")!;
    const contactInputNumber =
      document.querySelector<HTMLInputElement>("#contact-number")!;

    console.log(selectedGroupId, "selectedGroupId");

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
        groupId: selectedGroupId,
      });

      localStorage.setItem("contacts", JSON.stringify(contactsArray));
    }
    contactInputName.value = "";
    contactInputNumber.value = "";
    selectedGroupId = null;
    showLoader(loader, true);
    showToast(toast, toastText, "Контакт успешно добавлен");
    setTimeout(() => {
      showLoader(loader, false);
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
    showLoader(loader, true);
    showToast(toast, toastText, "Контакт успешно удален");
    setTimeout(() => {
      showLoader(loader, false);
      renderApp();
    }, 2000);
  }

  const editContact = target.closest<HTMLButtonElement>(".edit-contact-button");
  if (editContact) {
    const editingContacts =
      document.querySelector<HTMLDivElement>(".editing-contacts");
    if (!editingContacts) return;

    const contactItem = editContact.closest<HTMLDivElement>(".contact-list");
    if (!contactItem) return;

    editingContactId = contactItem.dataset.id ?? null;
    if (!editingContactId) return;

    const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    const contact = contacts.find((c: Contact) => c.id === editingContactId);
    if (!contact) return;

    const nameInput =
      document.querySelector<HTMLInputElement>("#edit-contact-name");
    const phoneInput = document.querySelector<HTMLInputElement>(
      "#edit-contact-number",
    );

    if (nameInput && phoneInput) {
      nameInput.value = contact.name;
      phoneInput.value = contact.phone;
    }

    editingContacts.style.display = "flex";
    mask.style.display = "block";

    initMasks();

    editContactButtonCancel?.addEventListener("click", () => {
      editingContactId = null;
      document.querySelector(".editing-contacts")!.style.display = "none";
      mask.style.display = "none";
    });

    editContactButtonSave?.addEventListener("click", () => {
      if (!editingContactId) return;

      const nameInput =
        document.querySelector<HTMLInputElement>("#edit-contact-name");
      const phoneInput = document.querySelector<HTMLInputElement>(
        "#edit-contact-number",
      );

      if (!nameInput || !phoneInput) return;

      const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
      console.log(nameInput.value, phoneInput.value);
      const updatedContacts = contacts.map((contact: Contact) => {
        if (contact.id === editingContactId) {
          return {
            ...contact,
            name: nameInput.value,
            phone: phoneInput.value,
          };
        } else {
          return contact;
        }
      });

      localStorage.setItem("contacts", JSON.stringify(updatedContacts));

      editingContactId = null;
      showLoader(loader, true);
      showToast(toast, toastText, "Контакт успешно изменен");
      document.querySelector(".editing-contacts")!.style.display = "none";
      mask.style.display = "none";
      setTimeout(() => {
        showLoader(loader, false);
        renderApp();
      }, 2000);
    });
  }

  const leftMenuButtonArrow = target.closest<HTMLButtonElement>(
    ".left-menu-add__button_arrow",
  );
  if (leftMenuButtonArrow) {
    const customSelect = document.querySelector<HTMLDivElement>(
      ".left-menu-add__options",
    );

    if (!customSelect) return;
    console.log(customSelect, "customSelect");

    customSelect.style.opacity = customSelect.style.opacity === "1" ? "0" : "1";
    leftMenuButtonArrow.classList.toggle("active");
  }
  if (target.classList.contains("left-menu-add__option")) {
    const customSelect = target.closest<HTMLDivElement>(
      ".left-menu-add__custom-select",
    );
    if (!customSelect) return;

    const selectTitle = customSelect.querySelector<HTMLParagraphElement>(
      ".left-menu-add__select p",
    )!;
    const optionsContainer = customSelect.querySelector<HTMLDivElement>(
      ".left-menu-add__options",
    )!;

    selectTitle.textContent = target.textContent;
    selectedGroupId = target.dataset.id ?? null;
    optionsContainer.style.opacity = "0";
  }
});
