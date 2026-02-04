import type { StorageService } from "../services/StorageServise";
import type { Contact, Group } from "../types";
import { showLoader } from "./showLoader";
import { showToast } from "./showToast";

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
): void => {
  if (!(target instanceof Element)) return;

  const deleteBtn = target.closest<HTMLButtonElement>(".groups__button_delete");
  if (deleteBtn) {
    const groupId = deleteBtn.dataset.groupId;
    if (!groupId) return;

    poap.dataset.groupId = groupId;
    poap.style.display = "block";
    setTimeout(() => {
      poap.style.opacity = "1";
    }, 100);

    mask.style.display = "block";
    groups.style.transform = "translateX(-100%)";
    return;
  }

  const poapCancel = target.closest<HTMLButtonElement>(".poap__button_cancel");
  if (poapCancel) {
    poap.style.opacity = "0";
    setTimeout(() => {
      poap.style.display = "none";
      mask.style.display = "none";
    }, 100);
    return;
  }

  const poapConfirm = target.closest<HTMLButtonElement>(
    ".poap__button_confirm",
  );
  if (poapConfirm) {
    const groupId = poap.dataset.groupId;
    if (!groupId) return;

    const groupsArray = groupsStorage.get();
    const contactsArray = contactsStorage.get();

    const updatedGroups = groupsArray.filter((group) => group.id !== groupId);
    const updatedContacts = contactsArray.filter(
      (contact) => contact.groupId !== groupId,
    );

    groupsStorage.set(updatedGroups);
    contactsStorage.set(updatedContacts);

    poap.style.opacity = "0";
    setTimeout(() => {
      poap.style.display = "none";
      mask.style.display = "none";
    }, 100);

    showToast(toast, toastText, "Группа успешно удалена");
    showLoader(loader, true);
    setTimeout(() => {
      showLoader(loader, false);
      renderApp();
    }, 2000);
  }
};
