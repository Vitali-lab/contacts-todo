import type { Group } from "../types";
import { showToast } from "./showToast";

export const validationGroups = (
  groupsArray: Group[],
  groupsInput: HTMLInputElement,
  toastText: HTMLElement,
  toast: HTMLElement,
): boolean => {
  let validated: boolean = false;
  groupsArray.forEach((group: Group) => {
    if (group.name === groupsInput.value) {
      showToast(toast, toastText, "Группа с таким именем уже существует");
      validated = true;
    }
  });
  return validated;
};
