/**
* @file contains service champion 
*/
const { ref, getDownloadURL, uploadBytesResumable, deleteObject} = require("firebase/storage");
const { storage, firebaseConfig } = require("../../config/firebase-config");
const championRepo = require("../repositories/championRepo")
const Joi = require('joi');

const giveCurrentDateTime = () => {
  const today = new Date()
  const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  const dateTime = date +"-"+ time
  return dateTime
};

module.exports = {
  
  async list() {
    try {
      const champions = await championRepo.findAll()
      const championTotal = await championRepo.getTotalchampion()
      
      if(!(champions && championTotal)){
        return{
          response: 404,
          status: "FAIL", 
          message: `No Data`,
        }
      }
      return {
          champions: champions,
          total: championTotal,
      }
    }catch (err){
      return {
        response: 400,
        status: "FAIL", 
        message: "List champion failed",
        error: err.message
      }
    }
  },

  async registerChampion(req){
    try{

      if(req.user.approved == false){
        return{
          response: 401,
          status: "FAIL",
          message: "User is not verified",
        }
      }

      const nameScheme = Joi.string().min(2).regex(/^[a-zA-Z]+$/).required()
      const champion_name = req.body.name

      const titleScheme = Joi.string().max(40).regex(/^[A-Za-z\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/).required()
      const champion_title = req.body.title

      const descriptionScheme = Joi.string().max(1500).regex(/^[A-Za-z\s!"#$%&'()*+,-.—/:;<=>?@[\\\]^_`{|}~]+$/).required()
      const champion_description = req.body.description

      const roleSchema = Joi.string().valid("fighter", "assassin", "mage", "support", "tanker", "marksman").required()
      const champion_role = req.body.role.toLowerCase();

      const difficultySchema = Joi.string().valid("1", "2", "3", "4", "5").length(1).required()
      const champion_difficulty = req.body.difficulty

      const name = champion_name
      const title = champion_title
      const description = champion_description 
      const role = champion_role
      const difficulty = champion_difficulty
      const profile_image = "/image/default_user_icon.png"
      const approved = "false"
      const createdBy = req.user.username

      const nameErr = nameScheme.validate(name)
      if (nameErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Minimum name length is 2 characters and does not contain numbers",
        }
      }

      const titleErr = titleScheme.validate(title)
      if (titleErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Maximum length is 40 characters and does not contain numbers",
        }
      }

      const descriptionErr = descriptionScheme.validate(description)
      if (descriptionErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Maximum length is 1500 characters",
        }
      }

      const roleErr = roleSchema.validate(role)
      if (roleErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Only accept roles: fighter, assassin, mage, support, tanker, marksman",
        }
      }

      const difficultyErr = difficultySchema.validate(difficulty)
      if (difficultyErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Only accept number: 1, 2, 3, 4, 5",
        }
      }
      
      const nameExist = await championRepo.findOne(
        {where: {name}}
      )
      
      if(nameExist !== null){
        return {
          response: 403,
          status: "FAIL",
          message: "Name already registered",
        }
      } 

      const champion = await championRepo.create({
        name,
        title,
        description,
        role,
        difficulty,
        profile_image,
        approved,
        createdBy,
      })
      return {champion}    
    } catch (err){
      return {
        response: 400,
        status: "FAIL",
        message: "Register champion failed",
        error: err.message,
      }
    }                                      
  },

  async listById(req){
    try {
      const id = req.params.id
      const champion = await championRepo.findByPk(id)
      
      if(!champion){
        return{
          response: 404,
          status: "FAIL", 
          message: `Can't find champion by id ${id}`,
        }
      }
      return {
          data: champion,
      }
    }catch (err){
      return {
        response: 400,
        status: "FAIL", 
        message: "Find champion by id failed",
        error: err.message
      }
    }
  },

  async updateChampion(req) {
    try{

      const nameScheme = Joi.string().min(2).regex(/^[a-zA-Z]+$/).required()
      const champion_name = req.body.name

      const titleScheme = Joi.string().max(40).regex(/^[A-Za-z\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/).required()
      const champion_title = req.body.title

      const descriptionScheme = Joi.string().max(1500).regex(/^[A-Za-z\s!"#$%&'()*+,-.—/:;<=>?@[\\\]^_`{|}~]+$/).required()
      const champion_description = req.body.description

      const roleSchema = Joi.string().valid("fighter", "assassin", "mage", "support", "tanker", "marksman").required()
      const champion_role = req.body.role.toLowerCase();

      const difficultySchema = Joi.string().valid("1", "2", "3", "4", "5").length(1).required()
      const champion_difficulty = req.body.difficulty

      const nameErr = nameScheme.validate(name)
      if (nameErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Minimum name length is 2 characters and does not contain numbers",
        }
      }

      const titleErr = titleScheme.validate(title)
      if (titleErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Maximum length is 40 characters and does not contain numbers",
        }
      }

      const descriptionErr = descriptionScheme.validate(description)
      if (descriptionErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Maximum length is 1500 characters",
        }
      }

      const roleErr = roleSchema.validate(role)
      if (roleErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Only accept roles: fighter, assassin, mage, support, tanker, marksman",
        }
      }

      const difficultyErr = difficultySchema.validate(difficulty)
      if (difficultyErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Only accept number: 1, 2, 3, 4, 5",
        }
      }

      const name = champion_name
      const title = champion_title
      const description = champion_description 
      const role = champion_role
      const difficulty = champion_difficulty
      // const profile_image = req.body.profile_image
      
      const nameExist = await championRepo.findOne(
        {where: {name}}
      )
      if(nameExist !== null){
        return {
          response: 403,
          status: "FAIL",
          message: "Name already registered",
        }
      } 

      const champion = await championRepo.update(req.params.id, {
        name,
        title,
        description,
        role,
        difficulty,
      })

      return {champion}

    } catch (err){
      return {
        response: 400,
        status: "FAIL",
        message: "Update champion failed",
        error: err.message,
      }
    } 
  },

  async updateChampionProfilePicture(req) {
    try {
      const id = req.params.id
      const champion = await championRepo.findByPk(id)
      const championJSON = JSON.stringify(champion)
      const championParse = JSON.parse(championJSON)

      if(!champion){
        return{
          response: 404,
          status: "FAIL", 
          message: `Can't find champion by id ${id}`,
        }
      }

      // Delete old image from firebase storage
      const imageUrl = championParse.profile_image
      if(imageUrl == "/image/default_user_icon.png"){
        const dateTime = giveCurrentDateTime();
        const storageRef = ref(storage, `champion_profiles/${dateTime + "_" + req.file.originalname}`)

        // Create file metadata including the content type 
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)

        //Grab the public url
        const url = await getDownloadURL(snapshot.ref)

        const profile_image = url
        const user = await championRepo.update(req.params.id, {
          profile_image,
        })
      
        return {user}
      }
      const fileName = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.indexOf('?')));
      console.log("tes", fileName)
      const desertRef = ref(storage, `${fileName}`);
      deleteObject(desertRef)

      const dateTime = giveCurrentDateTime();
        const storageRef = ref(storage, `champion_profiles/${dateTime + "_" + req.file.originalname}`)
        
        // Create file metadata including the content type 
        const metadata = {
            contentType: req.file.mimetype,
        };
      
        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
      
        //Grab the public url
        const url = await getDownloadURL(snapshot.ref)
      
        const profile_image = url
        const user = await championRepo.update(req.params.id, {
          profile_image,
        })
      
        return {user}

    } catch (err) {

      return {
        response: 400,
        status: "FAIL",
        message: "Update champion picture failed",
        error: err.message,
      }

    }
  },

  async destroy(req) {
      try{
        const id = req.params.id
        const champion = await championRepo.delete({
          where: {id},
        })

        if(!champion) {
          return{
            response: 400,
            status: "FAIL",  
            message: `Can't find champion by id: ${id}`
          }
        }
        return {champion} 
      }catch (err){
        return {
          response: 400,
          status: "FAIL", 
          message: "Delete champion failed",
          error: err.message
        }
      }
  },

}