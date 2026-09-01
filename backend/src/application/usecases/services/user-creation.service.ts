import { UserRepository } from "src/interface-adapters/repositories/user.repository";
import { fetchCognitoId } from "./cognito.service";
import { EloRepository } from "src/interface-adapters/repositories/elo.repository";


export class CreateUser {
    private avatar_index = 0;

    constructor(
        private readonly user_repo: UserRepository,
        private readonly elo_repo: EloRepository
    ) { }

    async create(username: string, email: string) {
        const user_id = await fetchCognitoId(email);

        if (user_id == undefined || (user_id.length ?? 0) !== 1) {
            throw new Error("Invalid Paramaters");
        }

        const id = user_id[0]!.Attributes!.find(attr=> attr.Name === "sub")?.Value;

        const user = await this.user_repo.createUser(username, email, id!, this.avatar_index, "Mercury" );

        if(!user){
            throw new Error("Error creating user");
        }

        await this.elo_repo.createUserElo(user.user_id!);

        this.avatar_index = ++this.avatar_index % 4;
    }
}