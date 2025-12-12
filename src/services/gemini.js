import axios from 'axios';

const API_KEY = 'AIzaSyANOxt6OnM5cZkTKSzCJJCFTKyOzLaybfg';

export const askGeminiAboutBook = async (title, author) => {
    const question = `ช่วยสรุปย่อและบอกเกร็ดความรู้ที่น่าสนใจเกี่ยวกับหนังสือเรื่อง "${title}" เขียนโดย ${author} ให้หน่อย ขอความยาวไม่เกิน 100 คำ`;

    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    try {
        const payload = {
            contents: [{ parts: [{ text: question }] }]
        };

        const result = await axios.post(apiEndpoint, payload);
        return result.data.candidates[0].content.parts[0].text;

    } catch (err) {
        console.error("AI Error:", err);
        if (err.response) {
            return `เกิดข้อผิดพลาด: ${err.response.data.error.message}`;
        }
        return "ไม่สามารถเชื่อมต่อกับ AI ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
    }
};
