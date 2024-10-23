"use strict";
const accordeon = document.querySelector('.faq-list');

const closePanel = (item) => {
    let panel = item.querySelector('.panel');
    item.classList.remove('opened');
    panel.style.maxHeight = `0`;
}

const openPanel = (item) => {
    let panel = item.querySelector('.panel');
    item.classList.add('opened');
    panel.style.maxHeight = `${panel.scrollHeight + 60}px`;
}
const onAccordeonClick = (evt) => {
  const target = evt.target;
  let opened = accordeon.querySelector('.opened');
  
  if (!target.classList.contains('js-toggle')) return;
  if (opened) {
    closePanel(opened);
  };
  
  let item = target.closest('div');
  
  if (item != opened) {
    openPanel(item);
    opened = item;
  } 
}

accordeon.addEventListener('click', onAccordeonClick);


const toTopButton  = document.querySelector('.js-top-btn');

toTopButton.addEventListener('click', () => {
  window.scroll(0, 0)
})