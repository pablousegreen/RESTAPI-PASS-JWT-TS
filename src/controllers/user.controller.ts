import {Request, Response} from "express";
import User, {IUser} from '../models/users';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import user from "../models/users";

function createToken(user: IUser){
    return jwt.sign({id: user.id, email: user.email}, config.jwtSecret , {
        expiresIn: 3600
    });
}

export const sigUp = async (
    req: Request,
    resp: Response ): Promise<Response> =>{
        if(!req.body.email || !req.body.passport) {
            return resp.status(400).json({msg: "Please. Send your email and password"});
        }

        const user = await User.findOne({email: req.body.email});
        if(user){
            return resp.status(400).json({msg: "The User already Exists"});
        }

        const newUser = new User(req.body);
        await newUser.save();
        return resp.status(201).json({newUser});
    }


export const sigIn = async (
    req: Request, res: Response): Promise<Response> =>{
        if(!req.body.email || !req.body.password){
            return res.status(400).json({msg: "The usder does not exits"});
        }

        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(400).json({ msg: "The User does not exists"});
        }
        const isMatch = await user.comparePassword(req.body.passport);

        if(isMatch){
            return res.status(400).json({token: createToken(user)});
        }
         
        return res.status(400).json({
            msg: "The email or password are incorrect"
        });
    }