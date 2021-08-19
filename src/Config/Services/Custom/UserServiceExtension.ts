import Bottle from "bottlejs";
import { IMediatRRegister } from "../../../../Frameworks/MediatR/Core/MediatR";
import { AuthUserQuery, AuthUserQueryHandler } from "../../../Applications/Features/Queries/AuthUserQueryHandler";
import UserController from "../../../Controllers/UserController";
import { AuthUserDataService, AuthUserDataServiceHandler } from "../../../Infrastructures/DataService/AuthUserDataServiceHandlers";

export const UserServiceExtension=(bottleContainer:Bottle):void=>{
    let DataServiceHandler=():void=>{
        bottleContainer.service("authUserDataServiceHandler",AuthUserDataServiceHandler);
    }

    let QueryHandler=():void=>{
        bottleContainer.service("authUserQueryHandler",AuthUserQueryHandler,"mediatR","configurations");
    }

    let Controller=():void=>{
        bottleContainer.service("userController",UserController,"mediatR","configurations");
    }

    let MediatRRegistration=():void=>{
        let mediatR:IMediatRRegister=bottleContainer.container.mediatR;

            // Data Service
            mediatR.RegisterRequest(AuthUserDataService,bottleContainer.container.authUserDataServiceHandler);

            // Query Handler
            mediatR.RegisterRequest(AuthUserQuery,bottleContainer.container.authUserQueryHandler);
    }

    DataServiceHandler();
    QueryHandler();
    Controller();
    MediatRRegistration();
}