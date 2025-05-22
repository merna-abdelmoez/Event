const express = require('express');
const mongoose = require('mongoose');
const { consumeMessages } = require('./infrastructure/kafkaConsumer');
const { saveActivityLog, findActivityLogs } = require('./infrastructure/mongoRepository');

const app = express();
app.use(express.json());

const startServices = async() => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    await consumeMessages(process.env.KAFKA_BOOTSTRAP_SERVERS, process.env.KAFKA_TOPIC, async(log) => {
        await saveActivityLog(log);
    });
    console.log('Kafka consumer started');
};

app.get('/logs', async(req, res) => {
    try {
        const { userId, startDate, endDate, page, limit } = req.query;
        const result = await findActivityLogs({ userId, startDate, endDate, page, limit });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

startServices().catch(console.error);
app.listen(process.env.PORT, () => {
    console.log(`Consumer running on port ${process.env.PORT}`);
});