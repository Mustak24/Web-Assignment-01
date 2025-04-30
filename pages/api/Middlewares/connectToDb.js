import mongoose from 'mongoose';

export default async function connetToDb(req, res, next){
    if(mongoose.connections[0].readyState) return next(req, res);
    try{
        let url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.12h6fbt.mongodb.net/Assignment01`;
        await mongoose.connect(url);
        return next(req, res);
    } catch(error){
        res.json({alert: {type: 'error', msg: 'Fail to connect to database'}, error, miss: false});
    }
}