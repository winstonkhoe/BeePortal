
export function createNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY, FORUM_ID)
{
    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
      .onclick = () => window.location.assign(`./forum_detail.html?forum_id=${FORUM_ID}`)
}
