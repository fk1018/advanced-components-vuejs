let data = {
  price: 5,
  quantity: 2,
};
let total = 0;

let target = () => {
  total = price * quantity;
};

Object.defineProperty(data, `price`, {
  get() {
    return `I was accessed`;
  },
  set(newVal) {
    console.log(`I was changed`);
  },
});

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

const dep = new Dep();

function watcher(func) {
  target = func;
  dep.depend();
  target();
  target = null;
}

watcher(target);
