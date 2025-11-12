import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import * as XLSX from 'xlsx'
import path from 'path'

const prisma = new PrismaClient()

// ---------- Helpers ----------
const generateStudentId = () => `STUDENT-${uuidv4().slice(0, 6)}`
const generateAdminId = () => `ADMIN-${uuidv4().slice(0, 6)}`
const generateQuestionId = () => `Q-${uuidv4().slice(0, 12)}`
const trunc = (s: any, n: number) => (s == null ? undefined : String(s).trim().slice(0, n))
const upper = (s: any) => (s == null ? undefined : String(s).trim().toUpperCase())

// ===============================================================
// USERS
// ===============================================================
async function seedUsers() {
  const passwordHash = await bcrypt.hash('Senha@123', 10)

  const admins = [
    { name: 'Ana Silva', email: 'ana@gmail.com', cefr: 'A1' },
    { name: 'Gabriela Neri', email: 'gabriela@gmail.com', cefr: 'A2' },
  ]

  const students = [
    { name: 'Bruno Souza', email: 'bruno@gmail.com', cefr: 'B1' },
    { name: 'Carla Pereira', email: 'carla@gmail.com', cefr: 'B2' },
    { name: 'Diego Santos', email: 'diego@gmail.com', cefr: 'C1' },
    { name: 'Elisa Rocha', email: 'elisa@gmail.com', cefr: 'C2' },
    { name: 'Felipe Lima', email: 'felipe@gmail.com', cefr: 'A1' },
    { name: 'Henrique Alves', email: 'henrique@gmail.com', cefr: 'A2' },
  ]

  for (const u of admins) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { cefr: u.cefr },
      create: {
        id: generateAdminId(),
        name: u.name,
        email: u.email,
        password: passwordHash,
        cefr: u.cefr,
        privilege: 'admin',
        status: 'ACTIVE',
      },
    })
  }

  for (const u of students) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { cefr: u.cefr },
      create: {
        id: generateStudentId(),
        name: u.name,
        email: u.email,
        password: passwordHash,
        cefr: u.cefr,
        privilege: 'student',
        status: 'ACTIVE',
      },
    })
  }

  await prisma.user.upsert({
    where: { email: 'desativado.student@gmail.com' },
    update: { status: 'INACTIVE', cefr: 'B1' },
    create: {
      id: generateStudentId(),
      name: 'Estudante Desativado',
      email: 'desativado.student@gmail.com',
      password: passwordHash,
      cefr: 'B1',
      privilege: 'student',
      status: 'INACTIVE',
    },
  })

  await prisma.user.upsert({
    where: { email: 'desativado.admin@gmail.com' },
    update: { status: 'INACTIVE', cefr: 'B2' },
    create: {
      id: generateAdminId(),
      name: 'Administrador Desativado',
      email: 'desativado.admin@gmail.com',
      password: passwordHash,
      cefr: 'B2',
      privilege: 'admin',
      status: 'INACTIVE',
    },
  })

  console.log('✅ Users seed: OK')
}

// ===============================================================
// QUESTIONS
// ===============================================================
async function seedQuestionsFromExcel() {
  const excelPath = path.resolve(__dirname, 'data', 'questions.xlsx')
  const wb = XLSX.readFile(excelPath)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: null })

  await prisma.userQuestionProgress.deleteMany({})
  await prisma.question.deleteMany({})

  const data = rows
    .map((r) => {
      const title = r.title ?? r.Title ?? r.TITLE
      if (!title) return null

      const item = {
        id: generateQuestionId(),
        title: String(title),
        cefr: trunc(upper(r.cefr ?? r.CEFR), 10),
        type: trunc(r.type ?? r.TYPE, 50),
        theme: trunc(r.theme ?? r.THEME, 100),
        optionA: r.optionA ?? r.OPTIONA ?? r.OptionA ?? null,
        optionB: r.optionB ?? r.OPTIONB ?? r.OptionB ?? null,
        optionC: r.optionC ?? r.OPTIONC ?? r.OptionC ?? null,
        response: trunc(upper(r.response ?? r.RESPONSE), 10),
      }

      if (item.response && ['A', 'B', 'C'].includes(item.response)) {
        // ok
      } else if (item.response && item.response.length > 1) {
        const txt = String(item.response).trim()
        if (item.optionA && String(item.optionA).trim() === txt) item.response = 'A'
        else if (item.optionB && String(item.optionB).trim() === txt) item.response = 'B'
        else if (item.optionC && String(item.optionC).trim() === txt) item.response = 'C'
        else item.response = trunc(txt, 10)
      }

      return item
    })
    .filter(Boolean) as Array<{
      id: string
      title: string
      cefr?: string | null
      type?: string | null
      theme?: string | null
      optionA?: string | null
      optionB?: string | null
      optionC?: string | null
      response?: string | null
    }>

  if (data.length === 0) {
    console.warn('⚠️ Nenhuma questão válida encontrada no Excel.')
    return
  }

  await prisma.question.createMany({
    data,
    skipDuplicates: true,
  })

  console.log(`✅ Questions seed: ${data.length} inseridas do Excel`)
}

// ===============================================================
// VIDEOS
// ===============================================================
async function seedVideosFromExcel() {
  const excelPath = path.resolve(__dirname, 'data', 'curadoriaVideos_ajustado.xlsx')
  const wb = XLSX.readFile(excelPath)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: null })

  if (rows.length === 0) {
    console.warn('⚠️ Nenhum vídeo encontrado no Excel.')
    return
  }

  await prisma.video.deleteMany({}) // opcional em DEV

  const videos = rows.map((r) => ({
    id: r.id ?? uuidv4(),
    youtubeVideoId: String(r.youtubeVideoId).trim(),
    title: String(r.title).trim(),
    description: r.description ? String(r.description).trim() : null,
    thumbnailUrl: r.thumbnailUrl ? String(r.thumbnailUrl).trim() : null,
    publishedAt: r.publishedAt ? new Date(r.publishedAt) : null,
    channelTitle: r.channelTitle ? String(r.channelTitle).trim() : null,
    tags: r.tags ? String(r.tags).trim() : null,
    status: (r.status ?? 'ACTIVE').toString().toUpperCase(),
    cefr: r.cefr ? String(r.cefr).trim().toUpperCase() : 'A1',
    createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : null,
  }))

  await prisma.video.createMany({
    data: videos,
    skipDuplicates: true,
  })

  console.log(`✅ Videos seed: ${videos.length} inseridos do Excel`)
}

// ===============================================================
// MAIN EXECUTION
// ===============================================================
async function main() {
  await seedUsers()
  await seedQuestionsFromExcel()
  await seedVideosFromExcel()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
