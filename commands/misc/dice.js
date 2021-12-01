const math = require('../../functions/math')

module.exports = {
  commands: ['dice'],
  description: 'Escoge un número aleatorio entre el 1 y <num>',
  expectedArgs: '<num>',
  maxArgs: 1,
  callback: (message, arguments, text) => {
    
    console.log(arguments)
    
    var num = arguments[0]
    
    if(!num){
      num = 6
    }
    
    result = math.randomNumberBetween(1,num)

    message.channel.send(`Random number between **1** and **${num}** \n:game_die: **${result}** :game_die:`)
  },  
}