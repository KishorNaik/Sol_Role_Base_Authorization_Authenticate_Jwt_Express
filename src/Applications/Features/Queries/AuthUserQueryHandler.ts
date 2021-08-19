import jwt from "jsonwebtoken";
import cleanDeep from "clean-deep";
import IRequest from "../../../../Frameworks/MediatR/Core/Request/IRequest";
import UserModel from "../../../Models/UserModel";
import IRequestHandler from "../../../../Frameworks/MediatR/Core/Request/IRequestHandler";
import { IMediatR } from "../../../../Frameworks/MediatR/Core/MediatR";
import { AuthUserDataService } from "../../../Infrastructures/DataService/AuthUserDataServiceHandlers";
import { HttpException } from "../../../../Frameworks/Middlewares/ExceptionHandling/ExceptionMiddlewareExtension";
import { IConfiguration } from "../../../Config/Settings/Core/Configuration";

export class AuthUserQuery implements IRequest<UserModel>{
        
    public UserName;
    public Password;


    constructor(userName:string,password:string){
        this.UserName=userName;
        this.Password=password;
    }
    

}

export class AuthUserQueryHandler implements IRequestHandler<AuthUserQuery,UserModel>{

    private readonly mediatR:IMediatR;
    private readonly configuration:IConfiguration;

    constructor(mediatR:IMediatR,configuration:IConfiguration){
        this.mediatR=mediatR;
        this.configuration=configuration;
    }

    public async HandleAsync(requestPara: AuthUserQuery): Promise<UserModel> {
        try
        {
            let user=await this.mediatR?.SendAsync<UserModel,AuthUserDataService>(new AuthUserDataService(requestPara?.UserName,requestPara?.Password));

            if(!user) throw new HttpException(200,"UserName or Password is incorrect");

            const token=jwt.sign({sub:user.UserId,role:user.Role},this.configuration.AppSettingConfig.Development.Secret,{expiresIn:"7d",algorithm:"HS256"});

            user.Password=null;
            user.Token=token;

            user=cleanDeep(user);

            return user;

        }
        catch(ex)
        {
            throw ex;
        }
    }

}