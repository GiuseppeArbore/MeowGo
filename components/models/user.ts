export class User {
    username: string;
    password: string;
    name: string;
    surname: string;
    birthdate: Date;
    constructor(username: string, password: string, name: string, surname: string, birthdate: Date) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.birthdate = birthdate;
    }
}