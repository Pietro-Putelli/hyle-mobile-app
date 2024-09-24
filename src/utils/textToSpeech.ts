import {PickProps} from '@/types/Book';
import {OPEN_AI_API_KEY} from '@env';
import * as FileSystem from 'expo-file-system';

const Buffer = require('buffer/').Buffer;

const TTS_URL = 'https://api.openai.com/v1/audio/speech';

const getTextToSpeechFromOpenAI = async (
  {pick, settings}: any,
  callback: (url: string | null) => void,
) => {
  const plainText = pick.parts.map((part: any) => part.content).join('');

  await fetch(TTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPEN_AI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: 'o',
      voice: settings.readerVoice?.toLowerCase() ?? 'shimmer',
      language: 'en',
    }),
  })
    .then(async response => {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const audioUrl = `${FileSystem.documentDirectory}${pick.id}.mp3`;

      await FileSystem.writeAsStringAsync(audioUrl, buffer.toString('base64'), {
        encoding: FileSystem.EncodingType.Base64,
      });

      callback(audioUrl);
    })
    .catch(error => {
      callback(null);
      console.error('[Text To Speech] Error:', error);
    });
};

export default getTextToSpeechFromOpenAI;
