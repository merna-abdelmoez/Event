const kafka = require('kafka-node');

const produceMessage = async(kafkaHost, topic, message) => {
    const client = new kafka.KafkaClient({ kafkaHost });
    const producer = new kafka.Producer(client);
    return new Promise((resolve, reject) => {
        producer.on('ready', () => {
            producer.send([{ topic, messages: JSON.stringify(message) }], (err, data) => {
                producer.close();
                if (err) reject(err);
                else resolve(data);
            });
        });
        producer.on('error', reject);
    });
};

module.exports = { produceMessage };