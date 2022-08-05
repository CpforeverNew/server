import DailyPrizePoolPrizes, { PrizeType } from '../../database/models/DailyPrizePoolPrizes'
import DailyPrizePools from '../../database/models/DailyPrizePools'
import DailyPrizeRedemptions from '../../database/models/DailyPrizeRedemptions'
import Plugin from '../Plugin'

export default class DailyRewards extends Plugin {
  events = {
    claimDailyReward: this.claimDailyReward,
  }

  /**
   * @todo Argument types
   */
  async claimDailyReward(_: any, user: any) {
    const latestRedemption = await DailyPrizeRedemptions.findOne({
      where: {
        user_id: user.data.id,
      },
      order: [['redeemed_at', 'desc']],
    })

    if (latestRedemption && latestRedemption.getDaysSinceRedemption() < 1) {
      return user.send('error', {
        error: "You can only claim a free gift once per day",
      })
    }

    const pool = await this.getCurrentPool()

    if (!pool) {
      // we should revisit this, and also give the client some way to disable the
      // UI before a user has to reach this point
      return user.send('error', {
        error: "We don't currently have any daily prizes set up - check back soon",
      })
    }

    const prizes = await DailyPrizePoolPrizes.findAll({
      where: {
        pool_id: pool.id,
      },
    })

    if (prizes.length === 0) {
      return user.send('error', {
        error: "We don't currently have any daily prizes set up - check back soon",
      })
    }

    var chosenPrize = await this.getRandomPrize(prizes)

    if (!chosenPrize) {
      return user.send('error', {
        error: 'An unexpected error occurred - please try again in a minute, or contact support if this persists',
      })
    }

    const userHasPrize = await this.doesUserHavePrize(user.data.id, chosenPrize)

    if (userHasPrize) {
      chosenPrize = new DailyPrizePoolPrizes({
        id: 0,
        pool_id: 0,
        type: 'coins',
        value: 500,
      })
    }

    await this.giveRewardToPlayer(user, chosenPrize)

    if (chosenPrize.id > 0) {
      const newRedemption = new DailyPrizeRedemptions({
        user_id: user.data.id,
        prize_id: chosenPrize.id,
      })

      await newRedemption.save()
    }

    user.send('claimDailyReward', {
      type: chosenPrize.type,
      value: chosenPrize.value,
    })
  }

  async giveRewardToPlayer(user: any, prize: DailyPrizePoolPrizes) {
    switch (prize.type) {
      case 'coins':
        this.db.addCoins(user.data.id, prize.value)
        break
      case 'clothingItem':
        user.inventory.add(prize.value)
        break
      case 'furnitureItem':
        user.furnitureInventory.add(prize.value)
        break
    }
  }

  /**
   * @todo Probably add some date logic here once we decide on a rotation
   */
  async getCurrentPool() {
    return await DailyPrizePools.findOne({
      where: {
        name: 'CPF 2.0 Launch',
      },
    })
  }

  /**
   * @todo Revisit this after some more testing - there may be some edge cases
   *  we need to shore up
   */
  async getRandomPrize(prizes: DailyPrizePoolPrizes[]) {
    var target = Math.random()

    for (let prize of prizes) {
      if (target <= prize.probability) {
        return prize
      }

      target -= prize.probability
    }
  }

  async doesUserHavePrize(user: any, prize: DailyPrizePoolPrizes) {
    const record = await DailyPrizeRedemptions.findOne({
      where: {
        prize_id: prize.id,
        user_id: user.data.id,
      },
    })

    if (record) {
      return true
    }

    return await this.doesUserHaveItem(user, prize.value, prize.type)
  }

  async doesUserHaveItem(user: any, item_id: string, type: PrizeType) {
    if (type !== 'clothingItem') {
      return false
    }

    return user.inventory.includes(Number(item_id))
  }
}
