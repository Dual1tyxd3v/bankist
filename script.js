'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
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

const accounts = [account1, account2, account3, account4];

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

const displayMovements = (movements) => {
  containerMovements.innerHTML = '';
  movements.forEach((move, i) => {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${move}€</div>
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
  labelBalance.textContent = `${acc.balance} €`;
};

const displayTotalStat = ({movements, interestRate}) => {
  labelSumIn.textContent = movements.filter(mov => mov > 0).reduce((a, b) => a + b) + '€';
  labelSumOut.textContent = movements.filter(mov => mov < 0).reduce((a, b) => a + b) + '€';
  labelSumInterest.textContent = movements
    .filter(mov => mov > 0)
    .map(mov => mov * interestRate / 100)
    .filter(mov => mov >= 1)
    .reduce((a, b) => a + b) + '€';
};

let currentUser;

const updateUI = (acc) => {
  displayDeposit(acc);
  displayMovements(acc.movements);
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
