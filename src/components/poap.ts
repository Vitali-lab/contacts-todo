function renderPoap(): string {
  return `
        <section class="poap">
         <div class="poap__container">
         <div class="poap__main__text">
         <h3>Удалить группу?</h3>
         </div>
         <div class="poap__description">
         <p>Удаление группы повлечет за собой удаление контактов связанных с этой группой</p>
         </div>
         <div class="poap__buttons">
         <button id="delete-group" class="poap__button_confirm">Да, удалить</button>
         <button class="poap__button_cancel">Отмена</button>
         </div>
         </div>
        </section>
    `;
}

export { renderPoap };
