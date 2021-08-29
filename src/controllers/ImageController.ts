import { Request, Response } from "express";
import { filterImageFromURL, deleteLocalFiles } from "../util/util";
import { isUri } from "valid-url";

type Query = {
  image_url: string;
};

export class ImageController {
  public static async filterImage(req: Request, res: Response) {
    try {
      let { image_url }: Query = req.query;

      if (!image_url || !isUri(image_url)) {
        return res.status(400).send("Invalid image url!");
      }

      let filteredpath = await filterImageFromURL(image_url);

      await res.sendFile(filteredpath, {}, (err) => {
        if (err) {
          return res.status(422).send(`Cannot filter the image!`);
        }

        try {
          deleteLocalFiles([filteredpath]);
        } catch (err) {}
      });
    } catch (err) {
      res.status(422).send(`Cannot filter the image!`);
    }
  }
}
