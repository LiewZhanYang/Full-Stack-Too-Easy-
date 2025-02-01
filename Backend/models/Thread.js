const dbConfig = require("../dbConfig");
const mysql = require("mysql2/promise");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

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


    static async getThreadByID(id) {
        const connection = await mysql.createConnection(dbConfig);
        try {
            // Fetch the thread by ID
            const sqlQuery = `SELECT * FROM Thread WHERE ThreadID = ?`;
            const [result] = await connection.execute(sqlQuery, [id]);
    
            // Check if thread exists
            if (result.length === 0) {
                throw new Error("Thread not found");
            }
    
            // Return the thread
            const row = result[0];
            return new Thread(
                row.ThreadID,
                row.Title,
                row.Body,
                row.CreatedOn,
                row.Likes,
                row.SentimentValue,
                row.PostedBy,
                row.Topic,
                row.ReplyTo
            );
        } catch (error) {
            console.error("Error fetching thread by ID:", error);
            throw error;
        } finally {
            connection.end(); // Ensure connection is always closed
        }
    }
    
    static async getThreads(topic) {
        const connection = await mysql.createConnection(dbConfig);
        let sqlQuery = `SELECT * FROM Thread WHERE ReplyTo IS NULL`;
      
        if (topic) {
          sqlQuery += ` AND Topic = ?`;
        }
      
        const [result] = await connection.execute(sqlQuery, topic ? [topic] : []);
        connection.end();
      
        return result.map((row) => {
          return new Thread(
            row.ThreadID,
            row.Title,
            row.Body,
            row.CreatedOn,
            row.Likes,
            row.SentimentValue,
            row.PostedBy,
            row.Topic,
            row.ReplyTo
          );
        });
      }
      
      static async getCommentByThreadID(threadId) {
        const connection = await mysql.createConnection(dbConfig);
    
        const sqlQuery = `
            SELECT 
                Thread.ThreadID,
                Thread.Body,
                Thread.CreatedOn,
                Thread.Likes,
                Thread.SentimentValue,
                Thread.PostedBy,
                Customer.Name AS PostedByName,  -- Fetch user's name from Customer table
                Thread.Topic,
                Thread.ReplyTo
            FROM Thread
            LEFT JOIN Customer ON Thread.PostedBy = Customer.AccountID  -- Corrected table name
            WHERE Thread.ReplyTo = ?
            ORDER BY Thread.CreatedOn ASC;
        `;
    
        const [result] = await connection.execute(sqlQuery, [threadId]);
        connection.end();
    
        return result.map((row) => ({
            ThreadID: row.ThreadID,
            Body: row.Body,
            CreatedOn: row.CreatedOn,
            Likes: row.Likes,
            SentimentValue: row.SentimentValue,
            PostedBy: row.PostedBy,
            PostedByName: row.PostedByName || "Anonymous", // Ensure a fallback name
            Topic: row.Topic,
            ReplyTo: row.ReplyTo
        }));
    }
    
    

    static async postThread(threadDetails) {
        const connection = await mysql.createConnection(dbConfig);
        const sentimentResult = sentiment.analyze(threadDetails.Body);
        const sqlQuery = `
            INSERT INTO Thread (Title, Body, CreatedOn, SentimentValue, PostedBy, Topic, ReplyTo)
            VALUES (?, ?, CURRENT_DATE, ?, ?, ?, NULL)`;

        console.log(sentimentResult.comparative)
        const values = [
            threadDetails.Title, 
            threadDetails.Body, 
            sentimentResult.comparative,
            threadDetails.PostedBy,
            threadDetails.Topic
        ];

        const [result] = await connection.execute(sqlQuery, values);
        connection.end();
    }

    static async postComment(commentDetails) {
        const connection = await mysql.createConnection(dbConfig);
    
        try {
            // Validate input
            if (!commentDetails.Body || !commentDetails.PostedBy || !commentDetails.Topic || !commentDetails.ReplyTo) {
                throw new Error("Missing required fields for posting a comment");
            }
    
            // Analyze sentiment
            const sentimentResult = sentiment.analyze(commentDetails.Body);
    
            // SQL query
            const sqlQuery = `
                INSERT INTO Thread (Title, Body, CreatedOn, SentimentValue, PostedBy, Topic, ReplyTo)
                VALUES (NULL, ?, CURRENT_DATE, ?, ?, ?, ?)`;
    
            const values = [
                commentDetails.Body,
                sentimentResult.comparative,
                commentDetails.PostedBy,
                commentDetails.Topic,
                commentDetails.ReplyTo,
            ];
    
            // Execute query
            const [result] = await connection.execute(sqlQuery, values);
    
            // Fetch the newly inserted comment
            const newCommentId = result.insertId;
            const [newComment] = await connection.execute(
                `SELECT * FROM Thread WHERE ThreadID = ?`,
                [newCommentId]
            );
    
            return newComment[0]; // Return the inserted comment
        } catch (error) {
            console.error("Error posting comment:", error);
            throw error; // Let the caller handle the error
        } finally {
            connection.end(); // Always close the connection
        }
    }
    
    
    
    static async likeThread(id) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            UPDATE Thread
            SET Likes = Likes + 1
            WHERE ThreadID = ?;`;

        const [result] = await connection.execute(sqlQuery, [id]);
        connection.end();
    }

    static async dislikeThread(id) {
        const connection = await mysql.createConnection(dbConfig);
        const sqlQuery = `
            UPDATE Thread
            SET Likes = Likes - 1
            WHERE ThreadID = ?;`;

        const [result] = await connection.execute(sqlQuery, [id]);
        connection.end();
    }

    static async topSentimentThreadsByForumID(forumID) {
        const connection = await mysql.createConnection(dbConfig);
    
        const sqlQuery = `
            use tooeasydb;
            SELECT * FROM Thread
            WHERE Topic = ?
            ORDER BY SentimentValue DESC
            LIMIT 5;;
        `;
        const [result] = await connection.execute(sqlQuery, [forumID]);
    
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

}

module.exports = Thread;