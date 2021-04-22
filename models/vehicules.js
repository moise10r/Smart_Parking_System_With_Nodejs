const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
        plateNumber:{
            type:String,
            require:true
        },
        phoneNumber:{
            type:String,
            required:true
        }
})

export const Vehicules = mongoose.model('vehicules',vehiculeSchema)
