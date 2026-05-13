# Use a imagem base do Node.js
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código-fonte
COPY src ./src
COPY scripts ./scripts

# Expor porta
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "src/server.js"]
