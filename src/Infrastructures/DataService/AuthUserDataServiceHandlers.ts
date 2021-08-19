import IRequest from "../../../Frameworks/MediatR/Core/Request/IRequest";
import IRequestHandler from "../../../Frameworks/MediatR/Core/Request/IRequestHandler";
import UserModel from "../../Models/UserModel";
import { UsersData } from "./Data";

export class AuthUserDataService extends UserModel implements IRequest<UserModel>{

    constructor(userName:string,password:string){
        super();
        this.UserName=userName;
        this.Password=password;
    }
}

export class AuthUserDataServiceHandler implements IRequestHandler<AuthUserDataService,UserModel>{

    public HandleAsync(requestPara: AuthUserDataService): Promise<UserModel> {
        return new Promise((resolve,reject)=>{

            try
            {
                let userList:UserModel[]=UsersData();
                
                let user=userList.find((userModel)=> userModel.UserName===requestPara.UserName && userModel.Password===requestPara.Password);

                resolve(user!);
            }
            catch(ex){
                reject(ex);
                throw ex;
            }

        });
    }

}