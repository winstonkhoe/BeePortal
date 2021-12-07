import { Forum } from '../model/Forum.js'

export class ForumController{
    static async getAllClassForum(classID)
    {
        let forums = await Forum.getAllClassForum(classID)
        return forums
    }
}
