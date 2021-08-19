import express from "express";
import Bottle from "bottlejs";
import MiddlewareCollections from "./Config/Middlewares/MiddlewaresCollection";
import ServiceCollections from "./Config/Services/ServiceCollections";
import BaseController from "../Frameworks/BaseController/BaseController";
import { IConfiguration } from "./Config/Settings/Core/Configuration";

export default class Startup{

    private app:express.Application;
    private bottle:Bottle;
    private middlewareCollections:MiddlewareCollections;

    constructor(bottle:Bottle){
       this.app=express();
       
        this.bottle=bottle;
    }

    public ConfigMiddlewares(middlewareCollections:MiddlewareCollections):Startup{
        this.middlewareCollections=middlewareCollections;

        this.middlewareCollections.AddJsonMiddleware(this.app);
        this.middlewareCollections.AddLogerMiddleware(this.app);
        this.middlewareCollections.AddCorsMiddleware(this.app);

        return this;
    }

    public ConfigServices(serviceCollections:ServiceCollections):Startup{

        serviceCollections.AddConfigurationService(this.bottle);
        serviceCollections.AddSqlProviderService(this.bottle);
        serviceCollections.AddPostgresProviderService(this.bottle);
        serviceCollections.AddMediatR(this.bottle);
        serviceCollections.UserService(this.bottle);

        return this;
    }

    public AddControllers(funcCallBack:(bottleContainer:Bottle)=> Array<BaseController>) : Startup{
        const controllerList:Array<BaseController>=funcCallBack(this.bottle);

        if(controllerList?.length>=1){
            controllerList.forEach((controller)=> {
                this.app.use("/",controller.router);
            });
        }
        return this;
    }

    public ConfigErrorHandler():Startup{

        this.middlewareCollections.AddExceptionMiddleware(this.app);

        return this;
    }

    public Listen():void{

        let port:number=undefined;

        if(process.env.NODE_ENV==='development')
        {
            port=(this.bottle.container.configurations as IConfiguration).AppSettingConfig.Development.Port;
        }
        else if(process.env.NODE_ENV==="production")
        {
            port=(this.bottle.container.configurations as IConfiguration).AppSettingConfig.Production.Port;
        }

        
        this.app.listen(port,()=>{
            console.log(`App listening on the port ${port}`);
        });
    }
    
}