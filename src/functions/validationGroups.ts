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
    if (groupsInput.value === "") {
      showToast(toast, toastText, "Введите название группы");
      validated = true;
    }
  });
  return validated;
};
