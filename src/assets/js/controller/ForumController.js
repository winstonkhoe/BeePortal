import { Forum } from '../model/Forum.js'
import { ForumDiscussion } from '../model/ForumDiscussion.js'

export class ForumController{

    static async getForum(forumID)
    {
        return await Forum.getForum(forumID)
    }

    static async getAllClassForum(classID)
    {
        let forums = await Forum.getAllClassForum(classID)
        return forums
    }

    static async getAllForumOfUser(userID)
    {
        let forums = await Forum.getAllForumOfUser(userID)
        return forums
    }

    static async getAllForumDiscussion(forumID)
    {
        return await ForumDiscussion.getAllForumDiscussion(forumID)
    }

    static async insertForum(classID, title, content, userID, privacy)
    {
        let forum = new Forum(null, classID, title, content, null, userID, privacy)
        let success = await forum.insertForum()
        return success
    }

    static async insertForumDiscussion(forumID, content, userID)
    {
        let forumDiscussion = new ForumDiscussion(null, forumID, content, null, userID)
        let success = await forumDiscussion.insertForumDiscussion()
        return success
    }

}
