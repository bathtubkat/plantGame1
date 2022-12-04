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
     this.listeners[message].forEach(1 (message,payload));
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

let onKeyDown = function(e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
        case 32: 
        e.preventDefault();
        break;
        default:
        break;
    }
};

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowLeft") {
        eventEmitter.emit(messages.MOVE_LEFT);
    } else if (evt.key === "ArrowRight") {
        eventEmitter.emit(Messages.MOVE_RIGHT);
      } else if (evt.key === "ArrowUp") {
        eventEmitter.emit(Messages.MOVE_UP);
      } else if (evt.key === "ArrowDown") {
        eventEmitter.emit(Messages.MOVE_DOWN);
      }
    });

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
          ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
      
        clear(ctx) {}
      }
      
      class Water extends GameObject {
        constructor(x, y) {
          super(x, y);
          (this.width = 200), (this.height = 200);
          this.type = "Water";
          this.speed = { x: 5, y: 5 };
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
      
      // use like so
      window.onload = async () => {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        waterImg = await loadAsset(
        assets/water.png
        );
        seedImg = await loadAsset(
        assets/seed.png        );
        flowerImg = await loadAsset(
        assets/flower.png        );
        water.img = waterImg;
        seed.img = seedImg;
        flower.img = flowerImg;
      
        water.draw(ctx);
        seed.draw(ctx);
        flower.width = 400;
        flower.height = 400;
      
        eventEmitter.on(Messages.MOVE_LEFT, () => {
          water.x -= 20;
          if (!intersectRect(water, seed)) {
            water.draw(ctx);
          }
        });
      
        eventEmitter.on(Messages.MOVE_RIGHT, () => {
          water.x += 20;
          if (!intersectRect(water, seed)) {
            water.draw(ctx);
          }
        });
      
        eventEmitter.on(Messages.MOVE_UP, () => {
          water.y -= 20;
          if (!intersectRect(water, seed)) {
            water.draw(ctx);
          }
        });
      
        eventEmitter.on(Messages.MOVE_DOWN, () => {
          water.y += 20;
          if (!intersectRect(water, seed)) {
            water.draw(ctx);
          }
        });
      
        eventEmitter.on(Messages.WATER_SEED_COLLISION, () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          flower.draw(ctx);
          window.removeEventListener("keyup", (evt) => {
            if (evt.key === "ArrowLeft") {
              eventEmitter.emit(Messages.water_MOVE_LEFT);
            } else if (evt.key === "ArrowRight") {
              eventEmitter.emit(Messages.water_MOVE_RIGHT);
            } else if (evt.key === "ArrowUp") {
              eventEmitter.emit(Messages.water_MOVE_UP);
            } else if (evt.key === "ArrowDown") {
              eventEmitter.emit(Messages.water_MOVE_DOWN);
            }
          });
        });
      
        let gameLoop = setInterval(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          if (intersectRect(water, seed)) {
            eventEmitter.emit(Messages.COLLISION_water_seed);
          } else {
            water.draw(ctx);
            seed.draw(ctx);
          }
        }, 100);
      };
      