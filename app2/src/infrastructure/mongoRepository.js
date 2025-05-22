const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: String,
    action: String,
    timestamp: { type: Date, default: Date.now },
    metadata: Object
});
activityLogSchema.index({ userId: 1, timestamp: -1 });

const ActivityLogModel = mongoose.model('ActivityLog', activityLogSchema);

const saveActivityLog = async(log) => {
    const activityLog = new ActivityLogModel(log);
    await activityLog.save();
};

const findActivityLogs = async({ userId, startDate, endDate, page = 1, limit = 10 }) => {
    const query = {};
    if (userId) query.userId = userId;
    if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    const logs = await ActivityLogModel.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ timestamp: -1 });
    const total = await ActivityLogModel.countDocuments(query);
    return { logs, total, page, limit };
};

module.exports = { saveActivityLog, findActivityLogs };