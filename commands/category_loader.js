const fs = require('fs')
const path = require('path')

module.exports = () => {

    let categoryList = []

    const readCategories = dir => {
      let files = fs.readdirSync(path.join(__dirname, dir))

      for (let file of files){

        console.log(file)

        if(!file.endsWith('.js')){
          categoryList.push(file)
        }
      }
    }

    readCategories('.')

    return categoryList
}