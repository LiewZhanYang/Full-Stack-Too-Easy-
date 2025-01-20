const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");

class Thread {
    constructor(
        ThreadID, 
        Title, 
        Body, 
        CreatedOn, 
        Likes,
        SentimentValue,
        PostedBy, 
        Topic, 
        ReplyTo
    ) {
        this.ThreadID = ThreadID;
        this.Title = Title;
        this.Body = Body;
        this.CreatedOn = CreatedOn;
        this.Likes = Likes;
        this.SentimentValue = SentimentValue;
        this.PostedBy = PostedBy;
        this.Topic = Topic;
        this.ReplyTo = ReplyTo;
    }

    static async getThreads() {
        const connection = await mysql.createConnection(dbConfig);
    
        const sqlQuery = `
            SELECT * 
            FROM Thread 
            WHERE ReplyTo IS NULL;;
        `;
        const [result] = await connection.execute(sqlQuery);
    
        connection.end();
        return result.map((row) => {
            return new Thread(
                row.ThreadID,
                row.Title, 
                row.Body,
                row.CreatedOn, 
                row.Likes,
                row.SentimentValue,
                row.Postedby,
                row.Topic,
                row.ReplyTo
            );
        });
    }

    static async getCommentByThreadID(id) {
        const connection = await mysql.createConnection(dbConfig);
    
        const sqlQuery = `
            SELECT * 
            FROM Thread 
            WHERE ReplyTo = ?;
        `;
        const [result] = await connection.execute(sqlQuery, [id]);
    
        connection.end();
        return result.map((row) => {
            return new Thread(
                row.ThreadID,
                row.Title, 
                row.Body,
                row.CreatedOn, 
                row.Likes,
                row.SentimentValue,
                row.Postedby,
                row.Topic,
                row.ReplyTo
            );
        });
    }

    static async postThread(threadDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            INSERT INTO Thread (Title, Body, CreatedOn, SentimentValue, PostedBy, Topic, ReplyTo)
            VALUES (?, ?, CURRENT_DATE, ?, ?, ?, NULL)`;

        const values = [
            threadDetails.Title, 
            threadDetails.Body, 
            threadDetails.SentimentValue,
            threadDetails.PostedBy,
            threadDetails.Topic
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }

    static async postComment(commentDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            INSERT INTO Thread (Title, Body, CreatedOn, SentimentValue, PostedBy, Topic, ReplyTo)
            VALUES (NULL, ?, CURRENT_DATE, ?, ?, ?, ?)`;

        const values = [
            commentDetails.Body, 
            commentDetails.SentimentValue,
            commentDetails.PostedBy,
            commentDetails.Topic,
            commentDetails.ReplyTo
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }

    static async updateThreadLike(id) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            UPDATE Thread
            SET Likes = Likes + 1
            WHERE ThreadID = ?;`;

        const [result] = await connection.execute(sqlQuery, [id]);
        connection.end();
    }

}

module.exports = Thread;