var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var play,bath,sleep,eat;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happydog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  eat = createButton("Feed");
  eat.position(620,95);
  eat.mousePressed(Eat);

  play = createButton("play");
  play.position(1050,95);
  play.mousePressed(Play);

  bath = createButton("bath");
  bath.position(900,95);
  bath.mousePressed(Bath);

  sleep = createButton("sleep");
  sleep.position(980,95);
  sleep.mousePressed(Sleep);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  if (gameState !== "hungry") {
    addFood.hide();
    feed.hide();
    eat.show();
  } else {
    addFood.show();
    feed.show();
    eat.hide();
    foodObj.display();
    drawSprites();
  }  

  if (gameState == "playing") {
    foodObj.garden();
  } else if (gameState == "sleeping") {
    foodObj.bedroom();
  } else if (gameState == "bathing") {
    foodObj.washroom();
  } else {
    updateState("hungry");
  }
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function updateState(state){
  database.ref("/").update({
    gameState: state,
  });
}

function Play(){
  updateState("playing");
}

function Bath(){
  updateState("bathing");
}

function Sleep(){
  updateState("sleeping");
}

function Eat(){
  updateState("hungry");
}








