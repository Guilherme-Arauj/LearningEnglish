import { UserVideoProgressResponseDTO } from "../dto/studentUser/UserVideoProgressResponseDTO";
import { UserVideoProgressUpdateDTO } from "../dto/studentUser/UserVideoProgressUpdateDTO";
import { IUserVideoProgressRepository } from "./repositories/IUserVideoProgressRepository";

export class UserVideoProgressService {
  constructor(
    private userVideoProgressRepository: IUserVideoProgressRepository
  ) {}

  public async trackProgress(
    userId: string
  ): Promise<UserVideoProgressResponseDTO[]> {
    const progressWithVideos =
      await this.userVideoProgressRepository.findByUserIdWithVideos(userId);

    return progressWithVideos.map((item) =>
      UserVideoProgressResponseDTO.fromUserVideoProgress(item)
    );
  }

public async updateUserVideoProgress(
  dto: UserVideoProgressUpdateDTO
): Promise<UserVideoProgressResponseDTO> {
  const existingProgress = await this.userVideoProgressRepository.getById(dto.id);
  if (!existingProgress) {
    throw new Error("Progresso de vídeo não encontrado");
  }

  if (dto.userId !== undefined) {
    existingProgress.userId = dto.userId;
  }
  if (dto.videoId !== undefined) {
    existingProgress.videoId = dto.videoId;
  }
  if (dto.status !== undefined) {
    existingProgress.status = dto.status;
  }

  const savedProgress = await this.userVideoProgressRepository.update(existingProgress);
  return UserVideoProgressResponseDTO.fromUserVideoProgress(savedProgress);
}
}
