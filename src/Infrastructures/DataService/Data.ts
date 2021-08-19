import UserModel from "../../Models/UserModel";

export const UsersData=():UserModel[]=>{
    const userModelList:UserModel[]=new Array();
        userModelList.push({
            UserId:1,
            FirstName:"Kishor",
            LastName:"Naik",
            UserName:"kishor11",
            Password:"123",
            Role:"Admin"
        });

        return userModelList;
}