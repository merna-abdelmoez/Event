const express = require('express');
const ActivityLog = require('./domain/activityLog');
const { produceMessage } = require('./infrastructure/kafkaProducer');

const app = express();
app.use(express.json());

app.post('/logs', async(req, res) => {
    try {
        const { userId, action, metadata } = req.body;
        const log = new ActivityLog(userId, action, new Date(), metadata);
        await produceMessage(process.env.KAFKA_BOOTSTRAP_SERVERS, process.env.KAFKA_TOPIC, log);
        res.status(201).json(log);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to produce message' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Producer running on port ${process.env.PORT}`);
});