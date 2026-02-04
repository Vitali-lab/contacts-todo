export const showToast = (
  toast: HTMLElement,
  toastText: HTMLElement,
  text: string,
): void => {
  toastText.textContent = text;
  toast.style.display = "flex";
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    toast.style.transform = "translateX(150%)";
  }, 1500);
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
};
