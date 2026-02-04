import type { StorageService } from "../services/StorageServise";
import type { Contact, Group } from "../types";
import { showLoader } from "./showLoader";
import { showToast } from "./showToast";

let elementId: string | null = null;

export const deleteGroups = (
  groupsStorage: StorageService<Group>,
  contactsStorage: StorageService<Contact>,
  poap: HTMLElement,
  mask: HTMLElement,
  groups: HTMLElement,
  target: EventTarget,
  toast: HTMLElement,
  toastText: HTMLElement,
  loader: HTMLElement,
  renderApp: () => void,
): void | string => {
  if (!(target instanceof HTMLElement)) return;
  const deleteBtn = target.closest<HTMLButtonElement>(".groups__button_delete");
  if (deleteBtn) {
    elementId = deleteBtn.dataset.groupId!;
    poap.style.display = "block";
    setTimeout(() => {
      poap.style.opacity = "1";
    }, 100);

    mask.style.display = "block";
    groups.style.transform = "translateX(-100%)";

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
    const groupsArray = groupsStorage.get();
    const contactsArray = contactsStorage.get();
    const updatedGroups = groupsArray.filter(
      (group: Group) => group.id !== elementId,
    );
    const updatedContacts = contactsArray.filter(
      (contact: Contact) => contact.groupId !== elementId,
    );

    contactsStorage.set(updatedContacts);
    groupsStorage.set(updatedGroups);
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
};
