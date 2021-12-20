import { Class } from '../model/Class.js'
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
        let forumObj = await forum.insertForum()
        let c = await Class.getClass(forumObj.classID)
        c.notifyObserver(forumObj.forumID, forumObj.title, forumObj.content, forumObj.userID)
        return forumObj
    }

    static async insertForumDiscussion(forumID, content, userID)
    {
        let forumDiscussion = new ForumDiscussion(null, forumID, content, null, userID)
        let success = await forumDiscussion.insertForumDiscussion()
        return success
    }

    static async updateForum(forumID, content)
    {
        return await Forum.updateForum(forumID, content)
    }

    static async removeForum(forumID)
    {
        let success = await Forum.removeForum(forumID)
        if(success === true)
            window.location.assign('./forum.html')
    }

    static async updateForumDiscussion(forumDiscussionID, content)
    {
        return await ForumDiscussion.updateForumDiscussion(forumDiscussionID, content)
    }

    static async removeForumDiscussion(forumID)
    {
        let success = await ForumDiscussion.removeForumDiscussion(forumID)
        if(success === true)
            window.location.reload()
    }

}
