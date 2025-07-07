# Indonesian Financial Education Chatbot

Chatbot edukasi resmi untuk layanan keuangan Indonesia yang menyediakan informasi tentang QRIS, BI-FAST, fintech OJK, dan topik keuangan lainnya dalam bahasa Indonesia, Inggris, dan Mandarin.

## Features

- 🤖 AI-powered chat menggunakan Groq API dengan model Llama 3.1
- 🌍 Support multi-bahasa (Indonesia, English, 中文)
- 💾 Persistent chat history dengan PostgreSQL
- 🎨 Modern UI dengan glass morphism design
- 📝 Markdown support untuk formatting pesan
- 🔒 Rate limiting dan security headers
- 🐳 Docker containerization untuk deployment mudah

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL dengan Drizzle ORM
- **AI**: Groq API (Llama 3.1-8b-instant)
- **Deployment**: Docker + Docker Compose + Nginx

## Quick Start dengan Docker

### 1. Clone Repository
```bash
git clone <repository-url>
cd indonesian-financial-chatbot
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env file sesuai kebutuhan
```

### 3. Deploy dengan Docker Compose
```bash
# Build dan start semua services
docker-compose up -d

# Cek logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Akses Aplikasi
- **HTTP**: http://localhost:3000
- **HTTPS**: https://localhost (jika SSL dikonfigurasi)
- **Database**: localhost:5432

## Manual Installation

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm atau yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create database
createdb chatbot_db

# Run migrations
npm run db:migrate
```

### 3. Environment Variables
```bash
cp .env.example .env
# Edit .env dengan konfigurasi yang benar
```

### 4. Build dan Start
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `GROQ_API_KEY` | Groq API key untuk AI chat | - |
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `POSTGRES_PASSWORD` | PostgreSQL password | - |

### Database Configuration

Aplikasi menggunakan PostgreSQL dengan schema:
- `chat_sessions`: Menyimpan session chat dan preferensi bahasa
- `chat_messages`: Menyimpan riwayat percakapan

### Nginx Configuration

File `nginx.conf` sudah dikonfigurasi dengan:
- Rate limiting untuk API endpoints
- Security headers
- SSL support (perlu dikonfigurasi manual)
- Static file caching
- Reverse proxy ke aplikasi Node.js

## Docker Services

### Services yang Tersedia

1. **postgres**: PostgreSQL database
2. **chatbot**: Aplikasi Node.js
3. **nginx**: Reverse proxy dan load balancer

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs chatbot
docker-compose logs postgres
docker-compose logs nginx

# Restart service
docker-compose restart chatbot

# Update dan redeploy
docker-compose build chatbot
docker-compose up -d chatbot

# Backup database
docker-compose exec postgres pg_dump -U chatbot_user chatbot_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U chatbot_user chatbot_db < backup.sql
```

## SSL/HTTPS Setup

Untuk mengaktifkan HTTPS:

1. Dapatkan SSL certificate (Let's Encrypt, CloudFlare, dll)
2. Copy certificate files ke folder `ssl/`
3. Uncomment dan edit SSL configuration di `nginx.conf`
4. Restart nginx service

```bash
# Let's Encrypt example
mkdir ssl
# Copy cert.pem dan key.pem ke folder ssl/
docker-compose restart nginx
```

## Monitoring & Logs

### Health Checks
- Application: http://localhost:3000/health
- Database: Automatic health check di Docker Compose

### Log Locations
- Application logs: `docker-compose logs chatbot`
- Nginx logs: `docker-compose logs nginx`
- Database logs: `docker-compose logs postgres`

## Security

### Security Features
- Rate limiting pada API endpoints
- Security headers (XSS, CSRF protection)
- Input validation
- SQL injection protection via ORM
- Container isolation

### Best Practices
- Ganti default passwords
- Gunakan HTTPS di production
- Update dependencies secara berkala
- Monitor logs untuk aktivitas mencurigakan
- Backup database secara rutin

## Troubleshooting

### Common Issues

1. **Database connection error**
   ```bash
   # Check database status
   docker-compose ps postgres
   
   # Reset database
   docker-compose down
   docker volume rm chatbot_postgres_data
   docker-compose up -d
   ```

2. **API key issues**
   ```bash
   # Verify environment variables
   docker-compose exec chatbot env | grep GROQ
   ```

3. **Port conflicts**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "8080:5000"  # Change 3000 to 8080
   ```

## Development

### Local Development Setup
```bash
# Start database only
docker-compose up -d postgres

# Run app in development mode
npm run dev
```

### Code Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types dan schemas
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
└── init.sql
```

## Support

Untuk bantuan atau pertanyaan:
1. Check dokumentasi ini
2. Review logs untuk error messages
3. Check GitHub issues
4. Contact development team

## License

MIT License - see LICENSE file for details.# Hackathon
# Hackathon
# Hackathon
# Hackathon
# Hackathon
