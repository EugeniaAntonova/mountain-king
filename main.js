"use strict";

function $$selector(selector, context) {
  context = context || document;
  return context.querySelector(selector);
}

function $selector(selector, context) {
  context = context || document;
  return [...context.querySelectorAll(selector)];
}

const accordeon = $$selector('.faq-list');

const closePanel = (item) => {
  let panel = $$selector('.panel', item);
  item.classList.remove('opened');
  panel.style.maxHeight = `0`;
}

const openPanel = (item) => {
  let panel = $$selector('.panel', item);
  item.classList.add('opened');
  panel.style.maxHeight = `${panel.scrollHeight + 60}px`;
}
const onAccordeonClick = (evt) => {
  const target = evt.target;
  let opened = $$selector('.opened', accordeon);

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

// ---------------------------------------------------- to top

const toTopButton = $$selector('.js-top-btn');

toTopButton.addEventListener('click', () => {
  window.scroll(0, 0)
})

// ---------------------------------------------------- data fetching
const animateValue = (field, max, time) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / time, 1);
    field.textContent = `${Math.floor(progress * max).toLocaleString('ru-RU')}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function animateText(field, text) {
  let to = text.length;
  let from = 0;

  animate({
    duration: 1000,
    timing: quadEaseOut,
    draw: function (progress) {
      let result = (to - from) * progress + from;
      field.textContent = text.slice(0, Math.ceil(result))
    }
  });
}

const fillInRating = (data) => {
  const ratingItems = $selector('[data-rating-item="true"]');

  for (let i = 0; i < ratingItems.length; i++) {
    const { nick, score, bgUserToken } = data[i];

    if (i == 0) {
      let winnerAvatarImg = $$selector('.js-winner-avatar', ratingItems[i]);
      winnerAvatarImg.src = `https://sz.kz/picture?bgAvatar=${bgUserToken}`;
      winnerAvatarImg.classList.remove('visually-hidden');
    }

    let nickField = $$selector('.js-nick-value', ratingItems[i]);
    let scoreField = $$selector('.js-score-value', ratingItems[i]);

    // nickField.textContent = nick;
    animateText(nickField, nick);
    animateValue(scoreField, score, 1000);

  }
}

const fillInCurrent = (data) => {
  const { nick, place, score, bgUserToken } = data;
  const myPlaceCrad = $$selector('[data-myplace="true"]');
  const placeField = $$selector('.js-my-place', myPlaceCrad);
  const nickField = $$selector('.js-my-place-nick', myPlaceCrad);
  const scoreField = $$selector('.js-my-place-score', myPlaceCrad);
  const wonField = $$selector('.js-my-place-won', myPlaceCrad);
  const avatar = $$selector('.avatar img', myPlaceCrad);
  placeField.textContent = place;
  nickField.textContent = nick;
  scoreField.textContent = Math.floor(score / 500).toLocaleString('ru-RU');
  wonField.textContent = score.toLocaleString('ru-RU');
  avatar.src = `https://sz.kz/picture?bgAvatar=${bgUserToken}`;

  myPlaceCrad.classList.remove('visually-hidden');

}

const onFail = (err) => {
  console.log(err);
}

const getData = async (onSuccess, onFail, createCurrent) => {
  try {
    const response = await fetch(
      './data.json'
      // 'https://sz.kz/srvNew?srv=lrRating&lotteryRace=52&offset=6'
    );

    if (!response.ok) {
      throw new Error('Не удалось получить данные');
    }

    const resp = await response.json();
    const data = resp.data;
    resp.currentUser ? createCurrent(resp.currentUser) : false;
    onSuccess(data);
  } catch (error) {
    onFail(error.message);
  }
};

// -------------------------------------------------- animations

function animate({ timing, draw, duration }) {
  return new Promise(resolve => {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      let progress = timing(timeFraction);

      draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    })
  });
}

function makeEaseOut(timing) {
  return function (timeFraction) {
    return 1 - timing(1 - timeFraction);
  };
}

function bounce(timeFraction) {
  for (let a = 0, b = 1; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return (
        -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
      );
    }
  }
}

function quad(timeFraction) {
  return Math.pow(timeFraction, 2)
}

let bounceEaseOut = makeEaseOut(bounce);
let quadEaseOut = makeEaseOut(quad);

function animateRefresh() {
  return animate({
    duration: 300,
    timing: quadEaseOut,
    draw: (progress) => {
      refreshButton.style.rotate = `${360 * progress}deg`;
    }
  })
}

(() => {
  setInterval(() => {
    animateRefresh();
  }, 24000);
})()

function pause(n) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, n)
  })
}

const animateLogo = () => {
  return animate({
    duration: 800,
    timing: bounceEaseOut,
    draw: function (progress) {
      let logo = $$selector('.intro__main-logo');
      logo.style.translate = `0 ${-100 + 100 * progress}%`;
      logo.style.opacity = `${progress}`;
    }
  })
}

const animateInfo = () => {
  return animate({
    duration: 500,
    timing: quadEaseOut,
    draw: function (progress) {
      let info = $$selector('.hero__info');
      info.style.translate = `${-100 + 100 * progress}% 0`;
      info.style.opacity = `${progress}`;
    }
  })
}

const animateRatingItem = (item) => {
  return animate({
    duration: 200,
    timing: quadEaseOut,
    draw: function (progress) {
      item.style.scale = `${progress}`;
      item.style.opacity = `${progress}`;
      item.style.bottom = `${-100 + 100 * progress}%`
    }
  })
}

const animateRatingItems = (items) => {
  let promise = Promise.resolve();

  items.slice(1).forEach((item) => {
    promise = promise
      .then(() => animateRatingItem(item));
  })

  return promise;
}

const animateWinner = () => {
  return animate({
    duration: 1000,
    timing: quadEaseOut,
    draw: function (progress) {
      let winner = $$selector('.rating__item.winner');
      let mountain = $$selector('.hero__mountain');
      winner.style.translate = `0 ${200 - 200 * progress}%`;
      winner.style.opacity = `${progress}`;
      winner.style.scale = `${progress}`;
      mountain.style.backgroundPosition = `0px ${-85 * progress ** 3}px`;
    }
  })
}

window.addEventListener('DOMContentLoaded', () => {
  let ratingItems = $selector('[data-rating-item="true"]');
  let ratingData = [];
  getData((data) => {
    ratingData = [...data];
    console.log(ratingData);
  }, onFail, fillInCurrent);
  animateLogo()
    .then(() => pause(50))
    .then(() => animateInfo())
    .then(() => animateRatingItems(ratingItems))
    .then(() => animateWinner())
    .then(() => fillInRating(ratingData));
})

// --------------------------------------------------- refresh button

const refreshButton = $$selector('.js-refresh-btn');

refreshButton.addEventListener('click', () => {
  getData(fillInRating, onFail, fillInCurrent);
})