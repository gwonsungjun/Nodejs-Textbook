const {Good, User, Auction, sequelize} = require('./models')

module.exports = async () => {
  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const targets = await Good.findAll({
      where: {
        soldId: null,
        createdAt: {$lte: yesterday}
      }
    })

    for (const target of targets) {
      const success = await Auction.findOne({
        where: {goodId: target.id},
        order: [['bid', 'DESC']]
      })
      await Good.update({soldId: success.userId}, {where: {id: target.id}})
      await User.update({
        money: sequelize.literal(`money - ${success.bid}`)
      }, {
        where: { id: success.userId}
      })
    }
  } catch (error) {
    console.error(error)
  }
}
