const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

//Route 1. get all notes using GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error Occured!");
    }   
});

//Route 2. add anew note using POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title','Enter valid Title').isLength({min:3}),
    body('description','At least 5 letters').isLength({min:5})
], async (req,res)=>{
    try {
        const {title, description, tag} = req.body;
        //check error return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({errors: errors.array()});
        
        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error Occured!");
    }    
})

//Route 3. update existing note using PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req,res)=>{
    const {title, description,tag} = req.body;
    try {
        //create new note object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
        
        //find note to be updated and update it.
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found!")};
        
        if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed!")};
        
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        res.json({note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error Occured!");
    }   
});

//Route 4. delete existing note using DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req,res)=>{
    try {
        //find note to be deleted and delete it.
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found!")};

        // Allow deletion if user owns the note
        if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed!")};

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success": "Note Deleted", note: note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error Occured!");
    }   
});

module.exports = router