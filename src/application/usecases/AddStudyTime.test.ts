import { describe, it, expect, vi, beforeEach } from "vitest";
import { AddStudyTime } from "./AddStudyTime";
import { User } from "../../domain/entities/User";
import { UserResponseDTO } from "../dto/UserResponseDTO";

describe("AddStudyTime Use Case", () => {
  let userRepositoryMock: any;
  let addStudyTimeUseCase: AddStudyTime;

  beforeEach(() => {
    userRepositoryMock = {
      addStudyTime: vi.fn(),
    };
    addStudyTimeUseCase = new AddStudyTime(userRepositoryMock);
  });

  it("deve chamar userRepository.addStudyTime e retornar UserResponseDTO com dados atualizados", async () => {
    const dto = {
      userId: "STUDENT-123456",
      timeToAdd: 120,
    };

    const mockUser = {
      id: "STUDENT-123456",
      name: "John Doe",
      email: "john@example.com",
      privilege: "student",
      cefr: "B2",
      timeSpentSeconds: 3600,
    } as User;

    userRepositoryMock.addStudyTime.mockResolvedValue(mockUser);

    const result = await addStudyTimeUseCase.execute(dto);

    expect(userRepositoryMock.addStudyTime).toHaveBeenCalledWith(
      dto.userId,
      dto.timeToAdd
    );
    expect(result).toBeInstanceOf(UserResponseDTO);
    expect(result).toEqual(
      new UserResponseDTO(
        mockUser.id,
        mockUser.name,
        mockUser.email,
        mockUser.privilege,
        mockUser.cefr,
        mockUser.timeSpentSeconds
      )
    );
  });

  it("deve propagar erro se userRepository.addStudyTime falhar", async () => {
    const dto = {
      userId: "STUDENT-123456",
      timeToAdd: 120,
    };

    const error = new Error("Erro no repositório");
    userRepositoryMock.addStudyTime.mockRejectedValue(error);

    await expect(addStudyTimeUseCase.execute(dto)).rejects.toThrow(
      "Erro no repositório"
    );
  });
});
