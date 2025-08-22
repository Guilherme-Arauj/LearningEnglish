FROM node:22.14.0

WORKDIR /api

# Copiar manifestos primeiro (para cache)
COPY package*.json ./

# Instalar dependências
RUN npm install
RUN npm i -D ts-node-dev

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Só iniciar a aplicação (migrações você roda separadamente)
CMD ["npm", "run", "dev"]