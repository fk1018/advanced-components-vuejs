/* eslint no-param-reassign: "off" */
/* eslint prefer-const: "off" */
/* eslint no-console: "off" */

let data = {
  price: 5,
  quantity: 2,
};
let target = null;

// Our simple Dep class
class Dep {
  constructor() {
    this.subscribers = [];
  }

  depend() {
    if (target && !this.subscribers.includes(target)) {
      // Only if there is a target & it's not already subscribed
      this.subscribers.push(target);
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub());
  }
}

let deps = new Map();

// Go through each of our data properties
Object.keys(data).forEach((key) => {
  deps.set(key, new Dep());
});

let dataWithoutProxy = data;

data = new Proxy(dataWithoutProxy, {
  get(obj, key) {
    deps.get(key).depend();
    return obj[key];
  },
  set(obj, key, newVal) {
    obj[key] = newVal;
    deps.get(key).notify();
    return true;
  },
});

// The code to watch to listen for reactive properties
function watcher(myFunc) {
  target = myFunc;
  target();
  target = null;
}

let total = 0;

watcher(() => {
  total = data.price * data.quantity;
});

console.log(`total = ${total}`);
data.price = 20;
console.log(`total = ${total}`);
data.quantity = 10;
console.log(`total = ${total}`);

deps.set(`discount`, new Dep());
data.discount = 5;

let salePrice = 0;

watcher(() => {
  salePrice = data.price - data.discount;
});

console.log(`salePrice = ${salePrice}`);
data.discount = 7.5;
console.log(`salePrice = ${salePrice}`);
