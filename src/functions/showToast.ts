export const showToast = (
  toast: HTMLElement,
  toastText: HTMLElement,
  text: string,
): void => {
  toastText.textContent = text;
  toast.style.transform = "translateX(0)";
  setTimeout(() => {
    toast.style.transform = "translateX(150%)";
  }, 2000);
};
