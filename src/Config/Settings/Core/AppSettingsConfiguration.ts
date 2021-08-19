export type AppSettingsConfiguration={
    Production:{
        Port:number;
        Secret:string;
    },
    Development:{
        Port:number;
        Secret:string;
    }
}