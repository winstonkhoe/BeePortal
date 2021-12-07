import { BeeDatabase } from "../database.js";
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, getFirestore, query, where, Timestamp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'

export class Forum {
    static _CollectionName = "Forums"

    constructor(forumID, classID, title, content, date, userID, privacy)
    {
        this.forumID = forumID
       this.title = title
       this.classID = classID
       this.content = content
       this.date = date
       this.userID = userID
       this.privacy = privacy
    }

    async insertForum()
    {
        try {
            await addDoc(collection(BeeDatabase.getDatabase(), this._CollectionName), {
                classID: this.classID,
                forumTitle: this.forumTitle,
                content: this.content,
                date: Timestamp.now(),
                userID: this.userID,
                privacy: this.privacy
            });
            return true
        } catch (error) {
            return false
        }
    }
    
    async updateForum()
    {

    }

    async removeForum()
    {

    }

    static async getForum(forumID)
    {
        return await getDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, forumID))
    }

    static async getAllClassForum(classID)
    {
        const queryGetAllClassForum = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("classID", "==", classID));
        let datas = await getDocs(queryGetAllClassForum)
        let modelList = []
        datas.forEach((d) => {
            modelList.push(this.convertToModel(d))
        })
        return modelList
    }

    static convertToModel(data)
    {
        let modelData = data.data()
        return new Forum(data.id, modelData.classID, modelData.title, modelData.content, modelData.date, modelData.userID, modelData.privacy)
    }
}