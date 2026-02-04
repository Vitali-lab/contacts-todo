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

    if (localStorage.getItem("contacts")) {
      const contactsArray = contactsService.getAll();

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

      contactsService.add({
        id: Date.now().toString(),
        name: contactInputName.value,
        phone: contactInputNumber.value,
        groupId: selectedGroupId,
      });
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
};
