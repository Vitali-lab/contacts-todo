import type { ContactsService } from "../services/ContactsService";
import { showLoader } from "./showLoader";
import { showToast } from "./showToast";
import { validationContacts } from "./validationContacts";

export const addContacts = (
  target: EventTarget,
  toast: HTMLElement,
  toastText: HTMLElement,
  selectedGroupId: string | null,
  loader: HTMLElement,
  renderApp: () => void,
  contactsService: ContactsService,
): void => {
  if (!(target instanceof Element)) return;

  if (target.id === "add-new-contact") {
    const contactInputName =
      document.querySelector<HTMLInputElement>("#contact-name")!;
    const contactInputNumber =
      document.querySelector<HTMLInputElement>("#contact-number")!;

    if (!contactInputName.value) {
      contactInputName.style.border = "1px solid red";
      showToast(toast, toastText, "Введите имя");
      return;
    } else if (!contactInputNumber.value) {
      contactInputNumber.style.border = "1px solid red";
      showToast(toast, toastText, "Введите номер");
      return;
    }

    const contactsArray = contactsService.getAll();

    if (
      validationContacts(
        contactsArray,
        contactInputName,
        contactInputNumber,
        toastText,
        toast,
        selectedGroupId,
      )
    )
      return;

    contactsService.add({
      id: Date.now().toString(),
      name: contactInputName.value,
      phone: contactInputNumber.value,
      groupId: selectedGroupId,
    });

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
};
