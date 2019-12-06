const express = require('express');

const dbProject = require('../data/helpers/projectModel.js');
const dbActions = require('../data/helpers/actionModel.js')

const router = express.Router();

router.use(express.json());

// CRUD Operations - base URL 'api/projects'

// get - '/' - grab all projects - get()
router.get('/', (req, res) => {
    dbProject.get()
        .then(response => res.status(200).json(response))
        .catch(error => {
            res.status(500).json({ errorMessage: "The projects information could not be retrieved."})
        })
})
// post - '/' - add new project - insert() - required fields: name (string), description (string)
router.post('/', (req, res) => {
    newProject = req.body
    
    dbProject.insert(newProject)
        .then(project => res.status(201).json(project))
        .catch(error => {
            res.status(500).json({ errorMessage: "The project could not be added."})
        })
})

//put - '/:id' - update() - takes id and object containing changes to apply, if no resource with provided id, will return null
router.put('/:id', validateProjectId, (req, res) => {
    const id = req.params.id
    const projectUpdate = req.body

    dbProject.update(id, projectUpdate)
        .then(project => res.status(201).json(project))
        .catch(error => {
            res.status(500).json({ errorMessage: "The project could not be updated."})
        })
})

//delete - '/:id' - remove() - returns the number of records deleted
router.delete('/:id', validateProjectId, (req, res) => {
    const id = req.params.id
    
    dbProject.remove(id)
        .then(response => res.status(200).json({ message: `${response} projects were deleted`}))
        .catch(error => {
            res.status(500).json({ errorMessage: "The project could not be deleted."})
        })
})

// Action CRUD

// get - '/:id/actions' - get all actions from given project
router.get('/:id/actions', validateProjectId, (req, res) => {
    dbActions.get()
        .then(response => res.status(200).json(response))
        .catch(error => {
            res.status(500).json({ errorMessage: "The actions information could not be retrieved."})
        })
})
// post - '/:id/actions' - add new action - insert() - required fields: project_id, description (string), notes (string)
router.post('/:id/actions', validateProjectId, (req, res) => {
    newAction = req.body
    
    dbActions.insert(newAction)
        .then(action => res.status(201).json(action))
        .catch(error => {
            res.status(500).json({ errorMessage: "The action could not be added."})
        })
})
//put - '/:id/actions/:id' - update() - takes id and object containing changes to apply, if no resource with provided id, will return null
router.put('/:id/actions/:aid', validateProjectId, (req, res) => {
    const aid = req.params.aid
    const actionUpdate = req.body

    dbActions.update(aid, actionUpdate)
        .then(action => res.status(201).json(action))
        .catch(error => {
            res.status(500).json({ errorMessage: "The action could not be updated."})
        })
})
//delete - '/:id/actions/:aid' - remove() - returns the number of records deleted
router.delete('/:id/actions/:aid', validateProjectId, (req, res) => {
    const aid = req.params.aid
    
    dbActions.remove(aid)
        .then(response => res.status(200).json({ message: `${response} actions were deleted`}))
        .catch(error => {
            res.status(500).json({ errorMessage: "The action could not be deleted."})
        })
})

function validateProjectId (req, res, next) {
    dbProject.get(req.params.id)
        .then(project => {
            if (project){
                next()
            } else {
                res.status(404).json({errorMessage: "Project with specified ID does not exist."})
            }
        })
}


module.exports = router