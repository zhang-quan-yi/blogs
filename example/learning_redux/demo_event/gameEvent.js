const gameEvent = {
    handler: {}
};
gameEvent.on = function(type,fn){
    gameEvent.handler[type] = fn;
};

gameEvent.dispatch = function(e){
    const type = e.type;
    const fn = gameEvent.handler[type];
    fn(e);
};

module.exports = gameEvent;