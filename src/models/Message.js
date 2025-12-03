const { v4: uuidv4 } = require('uuid');

class Message {
  constructor(content, id = null) {
    this.id = id || uuidv4();
    this.content = content;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Método para actualizar el mensaje
  update(content) {
    this.content = content;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Método para convertir a JSON
  toJSON() {
    return {
      id: this.id,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Método estático para crear desde objeto
  static fromObject(obj) {
    const message = new Message(obj.content, obj.id);
    message.createdAt = obj.createdAt || new Date().toISOString();
    message.updatedAt = obj.updatedAt || new Date().toISOString();
    return message;
  }
}

module.exports = Message;
