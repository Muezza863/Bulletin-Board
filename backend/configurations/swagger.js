import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bulletin Board API Documentation',
      version: '1.0.0',
      description: 'Dokumentasi API untuk sistem Bulletin Board dengan fitur Kuota, Premium, dan Backblaze Storage',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Lokasi file yang berisi komentar dokumentasi
  apis: ['./route/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;