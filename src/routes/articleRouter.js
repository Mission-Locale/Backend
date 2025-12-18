import { Router } from "express";
import ArticleRepository from "../repositories/ArticleRepository.js";
import authguard from "../middlewares/authguard.js";
import { uploadArticleImage } from "../middlewares/multer.js";

const articleRepository = ArticleRepository;
const articleRouter = Router()
  .get("/articles", async (req, res) => {
    try {
      const news = await articleRepository.findMany(req.query);
      res.json(news);
    } catch (err) {
      res.status(400).json(err);
    }
  })

  .post("/articles", authguard, uploadArticleImage, async (req, res) => {
    try {
      // TODO: manage 2 files (images)
      if (req.file) {
        req.body.backgroundImagePath = req.file.path;
      }

      let tags = req.body.tags;
      if (!tags) {
        tags = [];
      } else if (typeof tags === "string") {
        tags = [tags];
      }
      req.body.tags = tags;

      const article = await articleRepository.create(
        req.body,
        req.user.user_id
      );
      res.json(article);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  })

  .get("/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await articleRepository.find(id);
      if (!article) throw "Actualité non trouvé";
      res.json(article);
    } catch (err) {
      res.status(400).json(err);
    }
  })

  .patch("/articles/:id", authguard, async (req, res) => {
    try {
      // const data = await updateValidator.validate(req.body, { abortEarly: false });
      const id = parseInt(req.params.id);
      const article = await articleRepository.update(id, req.body);
      res.json(article);
    } catch (err) {
      res.status(400).json(err);
    }
  })

  .delete("/articles/:id", authguard, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await articleRepository.delete(id);
      res.json(article);
    } catch (err) {
      res.status(400).json(err);
    }
  });

export default articleRouter;
