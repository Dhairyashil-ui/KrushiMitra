export type OllamaResponse = {
  response: string;
  // Other streaming fields from Ollama are ignored here
};

export async function queryOllama(prompt: string, serverIp: string): Promise<string> {
  // Use the IP from environment variables if available, otherwise use the provided serverIp
  const ollamaServerIp = process.env.EXPO_PUBLIC_OLLAMA_SERVER_IP || '127.0.0.1';

  const endpoint = `http://${ollamaServerIp}:11434/api/generate`;
  console.log('Querying Ollama at:', endpoint);
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'llama3', prompt, stream: false }),
    });

    if (!res.ok) {
      throw new Error(`Ollama request failed with status ${res.status}`);
    }

    const data = (await res.json()) as OllamaResponse;
    if (!data || typeof data.response !== 'string') {
      throw new Error('Invalid Ollama response');
    }

    return data.response;
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
    throw new Error(`Failed to connect to Ollama at ${endpoint}. Make sure Ollama is running with network binding and the IP is correct.`);
  }
}

// Async generator for streaming partial responses from Ollama
export async function* queryOllamaStream(prompt: string, serverIp: string): AsyncGenerator<string> {
  // Use the IP from environment variables if available, otherwise use the provided serverIp
  const ollamaServerIp = process.env.EXPO_PUBLIC_OLLAMA_SERVER_IP || serverIp;
  const endpoint = `http://${ollamaServerIp}:11434/api/generate`;
  console.log('Streaming from Ollama at:', endpoint);
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'llama3', prompt, stream: true }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Ollama streaming request failed with status ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);
          if (!line) continue;
          try {
            const obj = JSON.parse(line) as Partial<OllamaResponse> & { done?: boolean };
            if (typeof obj.response === 'string' && obj.response.length > 0) {
              yield obj.response;
            }
            if ((obj as any).done === true) {
              return;
            }
          } catch {
            // Ignore malformed lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Error connecting to Ollama streaming API:', error);
    throw new Error(`Failed to connect to Ollama streaming API at ${endpoint}. Make sure Ollama is running with network binding and the IP is correct.`);
  }
}


