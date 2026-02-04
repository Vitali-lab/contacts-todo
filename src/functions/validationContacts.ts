import type { Contact } from "../types";
import { showToast } from "./showToast";

export const validationContacts = (
  contactsArray: Contact[],
  contactInputName: HTMLInputElement,
  contactInputNumber: HTMLInputElement,
  toastText: HTMLElement,
  toast: HTMLElement,
): boolean => {
  let validated: boolean = false;
  contactsArray.forEach((contact: Contact) => {
    if (contact.name === contactInputName.value) {
      showToast(toast, toastText, "Контакт с таким именем уже существует");
      validated = true;
    } else if (contact.phone === contactInputNumber.value) {
      showToast(toast, toastText, "Контакт с таким номером уже существует");
      validated = true;
    }
  });

  return validated;
};
