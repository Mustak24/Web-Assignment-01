import { model, models, Schema } from "mongoose";


const DoctorSchema = new Schema({
    name: {type: String, required: true},
    state: {type: String},
    hospital: {type: String, required: true},
    specialization: {type: String, required: true},

    experience: {type: Number, required: true},
    fee: {type: Number, required: true},
    languages: [{type: String}],
    facility: {type: String, default: 'other'},
    consultMode: [{type: String}]
})

const DoctorModel = models.doctor || model('doctor', DoctorSchema);

export default DoctorModel;