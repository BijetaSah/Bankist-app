'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Bijeta Sah',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Dhriti Dewan',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Priya Mathur',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Adhrit Singh Chauhan',
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

const loginForm = document.querySelector('.login');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
const computingUserName = function (accounts) {
  accounts.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
computingUserName(accounts);

const displayMovements = function (acc, sorted = false) {
  containerMovements.innerHTML = '';
  const movs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">Rs.${mov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc?.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `Rs.${acc?.balance}`;
};

const calcDisplaySummary = function (acc) {
  const deposit = acc?.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `Rs.${deposit}`;

  const withdrawal = acc?.movements
    .filter(mov => mov < 0)
    ?.reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `Rs.${withdrawal}`;

  const interest = acc?.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (acc.interestRate / 100))
    .filter(mov => mov >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `Rs.${interest}`;
};
const updateUI = function (account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};

let currUser;
const loginUser = function (e) {
  e.preventDefault();
  const inputUser = inputLoginUsername.value;
  const inputPIN = +inputLoginPin.value;
  if (!inputUser || !inputPIN) return;
  currUser = accounts.find(
    acc => acc?.pin === inputPIN && acc?.userName === inputUser
  );
  // Displaying the Welcome message
  if (!currUser) return;
  labelWelcome.textContent = `Welcome back ${currUser?.owner}`;

  //Displaying UI
  containerApp.style.opacity = '1';
  updateUI(currUser);

  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
};

// Implementing the transfer money logic
const transferMoney = function (e) {
  const amount = +inputTransferAmount.value;
  const recipent = accounts.find(acc => acc.userName === inputTransferTo.value);
  e.preventDefault();
  if (
    amount > 0 &&
    recipent &&
    inputTransferTo.value !== currUser.userName &&
    amount <= currUser.balance
  ) {
    // Adding negative amount to the currUser
    currUser.movements.push(-+inputTransferAmount.value);

    // updaing UI
    updateUI(currUser);

    // Adding positive amount to the recipient

    recipent.movements.push(+inputTransferAmount.value);

    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
  }
};

const closeAccount = function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currUser.userName &&
    +inputClosePin.value === currUser.pin
  ) {
    const index = accounts.findIndex(acc => acc.userName === currUser.userName);
    accounts.splice(index, 1);
    inputClosePin.value = inputCloseUsername.value = '';
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
    // currUser = '';
  }
};

const requestLoan = function (e) {
  e.preventDefault();
  const check =
    +inputLoanAmount.value > 0 &&
    currUser.movements
      .filter(mov => mov > 0)
      .some(dep => dep >= +inputLoanAmount.value * 0.1);
  if (!check) return;
  currUser.movements.push(requestLoanAmount);
  updateUI(currUser);
  inputLoanAmount.value = '';
};

let sorted = false;
const sortFunctionality = function (e) {
  e.preventDefault();
  displayMovements(currUser, !sorted);
  sorted = !sorted;
};
// Event handlers
loginForm.addEventListener('submit', loginUser);
btnTransfer.addEventListener('click', transferMoney);
console.log(accounts);
btnClose.addEventListener('click', closeAccount);
btnLoan.addEventListener('click', requestLoan);
btnSort.addEventListener('click', sortFunctionality);
