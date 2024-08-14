import { type Request, type Response, Router } from "express";

const router = Router();

const getHandler = async (_: Request, res: Response) => {
  try {
    return res.status(200).send("Healthy");
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// const postHandler = (req: Request, res: Response) => {
//   const { name } = req.body;
//   if (!name) {
//     return res.status(400).send({ message: "Name is required!" });
//   }

//   const newUser = {
//     id: userData.length + 1,
//     name,
//   };

//   userData.push(newUser);
//   return res.status(201).send({ data: newUser });
// };
router.get("/health", getHandler);

export default router;