'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
/* const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4]; */
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-06-20T23:36:17.929Z',
    '2023-06-24T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const getHumanDate = (date) => {
  const result = {
    day: date.getDate().toString().padStart(2, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    year: date.getFullYear(),
    hours: date.getHours().toString().padStart(2, '0'),
    minutes: date.getMinutes().toString().padStart(2, '0'),
  };

  const daysDifference = Math.round(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24));
  if (daysDifference === 0) return {...result, formated: 'Today'};
  if (daysDifference === 1) return {...result, formated: 'Yesterday'};
  if (daysDifference <= 7 ) return {...result, formated: `${daysDifference} days ago`};
  return {...result, formated: `${result.day}/${result.month}/${result.year}`};
};

const displayMovements = ({ movements: movs, movementsDates }, sort = false) => {
  const movements = sort ? movs.slice().sort((a, b) => a - b) : movs;

  containerMovements.innerHTML = '';
  movements.forEach((move, i) => {
    const { formated } = getHumanDate(new Date(movementsDates[i]));
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__date">${formated}</div>
      <div class="movements__value">${move.toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserNames = (accounts) => {
  accounts.forEach(acc => {
    acc.userName = acc.owner.toLowerCase().split(' ').map(word => word[0]).join('');
  });
};

createUserNames(accounts);

const displayDeposit = (acc) => {
  acc.balance = acc.movements.reduce((a, v) => a + v);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

const displayTotalStat = ({ movements, interestRate }) => {
  labelSumIn.textContent = movements.filter(mov => mov > 0).reduce((a, b) => a + b).toFixed(2) + '€';
  labelSumOut.textContent = movements.filter(mov => mov < 0).reduce((a, b) => a + b).toFixed(2) + '€';
  labelSumInterest.textContent = movements
    .filter(mov => mov > 0)
    .map(mov => mov * interestRate / 100)
    .filter(mov => mov >= 1)
    .reduce((a, b) => a + b).toFixed(2) + '€';
};

let currentUser;

const updateUI = (acc) => {
  const { day, month, year, hours, minutes } = getHumanDate(new Date());
  labelDate.textContent = `As of ${day}/${month}/${year} ${hours}:${minutes}`;

  displayDeposit(acc);
  displayMovements(acc);
  displayTotalStat(acc);
}

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();

  currentUser = accounts.find(user => user.userName === inputLoginUsername.value);
  if (currentUser?.pin !== +inputLoginPin.value) return;
  containerApp.style.opacity = 1;
  labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(' ')[0]}`;

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  updateUI(currentUser);
});

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = +(inputTransferAmount.value);
  const targetUser = accounts.find(user => user.userName === inputTransferTo.value);

  if (!targetUser ||
    targetUser.userName === currentUser.userName ||
    amount <= 0 ||
    amount > currentUser.balance) return;

  currentUser.movements.push(-amount);
  targetUser.movements.push(amount);
  currentUser.movementsDates.push(new Date().toISOString());
  targetUser.movementsDates.push(new Date().toISOString());
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  updateUI(currentUser);
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if (inputCloseUsername.value !== currentUser.userName || +inputClosePin.value !== currentUser.pin) return;
  const index = accounts.findIndex(user => user.userName === currentUser.userName);

  accounts.splice(index, 1);
  currentUser = null;
  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = +inputLoanAmount.value;
  if (amount <= 0 || !currentUser.movements.some(mov => mov >= amount * 0.1)) return;

  currentUser.movements.push(amount);
  currentUser.movementsDates.push(new Date().toISOString());
  inputLoanAmount.value = '';
  updateUI(currentUser);
});

let sorted = false;

btnSort.addEventListener('click', () => {
  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});
