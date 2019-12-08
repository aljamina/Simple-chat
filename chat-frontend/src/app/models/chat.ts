export class Chat {
    receiverID: String;
    senderID: String;
    sentTime: Date;
  constructor(receiverID: String, senderID: String, sentTime: Date) {
    this.receiverID=receiverID;
    this.senderID=senderID;
    this.sentTime=sentTime;
  }
}
