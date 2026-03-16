# Gunakan image Node.js versi LTS (20) berbasis Alpine yang ringan
FROM node:20-alpine

# Set working directory di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json (jika ada) ke working directory
COPY package*.json ./

# Install dependencies secara clean menggunakan npm ci (disarankan untuk environment CI/CD atau Docker)
# Jika package-lock.json tidak selalu up-to-date, bisa diganti dengan 'npm install'
RUN npm ci

# Salin seluruh file aplikasi (termasuk folder src, models, dll) ke dalam container
# (Pastikan .dockerignore sudah diset untuk mengabaikan node_modules lokal dan file .env)
COPY . .

# Ekspos port aplikasi yang digunakan (di index.js menggunakan port 3000)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]
