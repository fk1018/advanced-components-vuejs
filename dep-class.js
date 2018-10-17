/* eslint no-param-reassign: "error" */
/* eslint no-unused-vars: "off" */
/* eslint prefer-const: "off" */

let data = {
  price: 5,
  quantity: 2,
};

let total = 0;
let salePrice = 0;

let target = () => {
  total = data.price * data.quantity;
};

class Dep {
  letructor() {
    this.subscribers = [];
  }

  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }

  notify() {
    this.subscribers.forEach(run => run());
  }
}

let deps = new Map();

Object.keys(data).forEach((key) => {
  deps.set(key, new Dep());
});

let dataWithoutProxy = data;

data = new Proxy(dataWithoutProxy, {
  get(obj, key) {
    deps.get(key).depend();
    return obj[key];
  },
  set(obj, key, newValue) {
    obj[key] = newValue;
    deps.get(key).notify();
    return true;
  },
});

function watcher(func) {
  target = func;
  target();
  target = null;
}

watcher(() => {
  total = data.price * data.quantity;
});

watcher(() => {
  salePrice = data.price * 0.9;
});

deps.set(`discount`, new Dep());
data.discount = 5;

let discountPrice = 0;

watcher(() => {
  salePrice = data.price - data.discountPrice;
});
