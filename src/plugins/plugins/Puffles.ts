import { getFilterResultByText } from '../../services/filter/filter'
import Plugin from '../Plugin'
import Puffle from '../../database/models/Puffles'

class PuffleAdoptionError extends Error {
  readonly name = 'PuffleAdoptionError'
}

/**
 * @todo Finish typing this plugin
 */
export default class Puffles extends Plugin {
    protected readonly events = {
      'adopt_puffle': this.adoptPuffle,
      'get_puffles': this.getPuffles,
      'get_wellbeing': this.getWellbeing,
      'stop_walking': this.stopWalking,
      'get_puffle_color': this.getPuffleColor,
      'walk_puffle': this.walkPuffle,
      'get_puffle_count': this.getPuffleCount,
    }

    async adoptPuffle(args: any, user: any) {
      try {
        let type = args.type
        let name = args.name.charAt(0).toUpperCase() + args.name.slice(1);

        const model = await Puffle.findOne({
          where: { id: type },
        })

        if (!model) {
          return user.send('error', 'Unknown puffle type specified')
        }

        await this.throwIfUserCannotAdoptPuffle(name, model.cost, user)
        
        user.updateCoins(-model.cost)

        user.lastPuffle = (new Date).getTime()

        let puffle = await this.db.adoptPuffle(user.data.id, type, name)

        user.send('adopt_puffle', {
          puffle: puffle.id,
          coins: user.data.coins,
        })

        let postcard = await this.db.userPostcards.create({
          userId: user.data.id,
          id: 111,
          sender: "Club Penguin Forever",
          details: name,
        })

        if (postcard) {
            user.postcards = await this.db.getPostcards(user.data.id)
            user.send('update_postcards', { postcards: user.postcards })
        }
      } catch (e) {
        if (e instanceof PuffleAdoptionError) {
          return user.send('error', {
            error: e.message,
          })
        }

        console.error(e)

        return user.send('error', {
          error: 'An unexpected error occurred, please try again',
        })
      }
    }

    async throwIfUserCannotAdoptPuffle(name: string, cost: number, user: any) {
      const puffles = await this.db.getPuffles(user.data.id)

      if (puffles.length >= 8) {
        throw new PuffleAdoptionError('You already have 8 puffles.')
      }

      if (!this.purchaseTimerHasCooledDown(user)) {
        throw new PuffleAdoptionError('You need to wait 5 minutes since buying your last puffle.')
      }

      const nameIsOkToUse = await this.isNameValid(name)

      if (!nameIsOkToUse) {
        throw new PuffleAdoptionError("Please choose a different name that's between 3 and 8 characters long.")
      }

      if (cost > user.data.coins) {
        throw new PuffleAdoptionError('You need more coins.')
      }
    }

    async isNameValid(name: string) {
      if (name.length <= 2 || name.length > 8) {
        return false
      }

      const result = await getFilterResultByText(name)

      return result.shouldTextBeFiltered() === false
    }

    /**
     * Returns a boolean indicating whether it's been at least five minutes since
     * the user last purchased a puffle
     */
    purchaseTimerHasCooledDown(user: any) {
      if (!user.lastPuffle) {
        return true
      }

      const timeElapsed = Date.now() - user.lastPuffle

      return timeElapsed >= 300000
    }

    async getPuffles(args: any, user: any) {
        if (!args.userId) {
            return
        }
        let userId = args.userId
        let puffles = await this.db.getPuffles(userId)
        if (puffles) {
            user.send('get_puffles', {
                userId: userId,
                puffles: puffles
            })
        }
    }

    async getWellbeing(args: any, user: any) {
        if (!args.puffle) {
            return
        }
        let puffleId = args.puffle
        let wellbeing = await this.db.getWellbeing(puffleId)
        if (wellbeing) {
            user.send('get_wellbeing', {
                puffleId: puffleId,
                clean: wellbeing.clean,
                food: wellbeing.food,
                play: wellbeing.play,
                rest: wellbeing.rest,
                name: wellbeing.name
            })
        }
    }

    async stopWalking(args: any, user: any) {
        if (user.data.walking !== 0){
            user.data.walking = 0
            user.update({ walking: user.data.walking})
            user.room.send(user, 'stop_walking', {user: user.data.id}, [])
        } 
    }

    async walkPuffle(args: any, user: any) {
        if (user.data.puffle !== 0) {
            user.data.walking = 0
            user.update({ walking: user.data.walking})
            user.room.send(user, 'stop_walking', {user: user.data.id}, [])
        }
        if (args.puffle !== 0){
            user.data.walking = args.puffle
            user.update({ walking: user.data.walking})
            user.room.send(user, 'walk_puffle', {user: user.data.id, puffle: args.puffle}, [])
        }
    }

    async getPuffleColor(args: any, user: any) {
        if (!args.puffle) {
            return
        }
        let puffleId = args.puffle
        let puffleColor = await this.db.getPuffleColor(puffleId)
        if (puffleColor) {
            user.send('get_puffle_color', {
                penguinId: args.penguinId,
                color: puffleColor.color
            })
        }
    }

    async getPuffleCount(args: any, user: any) {
        if (!user.data.id) {
            return
        }
        let puffleCount = await this.db.getPuffleCount(user.data.id)
        if (puffleCount) {
            user.send('get_puffle_count', {
                count: puffleCount
            })
        }
    }
}
