import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('form'),
  btn: document.querySelector('button'),
};
let position = 1;

refs.form.addEventListener('submit', onBtnCreatePromises);

function onBtnCreatePromises(e) {
  e.preventDefault();
  let delay = Number(refs.form.delay.value);
  let amount = Number(refs.form.amount.value);
  let step = Number(refs.form.step.value);

  if (delay < 0 || step < 0 || amount < 0) {
    return Notify.failure('Enter a positive number and "Amount > 0"');
  }
  for (let i = 1; i <= amount; i += 1) {
    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`Rejected promise ${position} in ${delay}ms`);
      });
    position += 1;
    delay += step;
  }
  position = 1;
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
