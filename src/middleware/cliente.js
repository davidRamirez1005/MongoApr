import 'reflect-metadata';
import {plainToClass, classToPlain} from 'class-transformer';
import { Client } from "../routers/storage/clientes.js";
import { con } from "../../db/atlas.js";
import {validate} from 'class-validator';
import { Router } from "express";

const middlewareClienteVerify = Router();
const appDTOData = Router();

let db = await con();
let usuario = db.collection("usuario");

middlewareClienteVerify.use((req,res,next) => {
    if(!req.rateLimit) return; 
    let {payload} = req.data;
    const { iat, exp, ...newPayload } = payload;
    payload = newPayload;
    let Clone = JSON.stringify(classToPlain(plainToClass(Client, {}, { ignoreDecorators: true })));
    let Verify = Clone === JSON.stringify(payload);
    (!Verify) ? res.status(406).send({status: 406, message: "No Autorizado"}) : next();  
});
appDTOData.use( async(req,res,next) => {
    try {
        let data = plainToClass(User, req.body);
        await validate(data);
        req.body = JSON.parse(JSON.stringify(data));
        req.data = undefined;
        next();
    } catch (err) {
        res.status(err.status).send(err)
    }
});
export {
    middlewareClienteVerify,
    appDTOData
};