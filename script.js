//set up EventEmitter
class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    //when message is received tell listener to do something
    on(message, listener) {
    if (!this.listeners[message]) {
        this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
    }
//set message with payload
    emit(message, payload = null) {
    if(this.listeners[message]) {
     this.listeners[message].forEach( (l) => l(message, payload));
    }
}};

const messages = {
    MOVE_LEFT: "MOVE_LEFT",
    MOVE_RIGHT: "MOVE_RIGHT",
    MOVE_UP: "MOVE_UP",
    MOVE_DOWN: "MOVE_DOWN",
    WATER_SEED_COLLISION: "WATER_SEED_COLLISION"
};

const eventEmitter = new EventEmitter();

const keyDown = [];
document.addEventListener('keydown', event => {
  if(!keyDown.includes(event.key)){
    keyDown.push(event.key);
  }
});
document.addEventListener('keyup', event => {
  if(keyDown.includes(event.key)){
    keyDown.splice(keyDown.indexOf(event.key), 1);
  }
});
function handleInput(keyDown){
  if(keyDown.includes('ArrowLeft') || keyDown.includes('a')){
    eventEmitter.emit(messages.MOVE_LEFT);
  }
  if(keyDown.includes('ArrowRight') || keyDown.includes('d')){
    eventEmitter.emit(messages.MOVE_RIGHT);
  }
  if(keyDown.includes('ArrowUp') || keyDown.includes('w')){
    eventEmitter.emit(messages.MOVE_UP);
  }
  if(keyDown.includes('ArrowDown') || keyDown.includes('s')){
    eventEmitter.emit(messages.MOVE_DOWN);
  }
}

function loadAsset(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          // image loaded and ready to be used
          resolve(img);
        };
      });
    }
    class GameObject {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.dead = false;
          this.type = "";
          this.width = 0;
          this.height = 0;
          this.img = undefined;
        }
      
        draw(ctx) {
          ctx.drawImage(
            this.img,
            0, //starting point on the x-axis of the image --- left of the image
            0, //starting point on the y-axis --- top of the image
            this.img.width,
            this.img.height,
            this.x, 
            this.y, 
            this.width, 
            this.height);
        }
      
        clear(ctx) {}
      }
      
      class Water extends GameObject {
        constructor(x, y) {
          super(x, y);
          (this.width = 200), (this.height = 200);
          this.type = "Water";
          this.speed = { x: 5, y: 5 };

          eventEmitter.on(messages.MOVE_LEFT, () => {
            this.x -= this.speed.x;
          });
          eventEmitter.on(messages.MOVE_RIGHT, () => {
            this.x += this.speed.x;
          });
          eventEmitter.on(messages.MOVE_UP, () => {
            this.y -= this.speed.y;
          });
          eventEmitter.on(messages.MOVE_DOWN, () => {
            this.y += this.speed.y;
          });
        }
        moveTo(x, y) {
          this.x = x;
          this.y = y;
        }
      }
      
      class Seed extends GameObject {
        constructor(x, y) {
          super(x, y);
          (this.width = 200), (this.height = 150);
          this.type = "Seed";
        }
      }
      
      let water = new Water(600, 10);
      let seed = new Seed(100, 400);
      let flower = new GameObject(0, 300);
      
      function rectFromGameObject() {
        return {
          top: this.y,
          left: this.x,
          bottom: this.y + this.height,
          right: this.x + this.width
        };
      }
      
      function intersectRect(o1, o2) {
        return !(
          o2.x > o1.x + o1.width ||
          o2.x + o2.width < o1.x ||
          o2.y > o1.y + o1.height ||
          o2.y + o2.height < o1.y
        );
      }
      
      function endGame() {
        clearInterval(gameLoop);
        setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          eventEmitter.delete;
        }, 200);
      }
      
      const assetsToLoad = [
        "./assets/flower.png", //flower
        "./assets/seed.png", //seed
        "./assets/water.png" //water
      ];

      document.addEventListener('DOMContentLoaded', event => {
        const assets = [];
        Promise.all(assetsToLoad.map(loadAsset)).then(images => { //once all images are loaded, add them to the available sources array
          images.forEach(function(img){
              assets.push(img);
          });
          //what to do after images are loaded

          canvas = document.getElementById("canvas");
          canvas.width = 1000;
          canvas.height = 1000;
          ctx = canvas.getContext("2d");

          water.img = assets[2];
          seed.img = assets[1];
          flower.img = assets[0];

          water.draw(ctx);
          seed.draw(ctx);
          flower.width = 400;
          flower.height = 400;

          eventEmitter.on(messages.WATER_SEED_COLLISION, () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            flower.draw(ctx);
            window.removeEventListener("keyup", (evt) => {
              console.log('hi');
              if (evt.key === "ArrowLeft") {
                eventEmitter.emit(messages.MOVE_LEFT);
              } else if (evt.key === "ArrowRight") {
                eventEmitter.emit(messages.MOVE_RIGHT);
              } else if (evt.key === "ArrowUp") {
                eventEmitter.emit(messages.MOVE_UP);
              } else if (evt.key === "ArrowDown") {
                eventEmitter.emit(messages.MOVE_DOWN);
              }
            });
          });

          let gameLoop = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handleInput(keyDown);
            if (intersectRect(water, seed)) {
              eventEmitter.emit(messages.WATER_SEED_COLLISION);
            } else {
              water.draw(ctx);
              seed.draw(ctx);
            }
          }, 16.66);
          //end of game code
        });
      });

      // use like so
      

      

      

      