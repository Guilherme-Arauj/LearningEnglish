export class TimelineDTO {
    public id: string;
    public timeline: number;

    constructor(id: string, timeline: number) {
        this.id = id;
        this.timeline = timeline;
    }
}