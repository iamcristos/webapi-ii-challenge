const express = require('express');
const db = require('../data/db');
const routes = express.Router();

routes.post('/', async (req, res)=>{
    const {title, contents} = req.body;
    if (!title || !contents) {
        return res.json({
            status: 400,
            message: "title and acontent are required"
        });
    };
    try {
        const message = {title, contents}
        const newMessage = db.insert(message)
        if(!newMessage) {
            return res.json({
                status: 400,
                message: "message was not sent"
            });
        }
        res.json({
            status: 201,
            message: "message sent succesfully",
            newMessage
        })
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error sending message"
        })
    }
});

routes.post('/:id/comments', async (req,res)=>{
    const {id} = req.params;
    const {text} = req.body;
    if(!Number(id)) {
        return res.json({
            status: 400,
            message: "Input a valid Id"
        })
    }
    if(!text) {
        return res.json({
            status:400,
            message: "Text field is required"
        })
    }
    try {
        const post = await db.findById(id)
        if(!post.length){
            return res.json({
                status:404,
                message: "Post dont exists"
            })
        }
        const comment = {post_id:id, text}
        const newComment =  await db.insertComment(comment)
        if (!newComment){
            return res.json({
                status: 400,
                message: "Comment was not added"
            })
        }
        res.json({
            status:201,
            message: "comment added succesfully",
            newComment
        })
    } catch (error) {
        return res.json({
            status: 500,
            message: "Comment could not be added"
        })
    } 
});

routes.get('/', async (req,res)=>{
    try {
        const posts = await db.find()
        if(!posts.length) {
            return res.json({
                status: 200,
                message: "no Posts"
            })
        }
        res.json({
            status: 200,
            posts
        })
    } catch (error) {
        return res.json({
            status:500,
            message: "Error can't get Posts"
        })
    }
});

routes.get('/:id', async (req,res)=>{
    const {id} = req.params
    if(!Number(id)) {
        return res.json({
            status: 400,
            message: "Invalid Id"
        })
    }
    try {
        const post = await db.findById(id)
        if (!post.length) {
            return res.json({
                status: 404,
                message: "Post not found"
            })
        }
        res.json({
            status: 200,
            post
        })
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error canot fetch posts"
        })
    }
});

routes.get('/:id/comments', async (req,res)=>{
    const {id} = req.params
    if(!Number(id)) {
        return res.json({
            status: 400,
            message: "Invalid Id"
        })
    }

    try {
        const comment = await db.findPostComments(id)
        if(!comment.length){
            return res.json({
                status: 404,
                message: "no comments"
            })
        }
        res.json({
            status: 200,
            comment
        })
    } catch (error) {
        res.json({
            status: 500,
            message: "Error cannot get comment"
        })
    }
});

routes.delete('/:id', async (req,res)=>{
    const {id} = req.params
    if(!Number(id)) {
        return res.json({
            status: 400,
            message: "Invalid Id"
        })
    }
    try {
        const postId = await db.findById(id)
        if (!postId.length) {
            return res.json({
                status:404,
                message: "Post don't exists"
            });
        }
        const deletePost = await db.remove(id)
        if (deletePost){
            res.json({
                status: 200,
                post: postId
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            message: " Error post was not deleted"
        })
    }
});

routes.put('/:id', async (req,res)=>{
    const {id} = req.params
    if(!Number(id)) {
        return res.json({
            status: 400,
            message: "Invalid Id"
        })
    }
    const {title, contents} = req.body;
    if(!title || !contents) {
        res.json({
            status: 400,
            message: "title and contents are required"
        });
    }
    try {
        const postId = await db.findById(id)
        if (!postId.length) {
            return res.json({
                status: 404,
                message: "Post don't exists"
            });
        }
        const updatePost = await db.update(id,{title,contents})
        if(!updatePost){
            return res.json({
                status: 400,
                message: "Post not updated"
            });
        }
        res.json({
            status: 201,
            updatePost
        });
    } catch (error) {
        res.json({
            status: 500,
            message: "Error could not update"
        })
    }
})

module.exports = routes;