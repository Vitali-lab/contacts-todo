import type { StorageService } from "../services/StorageServise";
import type { Group } from "../types";
import { showLoader } from "./showLoader";
import { showToast } from "./showToast";
import { validationGroups } from "./validationGroups";

export const addGroup = (
  target: EventTarget,
  toast: HTMLElement,
  toastText: HTMLElement,
  loader: HTMLElement,
  groupsStorage: StorageService<Group>,
  renderApp: () => void,
): void => {
  if (!(target instanceof Element)) return;

  if (target.id === "add-group") {
    const groupsInput =
      document.querySelector<HTMLInputElement>("#group-name")!;

    const groupsArray = groupsStorage.get();

    if (validationGroups(groupsArray, groupsInput, toastText, toast)) {
      groupsInput.value = "";
      return;
    }

    groupsArray.push({
      id: Date.now().toString(),
      name: groupsInput.value,
    });
    groupsStorage.set(groupsArray);
    groupsInput.value = "";

    showLoader(loader, true);
    showToast(toast, toastText, "Группа успешно добавлена");
    setTimeout(() => {
      showLoader(loader, false);
      renderApp();
    }, 2000);
  }
};
