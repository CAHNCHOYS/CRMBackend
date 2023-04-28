import * as NotesController from "../controllers/notes.js";
import { Router } from "express";

const router = Router();

router.get("/:user_id", NotesController.getUserNotes);
router.post("/", NotesController.addNote);
router.patch("/", NotesController.updateUserNote);
router.delete("/:note_id", NotesController.deleteNote);

export default router;
