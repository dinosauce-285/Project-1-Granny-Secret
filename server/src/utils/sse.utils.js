class SSEManager {
  constructor() {
    this.connections = new Map(); 
  }

  addConnection(userId, res) {
    const uid = Number(userId);
    if (!this.connections.has(uid)) {
      this.connections.set(uid, new Set());
    }
    this.connections.get(uid).add(res);
    console.log(
      `SSE: User ${uid} connected. Active connections: ${this.connections.get(uid).size}`,
    );
  }

  removeConnection(userId, res) {
    const uid = Number(userId);
    if (this.connections.has(uid)) {
      const userConnections = this.connections.get(uid);
      userConnections.delete(res);
      if (userConnections.size === 0) {
        this.connections.delete(uid);
      }
      console.log(
        `SSE: User ${uid} disconnected. Remaining connections: ${userConnections.size}`,
      );
    }
  }

  sendToUser(userId, data) {
    const uid = Number(userId);
    if (this.connections.has(uid)) {
      const userConnections = this.connections.get(uid);
      const payload = `data: ${JSON.stringify(data)}\n\n`;

      userConnections.forEach((res) => {
        try {
          res.write(payload);
        } catch (error) {
          console.error(`SSE: Error sending to user ${uid}:`, error);
          this.removeConnection(uid, res);
        }
      });
      return true;
    }
    return false;
  }
}

export const sseManager = new SSEManager();
