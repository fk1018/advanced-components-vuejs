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
  constructor() {
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

Object.keys(data).forEach((key) => {
  let internalValue = data[key];
  const dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      dep.depend();
      return internalValue;
    },
    set(newVal) {
      internalValue = newVal;
      dep.notify();
    },
  });
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
