const kafka = require('kafka-node');

const consumeMessages = async(kafkaHost, topic, onMessage) => {
    const client = new kafka.KafkaClient({ kafkaHost });
    const consumer = new kafka.Consumer(client, [{ topic }], { autoCommit: false });
    consumer.on('message', async(message) => {
        try {
            const log = JSON.parse(message.value);
            await onMessage(log);
            consumer.commit((err, data) => {
                if (err) console.error('Commit error:', err);
            });
        } catch (err) {
            console.error('Consumer error:', err);
        }
    });
    consumer.on('error', (err) => console.error('Consumer error:', err));
};

module.exports = { consumeMessages };