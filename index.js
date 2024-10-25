const express = require('express');
const { randomUUID } = require('crypto');
const { MongoClient } = require('mongodb');

const main = () => {
  const app = express();

  const client = new MongoClient(
    'mongodb://root:example@mongo-primary:27017,mongo-secondary-1:27017,mongo-secondary-2:27017/?replicaSet=rs0&retryWrites=true&w=majority',
    {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      appName: 'qrcode-api',
    }
  );

  client.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    // Aqui você pode implementar estratégias de recuperação ou notificação
  });

  client.on('timeout', (err) => {
    console.warn('MongoDB connection timeout:', err);
    // Estratégia para reconexão ou alertas
  });

  client.on('close', () => {
    console.log('MongoDB connection closed');
    // Implementar lógica para tentar reconectar ou alertar o sistema
  });

  client.on('reconnect', () => {
    console.log('MongoDB reconnected');
    // Lógica para notificar quando houver sucesso na reconexão
  });

  const database = client.db('api-qrcode');

  app.get('/', async (req, res) => {
    try {
      const collection = database.collection('payment-order');
      const id = randomUUID();

      const order = { id, status: 'CREATED' };

      await collection.updateOne({ _id: id }, { $set: order });

      const orderInDatabase = await collection.findOne({ id });

      return res.json({ message: 'Teste', order: orderInDatabase });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  });

  const server = app.listen(3000, () => {
    console.log('App is on!');
  });

  process.on('SIGTERM', async () => {
    await client.close();
    server.close((err) => console.log(err));
    console.log('Close app!');
  });

  process.on('SIGINT', async () => {
    await client.close();
    server.close((err) => console.log(err));
    console.log('Close app!');
  });
};

main();
