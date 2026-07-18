const fastify = require('fastify')({ logger: true });

// Basic health check route for Team Platform & Security
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'Platform & Security' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Platform & Security server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
