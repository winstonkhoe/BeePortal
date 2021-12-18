import { Score } from "../model/Score.js";

export class ScoreController {
  static async getScore(scoreID) {
    return await Score.getScore(scoreID);
  }

  static async getExistingScore(taskID, userID)
  {
    return await Score.getScoreDocument(taskID, userID, false)
  }
  
  static async insertScore(classID, taskID, userID, score) {
    await Score.setExistingScoreIsUpdated(taskID, userID);
    let taskType = await Score.getTaskType(taskID);
    let scoreObj = new Score(null, classID, taskID, userID, score, false, taskType);
    return await scoreObj.insertScore();
  }

  static async finalizeScore(taskID, userID) {
    await Score.finalizeScore(taskID, userID);
  }
}
