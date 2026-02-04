import "./styles/main.scss";
import { renderHeader } from "./components/header.ts";
import { renderContacts } from "./components/contacts.ts";
import { renderLeftMenu } from "./components/leftMenu.ts";
import { renderMask } from "./components/mask.ts";
import { renderGroups } from "./components/groups.ts";
import type { Contact, Group } from "./types/index.ts";
import { renderToast } from "./components/toast.ts";
import { renderPoap } from "./components/poap.ts";
import { showToast } from "./functions/showToast.ts";
import { renderLoader } from "./components/loader.ts";
import { showLoader } from "./functions/showLoader.ts";
import { renderEditingContacts } from "./components/editingContacts.ts";
import { StorageService } from "./services/StorageServise.ts";
import IMask from "imask";
import { deleteGroups } from "./functions/deleteGroups.ts";
import { addGroup } from "./functions/addGroup.ts";
import { addContacts } from "./functions/addContacts.ts";
import { deleteContact } from "./functions/deleteContact.ts";
import { ContactsService } from "./services/ContactsService";

const contactsService = new ContactsService();
const contactsStorage = new StorageService<Contact>("contacts");
const groupsStorage = new StorageService<Group>("groups");

function renderApp() {
  const contactsData: Contact[] = contactsService.getAll();
  const groupsData: Group[] = groupsStorage.get();

  app.innerHTML = `
  ${renderMask()}
  ${renderHeader()}
  ${renderContacts(contactsData, groupsData)}
  ${renderLeftMenu(groupsData)}
  ${renderGroups(groupsData)}
  ${renderToast()}
  ${renderPoap()}
  ${renderLoader()}
  ${renderEditingContacts()}
  `;

  initMasks();
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
  const buttonSave = target.closest<HTMLButtonElement>(".groups__button_save");

  if ((buttonGroup && buttonGroup.id === "close-groups") || buttonSave) {
    groups.style.transform = "translateX(-100%)";
    mask.style.display = "none";
  }

  deleteGroups(
    groupsStorage,
    contactsStorage,
    poap,
    mask,
    groups,
    target,
    toast,
    toastText,
    loader,
    renderApp,
  );

  addGroup(target, toast, toastText, loader, groupsStorage, renderApp);

  addContacts(
    target,
    toast,
    toastText,
    selectedGroupId,
    loader,
    renderApp,
    contactsService,
  );

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

    const isOpen = contactsContainer.style.height === "auto";
    contactsContainer.style.height = isOpen ? "0" : "auto";
    contactsContainer.style.opacity = isOpen ? "0" : "1";

    arrowBtn.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";

    groupName.style.color = isOpen ? "#111827" : "#005BFE";
  }

  const deleteContactButton = target.closest<HTMLButtonElement>(
    ".delete-contact-button",
  );
  if (deleteContactButton) {
    deleteContact(
      deleteContactButton,
      toast,
      toastText,
      loader,
      renderApp,
      contactsService,
    );
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

    const contacts = contactsStorage.get();
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
      const editingContacts = document.querySelector(".editing-contacts")!;
      if (editingContacts instanceof HTMLElement) {
        editingContacts.style.display = "none";
      }
      editingContactId = null;
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

      contactsService.update(editingContactId, {
        name: nameInput.value,
        phone: phoneInput.value,
      });

      editingContactId = null;
      showLoader(loader, true);
      showToast(toast, toastText, "Контакт успешно изменен");
      editingContacts.style.display = "none";
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
