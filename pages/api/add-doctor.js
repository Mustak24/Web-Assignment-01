import DoctorModel from "../../Database/Models/DoctorModel";
import connetToDb from "./Middlewares/connectToDb";

async function next(req, res) {
    if(req.method != 'POST') return res.json({error: 'invalid method'});

    let { experience, fee, languages, facility, consultMode, name, state, hospital, specialization} = req.body;
    if(!(experience && fee && languages && facility && consultMode && name && hospital && specialization)) return res.json({error: 'invalid info'});

    try{
        let doc = await DoctorModel.create({experience, fee, languages, facility, consultMode, name, state, hospital, specialization});
        return res.json({msg: 'create successfully', doctorInfo: doc});
    } catch(e) {
        console.log(e);
        return res.json({error: 'some error comes'})
    }


}


export default (req, res) => connetToDb(req, res, next);