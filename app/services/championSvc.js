/**
* @file contains service champion 
*/

const championRepo = require("../repositories/championRepo")

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
      const name = req.body.name
      const title = req.body.title
      const description = req.body.description
      const role = req.body.role
      const difficulty = req.body.difficulty
      const profile_image = "/image/default_user_icon.png"
      const approved = "false"
      const createdBy = req.user.username

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

  async update(req) {
    try{
      const name = req.body.name
      const title = req.body.title
      const description = req.body.description
      const role = req.body.role
      const difficulty = req.body.difficulty
      const profile_image = req.body.profile_image
      
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
        profile_image,
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

  // async listApproved() {
  //   try {
  //     const approved = req.
  //     const champions = await championRepo.findAll({
  //       where: {approved},
  //     })
  //     const championTotal = await championRepo.getTotalchampion({
  //       where: {approved},
  //     })
  //     console.log("ini data:", champions)
  //     console.log("ini data:", championTotal)

  //     if(!(champions && championTotal)){
  //       return{
  //         response: 404,
  //         status: "FAIL", 
  //         message: `No Data`,
  //       }
  //     }
  //     return {
  //         champions: champions,
  //         total: championTotal,
  //     }
  //   }catch (err){
  //     return {
  //       response: 400,
  //       status: "FAIL", 
  //       message: "List champion failed",
  //       error: err.message
  //     }
  //   }
  // },

}