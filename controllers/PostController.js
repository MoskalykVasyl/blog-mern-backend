import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
      const uniqueTags = [...new Set(tags)];
    res.send(uniqueTags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не вдалось отримати теги',
    });
  }
};

export const getTagsByName = async(req, res)=>{
  try {
    const tagName = req.params.tagName;
    const posts = await PostModel.find({tags:tagName}).populate('user')
    console.log(posts)

    if (!posts.length) {
      return res.status(404).json({
        message: 'Пости з даним тегом не знайдені',
      });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.warn(err);
    res.status(500).json({
      message: 'Не вдалося отримати пости за даним тегом'
    })
  }
}

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
    )
      .populate('user')
      .populate({
        path: 'comments.user',
        model: 'User',
      });

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

/// Контролери для коментарів
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: {
            text: req.body.textComment,
            user: req.userId,
          },
        },
        $inc: { commentsCount: 1 },
      },
      { returnDocument: 'after' }
    ).populate({
      path: 'comments.user',
      model: 'User',
    });
    const lastComment = doc.comments[doc.comments.length - 1];
    res.status(200).json(lastComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалось додати коментар',
    });
  }
};
