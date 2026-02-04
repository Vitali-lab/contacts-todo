export const showLoader = (loader: HTMLElement, isShow: boolean): void => {
  isShow ? (loader.style.display = "block") : (loader.style.display = "none");
};
