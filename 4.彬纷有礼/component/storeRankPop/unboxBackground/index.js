// component/storeRankPop/unboxBackground/index.js
import {COS_URL} from '../../../utils/http'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgImg: {
      type: String,
      value: `${COS_URL}/public/img/storeRank/202304/bg_act_rank_default.png`
    },
    boxItemClass:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    closeImg: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABFCAMAAAArU9sbAAAAh1BMVEX///8AAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9T1RfSAAAALHRSTlMaAPpr+Ggv5mAlIfTv2Xgzdx/j0c+2RTvcxJKvpJ2BGI6/4MmXdFtROScO3ZruKGUAAAKWSURBVFjDnNTnkqJAGEbhb5omg0oWMWedc//Xt4O7O8EGRj2/m4e3iqLlra/rpbIXm9gNVejGm4VdXa69Z/uUap+7iu8pN99Xzyi+ldH2MSLf1XW9yz8m0ZZZ/oNKMHdvRGOVZ8cPRJLAd86l1dwgdx48oKwOEZAWXiL3JV6RAtFh9ZtyjFvjMJbuxofWiY+Dymqt4H3pS3/+8h3UbNWvOBnomSPDOTMNmdOnlCnEnvyeF0NadiunCIqxPNK4gOjUpZxC9CKQxwoWmvBkKmUE60AeLVlDVN4rTopeyzOtNanzU1llME+eUoI5ZKsfyhqKQJ4rKGD2XTkq4rE8mxOjjl+KTNGePJ+nmcqnsoSZvNIMlv+VIGLqvKQ4U6LgnzKHpbzWEuZ/FT9l67+o+Ftc/6ZYYBk/iiddecaHbB++KRnb8T1SMxKzCbVxckvWKhUUxjtBWwZiaTA2FlB9KHsw5480TIwlaHOhB/s3ueaEiRhZxhpbgyVGSUh+lYtLI0bmmnbJRDpqcC9SKSzpygJlfy1R9J5TldiEpXQ2UjD6WqIm0lkZYskC9ywyvOa2xJbuzi4L2RA7IsNrRqBGA/fDRqbkvsjQmoElbX7OVCJ2gcjQmqZ/SVuyIxJNLQPZtNkyUI0WhhVpgEaG2vCnFTNGARgEgiAkmEqCdhJIYe//3xesYqHLydwDBNHbvZ1t/S4Z38XnXfQfBeMfmeclqXlRsxvMsyt0lAYd3VpHO5oOS00v/SXt+Ivd607hdZu+m6a+67YD+D7y2418T7tlBp5fXLMUz3V/xrxoxuR5l2dvzgFTJsmASQAfIVa7Blbj3MgZVvD0g3masz3vGXTnkftx0XlY+5dq7V94F6R7qRKPdsRS31P1Uh9NcG2W9HBRagAAAABJRU5ErkJggg==`,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePop() {
      this.triggerEvent('close')
    }
  }
})