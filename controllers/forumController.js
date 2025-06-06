const Forum = require("../Models/Forum");
const Comment = require("../Models/Comment");
const Post = require("../Models/Post");
const { v4: uuidv4 } = require("uuid");
const { isLoggedIn } = require("./authController");

//Forum
const createForum = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, category, tags } = req.body;
    const token = req.cookies.auth_token;
    const auth = await isLoggedIn(id, token);
    const forum_id = `FORUM-${uuidv4()}`;

    if (auth == -1)
      return res
        .status(401)
        .json({ error: 401, message: "Unauthorized: No token provided" });

    if (auth == 0)
      return res
        .status(401)
        .json({ error: 401, message: "Unauthorized: You don't have access" });

    const newForum = new Forum({
      _id: forum_id,
      title,
      description,
      created_by: id,
      created_by_model: auth == 1 ? "User" : "Mediator",
      category,
      tags,
    });

    await newForum.save();

    res.status(201).json({
      message: "Forum created successfully",
      forum_id,
      created_by: id,
      created_by_model: auth == 1 ? "User" : "Mediator",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getForums = async (req, res) => {
  try {
    const forums = await Forum.find();

    if (forums.length === 0)
      return res.status(401).json({ error: 401, message: "No forums found" });

    const forumsWithPosts = await Promise.all(
      forums.map(async (forum) => {
        const posts = await Post.find({ forum_id: forum._id });
        const postsWithComments = await Promise.all(
          posts.map(async (post) => {
            const comments = await Comment.find({ post_id: post._id });
            return {
              ...post.toObject(),
              comments,
            };
          })
        );

        return {
          ...forum.toObject(),
          posts: postsWithComments,
        };
      })
    );

    return res.status(200).json({ data: forumsWithPosts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getForumById = async (req, res) => {
  try {
    const { forum_id } = req.params;
    const forum = await Forum.findById(forum_id);
    if (!forum) return res.status(404).json({ error: "Forum not found" });
    const posts = await Post.find({ forum_id }).lean();
    const postIds = posts.map((post) => post._id);
    const comments = await Comment.find({ post_id: { $in: postIds } }).lean();
    const postsWithComments = posts.map((post) => ({
      ...post,
      comments: comments.filter(
        (comment) => comment.post_id.toString() === post._id.toString()
      ),
    }));
    res.status(200).json({
      forum,
      posts: postsWithComments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteForum = async (req, res) => {
  try {
    const id = req.params.id;
    const forum_id = req.params.forum_id;
    const token = req.cookies.auth_token;
    const auth = await isLoggedIn(id, token);
    if (auth == -1)
      return res
        .status(401)
        .json({ error: 401, message: "Unauthorized: No token provided" });

    if (auth == 0)
      return res
        .status(401)
        .json({ error: 401, message: "Unauthorized: You don't have access" });

    const { created_by: forum_user } = await Forum.findById(forum_id, {
      created_by: 1,
      _id: 0,
    });

    if (forum_user !== id)
      return res
        .status(401)
        .json({ error: 401, message: "Unauthorized: You don't have access" });

    const posts = await Post.find({ forum_id }).select("_id");

    // if (posts.length == 0)
    //   return res
    //     .status(500)
    //     .json({ error: 500, message: "Forum not found or posts doesnt exist" });

    const post_ids = posts.map((post) => post._id);

    await Comment.deleteMany({ post_id: { $in: post_ids } });
    await Post.deleteMany({ forum_id });
    await Forum.findByIdAndDelete(forum_id);

    return res.status(200).json({
      message: "Forum and related data successfully deleted",
      forum_id,
      id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Post
const createPost = async (req, res) => {
  try {
    const id = req.params.id;
    const forum_id = req.params.forum_id;
    const { content } = req.body;
    const token = req.cookies.auth_token;
    const auth = await isLoggedIn(id, token);
    const post_id = `POST-${uuidv4()}`;

    if (auth == -1)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    if (auth == 0)
      return res
        .status(401)
        .json({ message: "Unauthorized: You don't have access" });

    const isForum = await Forum.findOne({ _id: forum_id });

    if (!isForum) return res.status(401).json({ message: "Invalid Forum Id" });

    const newPost = new Post({
      _id: post_id,
      forum_id,
      created_by: id,
      created_by_model: auth == 1 ? "User" : "Mediator",
      content,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post_id,
      forum_id,
      created_by: id,
      created_by_model: auth == 1 ? "User" : "Mediator",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies.auth_token;
    const auth = await isLoggedIn(id, token);

    if (auth == -1)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    if (auth == 0)
      return res
        .status(401)
        .json({ message: "Unauthorized: You don't have access" });

    const posts = await Post.find({ created_by: id });
    if (posts.length == 0)
      return res.status(400).json({ message: "Post doesn't exist" });

    res.status(200).json({ message: "Post data found", posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const upVote = async (req, res) => {
  try {
    const { post_id } = req.params;
    const post = await Post.findByIdAndUpdate(
      { _id: post_id },
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: "Upvote added successfully", post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const downVote = async (req, res) => {
  const { post_id } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(
      { _id: post_id },
      { $inc: { downvotes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: "DownVote added successfully", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id, post_id } = req.params;
    const token = req.cookies.auth_token;
    const auth = await isLoggedIn(id, token);

    if (auth == -1)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    if (auth == 0)
      return res
        .status(401)
        .json({ message: "Unauthorized: You don't have access" });

    const post = await Post.findOne({ i_id: post_id });
    if (!post) return res.status(400).json({ message: "Post doesn't exist" });

    await Comment.deleteMany({ post_id });
    await Post.findByIdAndDelete(post_id);

    return res.status(200).json({
      message: "Post and related data successfully deleted",
      post_id,
      id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Comment
const addComment = async (req, res) => {
  try {
    const id = req.params.id;
    const post_id = req.params.post_id;
    const { content } = req.body;
    const token = req.cookies.auth_token;
    const auth = await isLoggedIn(id, token);
    const comment_id = `COMMENT-${uuidv4()}`;

    if (auth == -1)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    if (auth == 0)
      return res
        .status(401)
        .json({ message: "Unauthorized: You don't have access" });

    const isPost = await Post.findOne({ _id: post_id });

    if (!isPost) return res.status(401).json({ message: "Invalid Post Id" });

    const newComment = new Comment({
      _id: comment_id,
      post_id,
      created_by: id,
      created_by_model: auth == 1 ? "User" : "Mediator",
      content,
    });

    await newComment.save();

    res.status(201).json({
      message: "Comment added successfully",
      post_id,
      comment_id,
      created_by: id,
      created_by_model: auth == 1 ? "User" : "Mediator",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findUserComments = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies.auth_token;
    const auth = await isLoggedIn(id, token);

    if (auth == -1)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    if (auth == 0)
      return res
        .status(401)
        .json({ message: "Unauthorized: You don't have access" });

    const comments = await Comment.find({ created_by: id });
    if (comments.length == 0)
      return res.status(400).json({ message: "Comments doesn't exist" });

    res.status(200).json({ message: "Comments data found", comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id, comment_id } = req.params;
    const token = req.cookies.auth_token;
    const auth = await isLoggedIn(id, token);

    if (auth == -1)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    if (auth == 0)
      return res
        .status(401)
        .json({ message: "Unauthorized: You don't have access" });

    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment)
      return res.status(400).json({ message: "Comment doesn't exist" });

    await Comment.findByIdAndDelete(comment_id);

    return res.status(200).json({
      message: "Comment successfully deleted",
      comment_id,
      id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createForum,
  createPost,
  addComment,
  deleteForum,
  deletePost,
  getForums,
  getForumById,
  deleteComment,
  findUserPosts,
  findUserComments,
  upVote,
  downVote,
};
