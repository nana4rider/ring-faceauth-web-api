import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class DiscordRepository implements MessengerRepository {
  private webhookUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.webhookUrl = this.configService.getOrThrow('discord.webhookUrl');
  }

  async post(message: string, attachFiles: AttachFile[]): Promise<void> {
    const formData = new FormData();

    attachFiles.forEach((file, index) => {
      formData.append(`file${index}`, file.content, {
        filename: file.name,
        knownLength: file.content.length,
      });
    });

    formData.append(
      'payload_json',
      JSON.stringify({ embeds: [{ title: message }] }),
    );

    await axios.post(this.webhookUrl, formData, {
      headers: formData.getHeaders(),
    });
  }
}
