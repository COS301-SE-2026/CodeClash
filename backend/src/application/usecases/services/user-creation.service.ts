import { UserRepository } from "src/interface-adapters/repositories/user.repository";




export class CreateUser{

    constructor(
        private readonly user_repo: UserRepository
    ){}

    create(username: string, email:string){

    }
}