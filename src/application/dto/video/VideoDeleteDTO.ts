export class VideoDeleteDTO {
  public id: string;

  constructor({ id }: { id: string }) {
    this.id = id;
  }
}
