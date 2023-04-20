import {products} from './furniture.js';

document.addEventListener("DOMContentLoaded", () => {
  loadGoods(products)
  createBagCard()
});

const goods = document.querySelector(".goods");
const bag = document.querySelector(".bag");
const bagProducts = document.querySelector(".bag__goods");
const counter = document.querySelector(".top__counter");
const boxes = document.querySelectorAll(".checkbox");
const inputRange = document.querySelector("#range");

const companyCount = () => {
  boxes.forEach(box => {
    if(box.id !== 'all') {
      const count = products.filter(el => el.company === box.id &&  Number(el.price) <= Number(inputRange.value)); 
      const counters = document.querySelectorAll(".main-products__counter");
      box.value = count.length;
      counters.forEach(el => {
        if (el.classList.contains(box.id)) {
          el.innerHTML = count.length;
        }
      })

      if(box.value === "0") {
        box.setAttribute("disabled", "");
      } else {
        box.removeAttribute("disabled");
      }
    }else {
      document.querySelector(".all").innerHTML = products.length;
    }
  })
}
const inputSearch = document.querySelector(".main-products__serch-input");

inputSearch.addEventListener('keydown', event => {
  if( event.code == 'Enter' || 'change'){
    const name = inputSearch.value;
  const serchedItems = products.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
  loadGoods(serchedItems)
  }
});

const loadGoods = data =>{
  let card = data.reduce((productCard,element) =>  {
    productCard+= `<div class="goods__card goods-card ${element.company}">
      <img class = "goods-card__photo"  src="${element.img}">
      <h3 class = "goods-card__title">${element.name}</h3>
      <span class = "goods-card__price">$${element.price}</span>
      <button class = "goods-card__btn_buy btn-red">Buy</button>
    </div>`
  
    return productCard;
  }, " ");
  goods.innerHTML = card;

  const btnsBuy = document.querySelectorAll(".goods-card__btn_buy");
  btnsBuy.forEach((button,index) =>{
    button.addEventListener('click', () => {
      toBag(data[index].id)
      total()
    })
    
  });
  companyCount()
}

loadGoods(products)

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
    button.addEventListener('click', () => {
      delBagCard(index)
      total()
    })
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
    const repeat = bagGoods.find(item => item.id === index);
    if(repeat){
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


inputRange.addEventListener('input',() =>{
 const value = inputRange.value;
  document.querySelector(".value").innerHTML = `$${value}`;
  filter(values)
});


const values = [];

boxes.forEach(box => {
  box.addEventListener('change', () => {
    if( box.checked) {
      values.push(box.id);
    } else{
      let ind = values.indexOf(box.id);
      values.splice(ind, 1);
    }
    filter(values);
  });
});

const filter = items =>{
  const showAll = items.includes('all');
  if(items.length > 0 && !showAll){
    const filtered = products.filter(product => items.includes(product.company) && Number(product.price) <= Number(inputRange.value));
    loadGoods(filtered)
  }else{
    loadGoods(products)
  }
} 
  










