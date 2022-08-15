import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  inputEl: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const startTime = options.defaultDate.getTime();
    const futuretTime = selectedDates[0].getTime();
    const delta = futuretTime - startTime;

    if (delta <= 0) {
      refs.startBtn.disabled = true;
      Notify.failure('Please choose a date in the future');
    } else
      (refs.startBtn.disabled = false),
        Notify.success('Click Start', {
          timeout: 1000,
        });
  },
};

refs.startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  refs.startBtn.disabled = true;
  refs.inputEl.disabled = true;
  const futureTime = Date.parse(refs.inputEl.value);

  timerId = setInterval(() => {
    const differense = futureTime - Date.now();
    if (differense <= 1000) {
      clearInterval(timerId);
    }

    const { days, hours, minutes, seconds } = convertMs(differense);

    renderTime(days, hours, minutes, seconds);
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr(refs.inputEl, options);

function renderTime(days, hours, minutes, seconds) {
  refs.days.textContent = days;
  refs.hours.textContent = hours;
  refs.minutes.textContent = minutes;
  refs.seconds.textContent = seconds;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
