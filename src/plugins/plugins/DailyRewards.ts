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
    const redemptions = await DailyPrizeRedemptions.findAll({
      where: {
        user_id: user.data.id,
      },
      order: [['redeemed_at', 'desc']],
    })

    const hasRedeemedToday = redemptions.some(r => r.getDaysSinceRedemption() < 1)

    if (hasRedeemedToday) {
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

    const eligiblePrizes = prizes.filter(prize => {
      const hasClaimed = redemptions.some(entry => entry.prize_id === prize.id)

      return hasClaimed === false
    })

    var chosenPrize = await this.getRandomPrize(eligiblePrizes)

    const userHasPrize = await this.doesUserHavePrize(user, chosenPrize)

    if (eligiblePrizes.length === 0 || !chosenPrize || userHasPrize) {
      chosenPrize = {
        id: null,
        pool_id: 0,
        type: 'coins',
        value: 500,
      } as unknown as DailyPrizePoolPrizes;
    }

    await this.giveRewardToPlayer(user, chosenPrize)

    const newRedemption = new DailyPrizeRedemptions({
      user_id: user.data.id,
      prize_id: chosenPrize.id,
    })

    await newRedemption.save()

    this.notifyClientOfReward(chosenPrize, user)
  }

  async notifyClientOfReward(prize: DailyPrizePoolPrizes, user: any) {
    user.send('claimDailyReward', {
      type: prize.type,
      value: prize.value,
    })

    switch (prize.type) {
      case 'coins':
        return user.send('update_coins', {
          coins: user.data.coins + Number(prize.value),
        })
      case 'clothingItem':
        const item = this.crumbs.items[prize.value]

        return user.send('add_item', {
          item: prize.value,
          name: item.name,
          slot: this.crumbs.items.slots[item.type - 1],
          coins: user.data.coins,
        })
      case 'furnitureItem':
        return user.send('add_furniture', {
          furniture: prize.value,
          coins: user.data.coins,
        })
      default:
        throw new Error('Unexpected error occurred - could not handle prize type')
    }
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

  async doesUserHavePrize(user: any, prize?: DailyPrizePoolPrizes) {
    if (!prize) {
      return true
    }

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
