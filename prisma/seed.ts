import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import * as XLSX from 'xlsx'
import path from 'path'

// ---------- Helpers de ID no seu padrão ----------
const generateStudentId = () => `STUDENT-${uuidv4().slice(0, 6)}`
const generateAdminId   = () => `ADMIN-${uuidv4().slice(0, 6)}`
const generateQuestionId = () => `Q-${uuidv4().slice(0, 12)}`

// ---------- Sanitização/trunc ----------
const trunc = (s: any, n: number) =>
  s == null ? undefined : String(s).trim().slice(0, n)

const upper = (s: any) =>
  s == null ? undefined : String(s).trim().toUpperCase()

const prisma = new PrismaClient()

// ---------- Seed de usuários ----------
async function seedUsers() {
  const passwordHash = await bcrypt.hash('Senha@123', 10)

  // Admins ativos
  const admins = [
    { name: 'Ana Silva',      email: 'ana@gmail.com',      cefr: 'A1' },
    { name: 'Gabriela Neri',  email: 'gabriela@gmail.com', cefr: 'A2' }
  ]

  // Students ativos
  const students = [
    { name: 'Bruno Souza',    email: 'bruno@gmail.com',    cefr: 'B1' },
    { name: 'Carla Pereira',  email: 'carla@gmail.com',    cefr: 'B2' },
    { name: 'Diego Santos',   email: 'diego@gmail.com',    cefr: 'C1' },
    { name: 'Elisa Rocha',    email: 'elisa@gmail.com',    cefr: 'C2' },
    { name: 'Felipe Lima',    email: 'felipe@gmail.com',   cefr: 'A1' },
    { name: 'Henrique Alves', email: 'henrique@gmail.com', cefr: 'A2' }
  ]

  // 2 admins ativos
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
      }
    })
  }

  // 6 students ativos
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
      }
    })
  }

  // 1 student inativo
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
    }
  })

  // 1 admin inativo
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
    }
  })

  console.log('✅ Users seed: OK (6 students ativos, 2 admins ativos, 1 student inativo, 1 admin inativo, cada um com cefr diferente)')
}

async function seedQuestionsFromExcel() {
  // Caminho do arquivo XLSX
  const excelPath = path.resolve(__dirname, 'data', 'questions.xlsx')

  // Lê workbook e a primeira planilha
  const wb = XLSX.readFile(excelPath)
  const wsName = wb.SheetNames[0]
  const ws = wb.Sheets[wsName]

  // Converte para JSON de linhas (baseado nos cabeçalhos)
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: null })

  // 💣 DEV: substitui tudo por este conteúdo
  // Se não quiser deletar tudo, comente a linha abaixo e troque por upsert por título, etc.
  await prisma.userQuestionProgress.deleteMany({})
  await prisma.question.deleteMany({})

  const data = rows
    .map((r, idx) => {
      const title = r.title ?? r.Title ?? r.TITLE
      if (!title) return null // pula linhas sem título

      const item = {
        id: generateQuestionId(),                // Q-xxxxxx...
        title: String(title),                    // @db.Text
        cefr: trunc(upper(r.cefr ?? r.CEFR), 10),
        type: trunc(r.type ?? r.TYPE, 50),
        theme: trunc(r.theme ?? r.THEME, 100),
        optionA: r.optionA ?? r.OPTIONA ?? r.OptionA ?? null,
        optionB: r.optionB ?? r.OPTIONB ?? r.OptionB ?? null,
        optionC: r.optionC ?? r.OPTIONC ?? r.OptionC ?? null,
        response: trunc(upper(r.response ?? r.RESPONSE), 10),
        // status: default("ACTIVE")
        // deletedAt: null
      }

      // Normaliza opções e resposta
      if (item.response && ['A','B','C'].includes(item.response)) {
        // ok (letra)
      } else if (item.response && item.response.length > 1) {
        // caso tenha vindo resposta por texto, tenta mapear para A/B/C
        const txt = String(item.response).trim()
        if (item.optionA && String(item.optionA).trim() === txt) item.response = 'A'
        else if (item.optionB && String(item.optionB).trim() === txt) item.response = 'B'
        else if (item.optionC && String(item.optionC).trim() === txt) item.response = 'C'
        else item.response = trunc(txt, 10) // mantém como texto curto
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

  // Insere em lote
  await prisma.question.createMany({
    data,
    skipDuplicates: true // ignora colisão de id (improvável)
  })

  console.log(`✅ Questions seed: ${data.length} inseridas do Excel`)
}

async function main() {
  await seedUsers()
  await seedQuestionsFromExcel()
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
