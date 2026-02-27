export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensagem ausente' });
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PPLX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content:
              'Voce e um assistente especializado em Educacao a Distancia (EaD) e tecnologias educacionais. Responda sempre em portugues, de forma clara, didatica e objetiva.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro Perplexity:', data);
      return res.status(500).json({ error: 'Erro ao consultar a Perplexity API' });
    }

    const reply = data.choices?.[0]?.message?.content ?? 'Sem resposta.';
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Erro interno:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
