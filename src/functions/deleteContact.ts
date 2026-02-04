import type { Contact } from "../types";
import { showLoader } from "./showLoader";
import { showToast } from "./showToast";

export const deleteContact = (
  deleteContact: HTMLButtonElement,
  toast: HTMLElement,
  toastText: HTMLElement,
  loader: HTMLElement,
  renderApp: () => void,
): void => {
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
};
