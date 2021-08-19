import express from "express";
import BaseController from "../../Frameworks/BaseController/BaseController";
import { IMediatR } from "../../Frameworks/MediatR/Core/MediatR";
import { UseAuthorize } from "../../Frameworks/Middlewares/Jwt/JwtMiddlewareExtensions";
import { AuthUserQuery } from "../Applications/Features/Queries/AuthUserQueryHandler";
import { IConfiguration } from "../Config/Settings/Core/Configuration";
import UserModel from "../Models/UserModel";

export default class UserController extends BaseController{

    private readonly mediatR:IMediatR;
    private readonly configuration:IConfiguration;

    constructor(mediatR:IMediatR,configuration:IConfiguration){
        super();

        this.router=express.Router();
        this.routePath="/api/user";
    
        this.mediatR=mediatR;
        this.configuration=configuration;

        this.InitializeRoutes().then((resolve)=>console.log("User Routes Initialize"));
    }

    protected InitializeRoutes(): Promise<void> {
        return new Promise((resolve,reject)=>{
            try
            {
                this.router.post(
                    `${this.routePath}/authuser`,
                    this.AuthUserAsync.bind(this)
                );

                this.router.post(
                    `${this.routePath}/getdata`,
                    UseAuthorize(this.configuration.AppSettingConfig.Development.Secret,["Admin"]),
                    this.GetDataAsync.bind(this)
                )

                resolve();
            }
            catch(ex)
            {
                reject(ex);
            }
        })
       
    }

    private async AuthUserAsync(request:express.Request,response:express.Response,next:express.NextFunction) : Promise<void>{
        try
        {
            const {UserName,Password}=request.body;

            let userResult:UserModel=await this.mediatR.SendAsync<UserModel,AuthUserQuery>(new AuthUserQuery(UserName,Password));

            response.status(200).json(userResult);
        }
        catch(ex){
            next(ex);
        }
    }

    private async GetDataAsync(request:express.Request,response:express.Response,next:express.NextFunction) : Promise<void>{
        try
        {
            response.status(200).json("Test Success");
        }
        catch(ex){
            next(ex);
        }
    }
}