export async function callOpenAIGenerate(prompt: string, signal?: AbortSignal) {
 
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY

  console.log("Using OpenAI API Key:", apiKey);

  if (!apiKey) {
    alert("OpenAI API key is missing!");
    throw new Error("OpenAI API key not configured in REACT_APP_OPENAI_API_KEY");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(errorText); 
      throw new Error(errorText);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response generated.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    alert(error.message || "Unknown error occurred."); 
    throw new Error(error.message || "Unknown error occurred.");
  }
}



export async function submitDataToMockAPI(data: any) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Mock API Error: ${response.status} ${response.statusText} - ${text}`
      );
    }

    const result = await response.json();
    return result;
  } catch (err: any) {
    throw new Error(err.message || "Failed to submit data to the mock API.");
  }
}
