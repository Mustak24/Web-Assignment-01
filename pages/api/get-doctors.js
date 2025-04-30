import DoctorModel from "../../Database/Models/DoctorModel";
import connetToDb from "./Middlewares/connectToDb";


async function next(req, res) {
    if(req.method != 'GET') return res.json({error: 'invalid mewthod'});

    let {query} = req;
    
    let page = query?.page ?? 0;

    try{
        let doctors = await DoctorModel.find();

        if(query['consult-mode'] && query['consult-mode'].toLowerCase() != 'both') {
            doctors = doctors.filter(doc => doc.consultMode.map(e => e.toLowerCase()).includes(query['consult-mode'].toLowerCase()));
        }

        if(query['max-fee'] && query['max-fee'] != 'max') doctors = doctors.filter(doc => doc.fee <= query['max-fee']);

        if(query['max-experience'] && query['max-experience'] != 'min') doctors = doctors.filter(doc => doc.experience >= query['max-experience']);

        if(query['languages'] && query['languages']) {
            let language = query['languages'].split('-').map(e => e.toLowerCase());
            doctors = doctors.filter(doc => { 
                let doctorLang = doc.languages.map(e => e.toLowerCase());
                for(let docLang of doctorLang) {
                    if(language.includes(docLang)) return true;
                }
                return false;
            })
        }

        if(query['facility'] && query['facility'].toLowerCase() != 'both') {
            doctors = doctors.filter(doc => doc.consultMode == query['facility']);   
        }

        let totalResults = doctors.length;
        
        doctors = doctors.slice(page*10, page*10 + 10);


        return res.json({doctors, totalResults});

        
    }catch(e) {
        return res.json({error: 'some errors comes'})
    }
}

export default (req, res) => connetToDb(req, res, next);