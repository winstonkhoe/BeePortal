import { Answer, GroupAnswer } from '../model/Answer.js'

export class AnswerController{

    static async getAssignment(assignmentID)
    {
        return await Answer.get(assignmentID)
    }

    static async insertAnswer(assignmentID, userID, answer)
    {
        await Answer.setExistingAnswerIsUpdated(assignmentID, userID)
        let ans = new Answer(null, assignmentID, userID, answer, null)
        return await ans.insertAnswer()
    }

    static async insertGroupAnswer(assignmentID, userID, answer)
    {
        let groupID = await Answer.setExistingAnswerIsUpdated(assignmentID, userID)
        let ans = new GroupAnswer(null, assignmentID, userID, groupID, answer, null)
        return await ans.insertAnswer()
    }
    
    static async getStudentAnswerOfIndividualAssignment(assignmentID, userID)
    {
        let answers = await Answer.getStudentAnswerOfIndividualAssignment(assignmentID, userID)
        return answers
    }

    static async getAllClassGroupAssignments(classID) 
    {
        let assignments = await Assignment.getAllClassGroupAssignments(classID)
        return assignments
    }

    static async getAllForumDiscussion(forumID)
    {
        return await ForumDiscussion.getAllForumDiscussion(forumID)
    }

    static async insertAssignment(classID, title, content, submissionDate, group)
    {
        let asg = new Assignment(null, classID, title, content, submissionDate, group)
        let success = await asg.insertAssignment()
        return success
    }

    static async insertForumDiscussion(forumID, content, userID)
    {
        let forumDiscussion = new ForumDiscussion(null, forumID, content, null, userID)
        let success = await forumDiscussion.insertForumDiscussion()
        return success
    }

}
