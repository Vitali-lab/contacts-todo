import type { ContactsService } from "../services/ContactsService";
import { showLoader } from "./showLoader";
import { showToast } from "./showToast";

export const deleteContact = (
  deleteContact: HTMLButtonElement,
  toast: HTMLElement,
  toastText: HTMLElement,
  loader: HTMLElement,
  renderApp: () => void,
  contactsService: ContactsService,
): void => {
  const contactId =
    deleteContact.closest<HTMLDivElement>(".contact-list")!.dataset.id;
  const contacts = localStorage.getItem("contacts");
  if (contacts) {
    contactsService.remove(contactId!);
  }
  showLoader(loader, true);
  showToast(toast, toastText, "Контакт успешно удален");
  setTimeout(() => {
    showLoader(loader, false);
    renderApp();
  }, 2000);
};
