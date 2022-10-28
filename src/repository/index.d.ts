type AttachFile = {
  name: string;
  content: Buffer;
};

interface MessengerRepository {
  post(text: string, attachFiles: AttachFile[]): Promise<void>;
}

interface SmartLockRepository {
  unlock(): Promise<void>;
}

interface AnnouncementRepository {
  ding(): Promise<void>;

  announce(person: Person): Promise<void>;
}
