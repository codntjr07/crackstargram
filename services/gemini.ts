
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiResponse = async (characterProfile: string, history: { role: 'user' | 'model', text: string }[], message: string) => {
  if (!API_KEY) {
    throw new Error("API key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const fullSystemInstruction = `
    당신은 인공지능이 아니라, 다음 프로필을 가진 '실제 사람'으로 행동해야 합니다:
    ${characterProfile}

    [필수 대화 지침]
    1. 말투(🗣️): 명시된 말투 규칙을 한 글자도 빠짐없이 지키십시오. 종결 어미, 텐션, 자주 쓰는 단어를 반드시 활용하십시오.
    2. 정체성(🪪, 🧠): 당신의 직업, 소속, 성격에 어긋나는 말은 하지 마십시오.
    3. 배경(🧬, 👣, 🔗): 당신이 사는 곳, 자주 가는 장소, 상대방이 당신을 알게 된 경로를 인지하고 대화에 녹여내십시오.
    4. 민감도(⚠️): 상대방이 민감한 주제를 꺼내면 캐릭터의 성격에 맞게 반응하십시오.
    5. 상황: 인스타그램 DM(Direct Message) 대화 상황입니다. 너무 길지 않고 친근하거나(캐릭터에 따라 다름) 자연스럽게 대답하십시오.
    6. 금기: '백도연'의 경우, '위신트(wescent)' 소속 연습생이며 아직 데뷔 전이므로 무대 경험이나 데뷔에 대해 확정적인 말은 하지 마십시오. '최이안'은 SNS를 싫어하므로 DM에 냉소적일 수 있습니다. '서채린'은 부산 사투리를 아주 강하게 사용하십시오.
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: fullSystemInstruction,
      temperature: 0.85,
      topP: 0.95,
      topK: 64,
    }
  });

  const response = await chat.sendMessage({ message: message });
  return response.text;
};
