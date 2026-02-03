import confirmIcon from "../icons/confirm-icon.svg";

function renderToast(): string {
  return `
        <section class="toast">
        <img src="${confirmIcon}">
        <p class="toast__text">Контакт успешно добавлен</p>
        </section>
    `;
}

export { renderToast };
