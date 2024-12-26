export class User {
    username: string;
    password: string;
    name: string;
    surname: string;
    birthdate: Date;
    local_legend_for: string[] = [];
    taralli: number = 0;

    constructor(username: string = "", password: string = "", name: string ="", surname: string ="", birthdate: Date = new Date(), local_legend_for: string[] = [], taralli: number = 0) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.birthdate = birthdate;
        this.local_legend_for = local_legend_for;
        this.taralli = taralli;
    }

    //funzione per settare local_legend_for
    setLocalLegendFor(local_legend_for: string[]) {
        this.local_legend_for = local_legend_for;
    }


}