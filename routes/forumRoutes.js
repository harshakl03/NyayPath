const express = require("express");
const {
  createForum,
  createPost,
  addComment,
  deleteForum,
  getForumById,
  getForums,
  deletePost,
  deleteComment,
  findUserPosts,
  findUserComments,
  upVote,
  downVote,
} = require("../controllers/forumController");
const router = express.Router();

//Forum
router.post("/:id", createForum);
router.get("/", getForums);
router.get("/:forum_id", getForumById);
router.delete("/:forum_id/:id", deleteForum);

//Post
router.post("/post/:forum_id/:id", createPost);
router.get("/post/:id", findUserPosts);
router.patch("/post/upvote/:post_id", upVote);
router.patch("/post/downvote/:post_id", downVote);
router.delete("/post/:post_id/:id", deletePost);

//Comment
router.post("/comment/:post_id/:id", addComment);
router.get("/comment/:id", findUserComments);
router.delete("/comment/:comment_id/:id", deleteComment);

module.exports = router;
