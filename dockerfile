FROM node:22.14.0

WORKDIR /app

# Instala git
RUN apt-get update && apt-get install -y git

# Clona o repositório (isso cria a pasta LearningEnglish)
RUN git clone https://github.com/Guilherme-Arauj/LearningEnglish.git .

# Agora sim, instala as dependências
RUN npm install
RUN npm i -D ts-node-dev

# Gera prisma client
RUN npx prisma generate

EXPOSE 3000
EXPOSE 4200

# Migration + start da aplicação
CMD ["sh", "-c", "npx prisma migrate dev --name init && npm run dev"]