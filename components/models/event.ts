export class Event {
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    date: Date;
    description: string;
    hour: string;
    max_people: number;
    creator: string;    //username del creatore
    place: string;
    local_legend_here: boolean;
    secret_code: string;
    type: string;
    city: string;

    constructor(name: string, location: string, latitude: number, longitude: number, date: Date, description: string, hour: string, max_people: number, creator: string, place: string, local_legend_here: boolean, secred_code: string, type: string, city: string) {
        this.name = name;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.description = description;
        this.hour = hour;
        this.max_people = max_people;
        this.creator = creator;
        this.place = place;
        this.local_legend_here = local_legend_here;
        this.secret_code = secred_code;
        this.type = type;
        this.city = city;
    }
}