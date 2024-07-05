import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.send(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не вдалось отримати теги',
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не вдалось отримати статі',
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    ).populate('user');

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не вдалось отримати статю',
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete({ _id: postId });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не вдалось удалити статтю',
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не вдалося створити статтю',
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.userId,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не вдалось обновити статтю',
    });
  }
};
