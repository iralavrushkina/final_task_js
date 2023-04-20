const bag = document.querySelector(".bag");
const bagProducts = document.querySelector(".bag__goods");
const counter = document.querySelector(".top__counter");

const btnBag = document.querySelector(".top__bag");
btnBag.addEventListener('click',() => {
  bag.classList.replace("hide","bag-active");
  document.querySelector(".wrapper").classList.add("opacity")
  total();
});

const btnClose = document.querySelector(".bag__btn_close");
btnClose.addEventListener('click',() => {
  document.querySelector(".wrapper").classList.remove("opacity")
  bag.classList.replace("bag-active","hide")
});


let bagGoods = [];



const createBagCard =() => {
  const cards = localStorage.getItem("cards");
  if (!cards) {
    bagGoods = [];
  } else {
    bagGoods = JSON.parse(cards);
  }
  let bagCard = bagGoods.reduce((card,item) => {
    card += `<div class="bag__good-card">
    <div class="bag__info">
      <img class="bag__photo" src="${item.img}">
      <div>
        <h3 class="bag__name">${item.name}</h3>
        <span class="bag__price">$${item.price}</span>
        <button class="bag__btn_remove">remove</button>
      </div>
    </div>
    <div class="bag__counter">
      <button class="bag__arrow_up"></button>
        <input class="bag__counter_value btn-bgr-border" type="text" value="${item.counter}">
        <button class="bag__arrow_down"></button>
      </div>
    </div>`

    counter.innerHTML = bagGoods.length;
    return card;
  }, ' '); 

  bagProducts.innerHTML = bagCard;

  const btnsUp = document.querySelectorAll(".bag__arrow_up");
  btnsUp.forEach((button,index) =>{
    button.addEventListener('click', () => increment(index))
  });

  const btnsDown = document.querySelectorAll(".bag__arrow_down");
  btnsDown.forEach((button,index) =>{
    button.addEventListener('click', () => decrement(index))
  });

  const btnsRemove = document.querySelectorAll(".bag__btn_remove");
  btnsRemove.forEach((button,index) =>{
    button.addEventListener('click', () => delBagCard(index))
  });


}

const toBag = index => {
  let cards  = localStorage.getItem("cards");
  if (!cards) {
    bagGoods = []
  } else {
    bagGoods = JSON.parse(cards);
  }

  if (bagGoods.length === 0){
    bagGoods.push(products[index])
    localStorage.setItem("cards", JSON.stringify(bagGoods));
    createBagCard()
  }else{
    const repeat = bagGoods.find(item => item.id == index);
    if(repeat !== undefined){
      const ind = bagGoods.indexOf(repeat)
      increment(ind)
    } else{
      bagGoods.push(products[index])
      localStorage.setItem("cards", JSON.stringify(bagGoods));
      createBagCard()
    }
  }
}

const delBagCard = index => {
  let cards = localStorage.getItem("cards");
  bagGoods = JSON.parse(cards);
  bagGoods.splice(index, 1);
  localStorage.setItem("cards", JSON.stringify(bagGoods));
  let elements = document.querySelectorAll(".bag__good-card");
  elements[index].remove();
}

const increment = ind => {
  let cards = localStorage.getItem("cards");
  bagGoods = JSON.parse(cards);
  const counters = document.querySelectorAll(".bag__counter_value");
  let count = counters[ind];
  count.value ++;
  bagGoods[ind].counter = count.value ; 
  localStorage.setItem("cards", JSON.stringify(bagGoods));
  total()
}

const decrement = ind =>{
  let cards = localStorage.getItem("cards");
  bagGoods = JSON.parse(cards);
  const counters = document.querySelectorAll(".bag__counter_value");
  let count = counters[ind];
  if(count.value >= 2) {
    count.value --;
  }
  bagGoods[ind].counter = count.value ; 
  localStorage.setItem("cards", JSON.stringify(bagGoods));
  total()
}

const clearBag = document.querySelector(".bag__btn_clear");
clearBag.addEventListener('click', ()=> {
  let elements = document.querySelectorAll(".bag__good-card");
  elements.forEach(el => el.remove(".bag__good-card"));
  localStorage.clear(); 
  totalSum.innerHTML = 0;
  counter.innerHTML = 0;
});

const totalSum = document.querySelector(".bag__sum");

const total = () => {
  let cards  = localStorage.getItem("cards");
  if (!cards) {
    bagGoods = []
  } else {
    bagGoods = JSON.parse(cards);
  }
  if (bagGoods.length === 0){
    totalSum.innerHTML = "0";
  }else{
    let curentPrice = bagGoods.map(item => item.price * item.counter);
    let result = curentPrice.reduce((sum,item) =>{
      sum+= item; 
      return sum
    },0);
    totalSum.innerHTML = result.toFixed(2);
  }
}
