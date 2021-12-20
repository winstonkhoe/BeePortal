import { Notif } from '../model/Notifications.js'

export class NotificationController{

    static async checkNotif(userID)
    {
        let notifList = await Notif.checkNotif(userID)
        if(notifList || notifList.length > 0)
        {
            notifList.map( async (notif) => {
                await Notif.setNotifOpened(notif.notificationID)
            })
        }
        return notifList
    }
}
