import { Forum } from '../model/Forum.js'

export class ForumController{
    static async getAllClassForum(classID)
    {
        let forums = await Forum.getAllClassForum(classID)
        return forums
    }

    static async getAllForumOfUser(userID)
    {
        return await Forum.getAllForumOfUser(userID)
    }

    static async insertForum(classID, title, content, userID, privacy)
    {
        let forum = new Forum(null, classID, title, content, null, userID, privacy)
        let success = await forum.insertForum()
        return success
    }

}
