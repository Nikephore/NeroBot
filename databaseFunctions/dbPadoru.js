const padoruSchema = require('../schemas/padoru')

module.exports.add = async (e) => {
  try {      
    await padoruSchema.findOneAndUpdate(
      {
        id: e.id
      },
      {
        id: e.id,
        title: e.title,
        rarity: e.rarity,
        series: e.series,
        active: e.active,
        banner: e.banner,
        released: e.released,
        description: e.description,
        color: e.color,
        artist: e.artist,
        image: e.image,
        life: e.rarity
      },
      { 
        upsert: true,
        new: true 
      })

  } catch (err) {
    console.log(err)
  }
}

module.exports.pickOne = async (rar) => {
  try {
    
    const result = await padoruSchema.aggregate([
      { $match: { rarity: rar, active: true, released: true } },
      { $sample: { size: 1 } }
    ])

    return result[0]
    
  } catch (err) {
    console.log(err)
  }
}

module.exports.pick = async (pid) => {
  try {
    
    const result = await padoruSchema.findOne({ id: pid })

    return result
    
  } catch (err) {
    console.log(err)
  }
}

module.exports.attackFull = async (pid, userId, username, rar) => {
  try {

    const uid = userId.toString()

    const result = await padoruSchema.findOneAndUpdate(
      {
        id: pid
      },
      {
        $set: {
          life: rar,
          "owner.userId": uid,
          "owner.username": username
        },
      },
      { 
        upsert: true,
        new: true 
      })

      return result.owner

  } catch (err) {
    console.log(err)
  }
}

module.exports.attack = async (pid, userId, username, attack) => {
  try {

    const result = await padoruSchema.findOneAndUpdate(
      {
        id: pid
      },
      {
        $inc: {life: attack}
      },
      { 
        upsert: true,
        new: true 
      })

  } catch (err) {
    console.log(err)
  }
}

module.exports.allOwners = async () => {
  try {

    const result = await padoruSchema.find({}, {owner: 1, _id: 0})

    return result

  } catch (err) {
    console.log(err)
  }
}

module.exports.getAll = async () => {
  try {

    const result = await padoruSchema.find()

    return result

  } catch (err) {
    console.log(err)
  }
}

module.exports.setactive = async (pid, bool) => {
  try {

    await padoruSchema.findOneAndUpdate(
      {
        id: pid
      },
      {
        $set: {
          active: bool,
        },
      },
      { 
        upsert: true,
        new: true 
      }
    )

  } catch (err) {
    console.log(err)
  }
}

module.exports.setbanner = async (pid, bool) => {
  try {

    await padoruSchema.findOneAndUpdate(
      {
        id: pid
      },
      {
        $set: {
          banner: bool,
        },
      },
      { 
        upsert: true,
        new: true 
      }
    )

  } catch (err) {
    console.log(err)
  }
}


