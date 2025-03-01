export class Event {
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    date: string;
    description: string;
    max_people: number;
    creator: string;    //username del creatore
    place: string;
    local_legend_here: boolean;
    secret_code: string;
    type: string;
    ended: string;
    city: string;

    constructor(name: string, location: string, latitude: number, longitude: number, date: string, description: string, hour: string, max_people: number, creator: string, place: string, local_legend_here: string, secred_code: string, type: string, ended:string, city: string) {
        this.name = name;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.max_people = max_people;
        this.creator = creator;
        this.place = place;
        this.local_legend_here = local_legend_here === 'true';
        this.secret_code = secred_code;
        this.type = type;
        this.ended = new Date(ended).toISOString();
        this.city = city;

        const eventDate = new Date(date);
        const [h, m] = hour.split(':');
        eventDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
        this.date = eventDate.toISOString();
    }
    
}