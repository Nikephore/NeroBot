const fs = require('fs')
const path = require('path')

module.exports = () => {

    let categoryList = []

    const readCategories = dir => {
      let files = fs.readdirSync(path.join(__dirname, dir))

      for (let file of files){
        let stat = fs.lstatSync(path.join(__dirname, dir, file))

        if(stat.isDirectory()){
          readCommands(path.join(dir, file))
          let option = require(path.join(__dirname, dir, file))
          categoryList.push(option)
        }
      }
    }

    readCategories('.')

    return categoryList
}