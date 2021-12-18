import { Assignment } from '../model/Assignment.js'

export class AssignmentController{

    static async getAssignment(assignmentID)
    {
        return await Assignment.getAssignment(assignmentID)
    }

    static async assignStudentGroup(assignmentID, groupNumber, userID)
    {
        return await Assignment.assignStudentGroup(assignmentID, groupNumber, userID)
    }
    
    static async getAllClassAssignmentSorted(classID, sortType)
    {
        return await Assignment.getAllClassAssignmentSorted(classID, sortType)
    }

    static async getAllClassIndividualAssignments(classID) 
    {
        let assignments = await Assignment.getAllClassIndividualAssignments(classID)
        return assignments
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
