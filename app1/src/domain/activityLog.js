class ActivityLog {
    constructor(userId, action, timestamp, metadata) {
        this.userId = userId;
        this.action = action;
        this.timestamp = timestamp || new Date();
        this.metadata = metadata || {};
    }
}

module.exports = ActivityLog;