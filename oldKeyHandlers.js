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
        eventEmitter.emit(messages.MOVE_RIGHT);
      } else if (evt.key === "ArrowUp") {
        eventEmitter.emit(messages.MOVE_UP);
      } else if (evt.key === "ArrowDown") {
        eventEmitter.emit(messages.MOVE_DOWN);
      }
    });